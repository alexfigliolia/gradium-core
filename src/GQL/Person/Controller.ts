import type { Prisma as Client } from "@prisma/client";
import { Prisma } from "DB/Client";
import { Access } from "./Access";
import type { IFetchPeople } from "./Types";

export class PersonController extends Access {
  public static fetch = ({ organizationId, cursor, limit }: IFetchPeople) => {
    return Prisma.transact(async client => {
      const hasCursor = typeof cursor === "number";
      const results = await client.person.findMany({
        where: { organizationId },
        take: limit ?? 10,
        skip: hasCursor ? 1 : 0,
        orderBy: {
          user: {
            name: "asc",
          },
        },
        cursor: hasCursor
          ? {
              id: cursor,
            }
          : undefined,
        select: {
          id: true,
          organizationId: true,
          userId: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      const list = results.map(item => ({
        id: item.id,
        organizationId: item.organizationId,
        userId: item.userId,
        name: item.user.name,
      }));
      return { list, cursor: list[list.length - 1]?.id ?? 0 };
    });
  };

  public static async fetchPerson<
    T extends Client.PersonSelect = typeof this.ROLE_SELECTION,
  >(organizationId: number, userId: number, access = this.ROLE_SELECTION as T) {
    return Prisma.transact(client => {
      return client.person.findUnique({
        where: {
          identity: {
            userId,
            organizationId,
          },
        },
        select: access,
      });
    });
  }
}
