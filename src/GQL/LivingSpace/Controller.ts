import { GraphQLError } from "graphql";
import { Prisma } from "DB/Client";
import { IGradiumImageType } from "GQL/Media/Types";
import { MediaClient } from "Media/Client";
import { Access } from "./Access";
import type { IUpdateProperty } from "./Types";

export class LivingSpaceController extends Access {
  public static fetchAll = async (propertyId: number) => {
    return Prisma.transact(client => {
      return client.livingSpace.findMany({
        where: {
          AND: [{ propertyId }, { deleted: false }],
        },
        select: this.BASIC_SELECTION,
      });
    });
  };

  public static create = (propertyId: number) => {
    return Prisma.transact(client => {
      return client.livingSpace.create({
        data: { propertyId },
        select: this.BASIC_SELECTION,
      });
    });
  };

  public static createOrUpdate = async ({
    id,
    ...data
  }: Omit<IUpdateProperty, "organizationId">) => {
    return Prisma.transact(client => {
      return client.livingSpace.upsert({
        where: {
          id: id ?? -1,
        },
        create: data,
        update: data,
        select: this.BASIC_SELECTION,
      });
    });
  };

  public static delete = (id: number) => {
    return Prisma.transact(async client => {
      const space = await client.livingSpace.findUnique({
        where: { id },
        select: {
          _count: {
            select: {
              leases: true,
              amenityReservations: true,
            },
          },
        },
      });
      if (!space) {
        throw new GraphQLError(
          "This space has already been deleted. Please refresh your page.",
        );
      }
      if (space._count.leases || space._count.amenityReservations) {
        return client.livingSpace.update({
          where: { id },
          data: { deleted: true },
          select: this.BASIC_SELECTION,
        });
      }
      const deletedSpace = await client.livingSpace.delete({
        where: { id },
        select: this.BASIC_SELECTION,
      });
      await Promise.all([
        MediaClient.destroyAssets(
          IGradiumImageType.livingSpaceImage,
          ...deletedSpace.images,
        ),
        MediaClient.destroyAssets(
          IGradiumImageType.livingSpaceFloorPlan,
          ...deletedSpace.floorPlans,
        ),
      ]);
      return deletedSpace;
    });
  };
}
