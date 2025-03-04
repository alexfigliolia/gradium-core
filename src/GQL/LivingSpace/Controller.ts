import { addMonths } from "date-fns";
import { GraphQLError } from "graphql";
import type { Prisma as PrismaType } from "@prisma/client";
import { Prisma } from "DB/Client";
import { IGradiumImageType } from "GQL/Media/Types";
import type { IdentifyProperty } from "GQL/Property/Types";
import { MediaClient } from "Media/Client";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import { Validators } from "Tools/Validators";
import { Access } from "./Access";
import type { IFetchAvailableSpaces, IUpdateLivingSpace } from "./Types";

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

  public static identifySpaces = async (propertyId: number) => {
    return Prisma.transact(client => {
      return client.livingSpace.findMany({
        where: {
          AND: [{ propertyId }, { deleted: false }],
        },
        select: {
          id: true,
          name: true,
        },
      });
    });
  };

  public static create = ({ propertyId, organizationId }: IdentifyProperty) => {
    return Prisma.transact(client => {
      return client.livingSpace.create({
        data: { propertyId, organizationId },
        select: this.BASIC_SELECTION,
      });
    });
  };

  public static createOrUpdate = async ({
    id,
    ...data
  }: IUpdateLivingSpace) => {
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

  public static findAvailableSpaces = ({
    organizationId,
    search,
    ...pagination
  }: IFetchAvailableSpaces) => {
    return Prisma.transact(async client => {
      const where: PrismaType.LivingSpaceWhereInput[] = [
        { organizationId },
        {
          leases: {
            none: {
              AND: [
                {
                  OR: [
                    {
                      start: {
                        gte: new Date(),
                      },
                    },
                    {
                      end: {
                        gte: new Date(),
                      },
                    },
                  ],
                },
                {
                  status: {
                    not: {
                      in: ["terminated", "complete"],
                    },
                  },
                },
              ],
            },
          },
        },
      ];
      if (search) {
        where.push({
          name: {
            contains: search,
            mode: "insensitive",
          },
        });
      }
      const pagingArgs = Prisma.paginationArguments(pagination);
      const list = await client.livingSpace.findMany({
        where: { AND: where },
        select: this.AVAILABLE_NOW_SELECTION,
        ...pagingArgs,
      });
      return SchemaBuilder.toPaginationResult(
        list.map(this.transformToAvailableNow),
        pagingArgs.take,
      );
    });
  };

  public static findSpacesBecomingAvailable = ({
    organizationId,
    search,
    ...pagination
  }: IFetchAvailableSpaces) => {
    return Prisma.transact(async client => {
      const where: PrismaType.LivingSpaceWhereInput[] = [
        { organizationId },
        {
          leases: {
            some: {
              AND: [
                {
                  end: {
                    lte: addMonths(new Date(), 6),
                  },
                },
                {
                  end: {
                    gt: new Date(),
                  },
                },
                {
                  status: {
                    not: {
                      in: ["complete", "terminated"],
                    },
                  },
                },
              ],
            },
          },
        },
      ];
      if (search) {
        where.push({
          name: {
            contains: search,
            mode: "insensitive",
          },
        });
      }
      const pagingArgs = Prisma.paginationArguments(pagination);
      const list = await client.livingSpace.findMany({
        where: {
          AND: where,
        },
        select: this.AVAILABLE_SOON_SELECTION,
        ...pagingArgs,
      });
      return SchemaBuilder.toPaginationResult(
        list.map(this.transformToAvailableSoon),
        pagingArgs.take,
      );
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
