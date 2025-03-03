import { Prisma } from "DB/Client";
import type { IFetchLeases } from "./Types";

export class LeaseController {
  public static fetch = ({ organizationId, cursor, limit }: IFetchLeases) => {
    return Prisma.transact(client => {
      return client.lease.findMany({
        where: { organizationId },
        cursor: {
          id: cursor,
        },
        take: limit,
      });
    });
  };
}
