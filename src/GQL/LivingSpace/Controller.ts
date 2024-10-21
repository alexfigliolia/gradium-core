import { Prisma } from "DB/Client";
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
    return Prisma.transact(client => {
      return client.livingSpace.update({
        where: { id },
        data: { deleted: true },
        select: this.BASIC_SELECTION,
      });
    });
  };
}
