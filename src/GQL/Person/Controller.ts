import type { Prisma as Client } from "@prisma/client";
import { Prisma } from "DB/Client";
import { Access } from "./Access";
import type { IFetchPeople } from "./Types";

export class PersonController extends Access {
  public static fetch = ({ organizationId, ...pagination }: IFetchPeople) => {
    return Prisma.transact(async client => {
      const results = await client.person.findMany({
        where: { organizationId },
        ...Prisma.paginationArguments(pagination),
        orderBy: {
          user: {
            name: "asc",
          },
        },
        select: {
          id: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      const list = results.map(item => ({
        id: item.id,
        name: item.user.name,
      }));
      return { list, cursor: list[list.length - 1]?.id };
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
