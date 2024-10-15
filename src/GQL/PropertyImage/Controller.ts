import { Prisma } from "DB/Client";
import type { ICreatePropertyImage } from "./Types";

export class PropertyImageController {
  public static create = (
    data: Omit<ICreatePropertyImage, "organizationId">,
  ) => {
    return Prisma.transact(async client => {
      return client.propertyImage.create({
        data,
        select: {
          id: true,
          url: true,
        },
      });
    });
  };

  public static delete = (id: number) => {
    return Prisma.transact(async client => {
      return client.propertyImage.delete({
        where: {
          id,
        },
        select: {
          id: true,
          url: true,
        },
      });
    });
  };
}
