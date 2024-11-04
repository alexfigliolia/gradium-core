import { GraphQLError } from "graphql";
import { Prisma } from "DB/Client";
import { IGradiumImageType } from "GQL/Media/Types";
import { MediaClient } from "Media/Client";
import { Dates } from "Tools/Dates";
import { Validators } from "Tools/Validators";
import { Access } from "./Access";
import type { IUpdateAmenity } from "./Types";

export class AmenityController extends Access {
  public static readonly DEFAULT_OPEN = Dates.ISOTime(
    Dates.dateTime(9).toISOString(),
  );
  public static readonly DEFAULT_CLOSE = Dates.ISOTime(
    Dates.dateTime(21).toISOString(),
  );
  public static readonly FLOAT_KEYS: (keyof IUpdateAmenity)[] = ["price"];

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
        data: {
          propertyId,
          open: this.DEFAULT_OPEN,
          close: this.DEFAULT_CLOSE,
        },
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
              reservations: true,
            },
          },
        },
      });
      if (!amenity) {
        throw new GraphQLError(
          "This amenity has already been deleted. Please refresh your page",
        );
      }
      if (amenity._count.reservations) {
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

  public static getParameters(id: number) {
    return Prisma.transact(client => {
      return client.amenity.findUnique({
        where: { id },
        select: {
          name: true,
          open: true,
          close: true,
          price: true,
          billed: true,
        },
      });
    });
  }

  public static getIDs(propertyId: number) {
    return Prisma.transact(async client => {
      const result = await client.property.findUnique({
        where: { id: propertyId },
        select: {
          amenities: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!result) {
        return [];
      }
      return result.amenities.map(a => a.id);
    });
  }

  public static timeToInt(time: string) {
    return parseInt(time.split(":").join("") || "0");
  }

  private static validate(space: Partial<IUpdateAmenity>) {
    for (const key of this.FLOAT_KEYS) {
      if (key in space) {
        if (!Validators.validateFloat(space[key])) {
          throw new GraphQLError(this.saveError(key, space.name));
        }
      }
    }
    const { open = this.DEFAULT_OPEN, close = this.DEFAULT_CLOSE } = space;
    if (!open || !close) {
      throw new GraphQLError(
        "An amenity must have a starting and ending hour of operations",
      );
    }
  }

  private static saveError(key: string, name?: string) {
    if (name) {
      return `<strong>${name}</strong> didn't save properly. Please check the value for <strong>${key}</strong>.`;
    }
    return `Your amenity didn't save property. Please check the value for <strong>${key}</strong>.`;
  }
}
