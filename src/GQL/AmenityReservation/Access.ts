import type { Prisma as Client } from "@prisma/client";
import { Prisma } from "DB/Client";
import { PersonController } from "GQL/Person/Controller";

export class Access {
  public static ONE_HOUR = 1000 * 60 * 60;
  public static ONE_DAY = this.ONE_HOUR * 24;
  public static DEFAULT_SELECTION = {
    id: true,
    start: true,
    end: true,
    amenity: {
      select: {
        id: true,
        name: true,
      },
    },
    person: {
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    },
  } as const;

  public static list(whereClauses: Client.AmenityReservationWhereInput[] = []) {
    return Prisma.transact(client => {
      return client.amenityReservation.findMany({
        where: {
          AND: whereClauses,
        },
        select: this.DEFAULT_SELECTION,
      });
    });
  }

  public static toGQL(...list: Awaited<ReturnType<(typeof Access)["list"]>>) {
    return list.map(item => {
      const { person, ...rest } = item;
      return {
        ...rest,
        person: PersonController.toPersonType(person),
      };
    });
  }
}
