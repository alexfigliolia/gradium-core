import { GraphQLError } from "graphql";
import { PersonRole } from "@prisma/client";
import { Prisma } from "DB/Client";
import type { INameAndOrgID } from "GQL/Organization/Types";
import { Permission } from "Tools/Permission";
import type { Session } from "Types/GraphQL";
import { Access } from "./Access";
import type { IdentifyProperty, IUpdateBasicPropertyInfo } from "./Types";

export class PropertyController extends Access {
  private static NON_ALPHA_NUMERICS = new RegExp("[^A-Za-z0-9]");

  public static async fetch(userId: number, organizationId: number) {
    const access = await this.getUserAccess(userId, organizationId);
    if (access === "*") {
      return this.fetchAll(organizationId);
    }
    return this.fetchByIDs(organizationId, access);
  }

  public static fetchAll(organizationId: number) {
    return Prisma.transact(client => {
      return client.property.findMany({
        where: {
          organizationId,
        },
        include: this.BASIC_ATTRIBUTE_SELECTION,
      });
    });
  }

  public static fetchByIDs(organizationId: number, ids: number[]) {
    return Prisma.transact(client => {
      return client.property.findMany({
        where: {
          organizationId,
          id: {
            in: ids,
          },
        },
        include: this.BASIC_ATTRIBUTE_SELECTION,
      });
    });
  }

  public static fetchById({ organizationId, propertyId }: IdentifyProperty) {
    return Prisma.transact(client => {
      return client.property.findUnique({
        where: {
          organizationId,
          id: propertyId,
        },
        include: this.BASIC_ATTRIBUTE_SELECTION,
      });
    });
  }

  public static updateBasicInfo = async ({
    propertyId,
    organizationId,
    ...data
  }: IUpdateBasicPropertyInfo) => {
    await Prisma.transact(client => {
      return client.property.update({
        where: {
          id: propertyId,
        },
        data,
      });
    });
    return this.fetchById({ propertyId, organizationId });
  };

  public static create(args: INameAndOrgID) {
    return Prisma.transact(async client => {
      const exists = await client.property.findFirst({
        where: args,
        select: {
          id: true,
        },
      });
      if (exists) {
        throw new GraphQLError(
          `A property with this name already exists within your organization`,
        );
      }
      let attemps = 0;
      const max = 10;
      let appendage = "";
      while (attemps < max) {
        const slug = this.createSlug(args.name, appendage);
        if (await this.matchSlug(slug, args.organizationId)) {
          attemps++;
          appendage = (attemps + 1).toString();
          continue;
        }
        return client.property.create({
          data: {
            ...args,
            slug,
          },
          include: this.BASIC_ATTRIBUTE_SELECTION,
        });
      }
      throw new GraphQLError(
        "We encountered an error creating your property. Would you mind trying a different name? It can always be updated later.",
      );
    });
  }

  private static createSlug(name: string, ...appendages: string[]) {
    const result: string[] = [];
    for (const char of name) {
      if (this.NON_ALPHA_NUMERICS.test(char)) {
        if (char === " " || char === "_") {
          result.push("-");
        }
      } else {
        result.push(char.toLowerCase());
      }
    }
    result.push(...appendages);
    return result.join("");
  }

  private static matchSlug(slug: string, organizationId: number) {
    return Prisma.transact(async client => {
      return client.property.findFirst({
        where: {
          slug,
          organizationId,
        },
        select: {
          id: true,
        },
      });
    });
  }

  public static wrapTransaction<F extends (...args: any[]) => any>(
    session: Session,
    organizationId: number,
    callback: F,
  ) {
    return async (...args: Parameters<F>) => {
      if (
        !(await Permission.hasOrganizationPermissions(
          session,
          organizationId,
          PersonRole.manager,
        ))
      ) {
        throw new GraphQLError(
          "You do not have permission to modify this property",
        );
      }
      return callback(...args);
    };
  }
}
