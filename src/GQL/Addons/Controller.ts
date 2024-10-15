import { GraphQLError } from "graphql";
import { Prisma } from "DB/Client";
import type { IModifyAddons } from "./Types";

export class AddonController {
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

  public static modifyAddons = async <
    T extends Omit<IModifyAddons, "organizationId">,
  >({
    propertyId,
    deletions,
    additions,
  }: T) => {
    await Prisma.transact(async client => {
      try {
        if (deletions.length) {
          await client.propertyAddon.deleteMany({
            where: {
              id: {
                in: deletions,
              },
            },
          });
        }
        if (additions.length) {
          await client.propertyAddon.createMany({
            data: additions.map(addon => ({
              propertyId,
              type: addon,
            })),
          });
        }
      } catch (error) {
        throw new GraphQLError(
          "Something went wrong when updating your addons. Would you mind refreshing the page and trying again?",
        );
      }
    });
    return this.getAddons(propertyId);
  };
}
