import { GraphQLError } from "graphql";
import { Prisma } from "DB/Client";
import { IGradiumImageType } from "GQL/Media/Types";
import { MediaClient } from "Media/Client";
import { Validators } from "Tools/Validators";
import { Access } from "./Access";
import type { IUpdateAmenity } from "./Types";

export class AmenityController extends Access {
  public static readonly FLOAT_KEYS: (keyof IUpdateAmenity)[] = [
    "price",
    "size",
  ];
  public static fetchAll = async (propertyId: number) => {
    return Prisma.transact(client => {
      return client.amenity.findMany({
        where: {
          AND: [{ propertyId }, { deleted: false }],
        },
        select: this.BASIC_SELECTION,
      });
    });
  };

  public static create = (propertyId: number) => {
    return Prisma.transact(client => {
      return client.amenity.create({
        data: { propertyId },
        select: this.BASIC_SELECTION,
      });
    });
  };

  public static createOrUpdate = async ({
    id,
    ...data
  }: Omit<IUpdateAmenity, "organizationId">) => {
    this.validate(data);
    return Prisma.transact(client => {
      return client.amenity.upsert({
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
      const amenity = await client.amenity.findUnique({
        where: { id },
        select: {
          _count: {
            select: {
              amenityReservations: true,
            },
          },
        },
      });
      if (!amenity) {
        throw new GraphQLError(
          "This amenity has already been deleted. Please refresh your page",
        );
      }
      if (amenity._count.amenityReservations) {
        return client.amenity.update({
          where: { id },
          data: { deleted: true },
          select: this.BASIC_SELECTION,
        });
      }
      const deletedAmenity = await client.amenity.delete({
        where: { id },
        select: this.BASIC_SELECTION,
      });
      await Promise.all([
        MediaClient.destroyAssets(
          IGradiumImageType.amenityImage,
          ...deletedAmenity.images,
        ),
        MediaClient.destroyAssets(
          IGradiumImageType.amenityFloorPlan,
          ...deletedAmenity.floorPlans,
        ),
      ]);
      return deletedAmenity;
    });
  };

  private static validate(space: Partial<IUpdateAmenity>) {
    for (const key of this.FLOAT_KEYS) {
      if (key in space) {
        if (!Validators.validateFloat(space[key])) {
          throw new GraphQLError(
            `The value specified for <strong>${key}</strong> is invalid`,
          );
        }
      }
    }
  }
}
