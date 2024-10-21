import { Prisma } from "DB/Client";
import { Access } from "./Access";
import type { IUpdateAmenity } from "./Types";

export class AmenityController extends Access {
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
    return Prisma.transact(client => {
      return client.amenity.update({
        where: { id },
        data: { deleted: true },
        select: this.BASIC_SELECTION,
      });
    });
  };
}
