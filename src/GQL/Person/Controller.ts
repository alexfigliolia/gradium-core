import { Prisma } from "DB/Client";
import type { IFetchPeople } from "./Types";

export class PersonController {
  public static fetch = ({ organizationId, cursor, limit }: IFetchPeople) => {
    return Prisma.transact(async client => {
      const results = await client.person.findMany({
        where: { organizationId },
        take: limit,
        orderBy: {
          user: {
            name: "asc",
          },
        },
        cursor: {
          id: cursor,
        },
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
      return { list, cursor: list[list.length - 1].id };
    });
  };
}
