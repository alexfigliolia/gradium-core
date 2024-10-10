import { GraphQLError } from "graphql";
import { PersonRole, type PropertyAddonType } from "@prisma/client";
import { Prisma } from "DB/Client";
import { Permission } from "Tools/Permission";
import type { Session } from "Types/GraphQL";

export class AddonController {
  public static createAddon = async (
    propertyId: number,
    type: PropertyAddonType,
  ) => {
    await Prisma.transact(async client => {
      try {
        await client.propertyAddon.create({
          data: {
            type,
            propertyId,
          },
        });
      } catch (error) {
        throw new GraphQLError(
          "This addon already exists. Please refresh your page",
        );
      }
    });
    return this.getAddons(propertyId);
  };

  public static createAddons = async (
    propertyId: number,
    types: PropertyAddonType[],
  ) => {
    await Prisma.transact(async client => {
      await client.propertyAddon.createMany({
        data: types.map(type => ({ propertyId, type })),
        skipDuplicates: true,
      });
    });
    return this.getAddons(propertyId);
  };

  public static getAddons(propertyId: number) {
    return Prisma.transact(client => {
      return client.propertyAddon.findMany({
        where: {
          propertyId,
        },
        select: {
          id: true,
          type: true,
        },
      });
    });
  }

  public static deleteAddon = async (id: number, propertyId: number) => {
    await Prisma.transact(async client => {
      try {
        await client.propertyAddon.delete({
          where: { id },
        });
      } catch (error) {
        throw new GraphQLError(
          "Something went wrong when deleting this addon. Please refresh your page.",
        );
      }
    });
    return this.getAddons(propertyId);
  };

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
          "You do not have permission to modify the configuration of this property",
        );
      }
      return callback(...args);
    };
  }
}
