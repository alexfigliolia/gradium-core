import { GraphQLError } from "graphql";
import { Prisma } from "DB/Client";
import { Access } from "./Access";
import type {
  ICreateProperty,
  IdentifyProperty,
  IUpdateBasicPropertyInfo,
} from "./Types";

export class PropertyController extends Access {
  public static async fetch(userId: number, organizationId: number) {
    const access = await this.getUserAccess(userId, organizationId);
    if (access === "*") {
      return this.fetchAll(organizationId);
    }
    return this.fetchByIDs(organizationId);
  }

  public static fetchAll(organizationId: number) {
    return Prisma.transact(client => {
      return client.property.findMany({
        where: {
          AND: [{ organizationId }, { deleted: false }],
        },
        include: this.BASIC_ATTRIBUTE_SELECTION,
      });
    });
  }

  public static fetchByIDs(organizationId: number) {
    return Prisma.transact(client => {
      return client.property.findMany({
        where: {
          AND: [{ organizationId }, { deleted: false }],
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

  public static updateBasicInfo = ({
    propertyId,
    organizationId,
    ...data
  }: IUpdateBasicPropertyInfo) => {
    return Prisma.transact(client => {
      return client.property.update({
        where: {
          organizationId,
          id: propertyId,
        },
        data,
        include: this.BASIC_ATTRIBUTE_SELECTION,
      });
    });
  };

  public static create(args: ICreateProperty) {
    const { organizationId, name } = args;
    return Prisma.transact(async client => {
      const exists = await client.property.findFirst({
        where: {
          AND: [{ name }, { organizationId }],
        },
        select: {
          id: true,
        },
      });
      if (exists) {
        throw new GraphQLError(
          "A property with this name already exists within your organization",
        );
      }
      const slugs = await this.allSlugs(organizationId);
      let attemps = 0;
      const max = 10;
      let appendage = "";
      while (attemps < max) {
        const slug = this.createSlug(args.name, appendage);
        if (slugs.has(slug)) {
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
        "We encountered an error creating your property. Please try a different name.",
      );
    });
  }
}
