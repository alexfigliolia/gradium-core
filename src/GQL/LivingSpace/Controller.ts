import { GraphQLError } from "graphql";
import { Prisma } from "DB/Client";
import { IGradiumImageType } from "GQL/Media/Types";
import { MediaClient } from "Media/Client";
import { Validators } from "Tools/Validators";
import { Access } from "./Access";
import type { IUpdateLivingSpace } from "./Types";

export class LivingSpaceController extends Access {
  public static readonly FLOAT_KEYS: (keyof IUpdateLivingSpace)[] = ["size"];
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
  }: Omit<IUpdateLivingSpace, "organizationId">) => {
    this.validate(data);
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
            },
          },
        },
      });
      if (!space) {
        throw new GraphQLError(
          "This space has already been deleted. Please refresh your page.",
        );
      }
      if (space._count.leases) {
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

  private static validate(space: Partial<IUpdateLivingSpace>) {
    for (const key of this.FLOAT_KEYS) {
      if (key in space) {
        if (!Validators.validateFloat(space[key])) {
          throw new GraphQLError(this.saveError(key, space.name));
        }
      }
    }
  }

  private static saveError(key: string, name?: string) {
    if (name) {
      return `<strong>${name}</strong> didn't save properly. Please check the value for <strong>${key}</strong>.`;
    }
    return `Your amenity didn't save property. Please check the value for <strong>${key}</strong>.`;
  }
}
