import { Prisma } from "DB/Client";
import type { ICreateCharge } from "./Types";

export class ReservationChargeController {
  public static create(data: ICreateCharge) {
    return Prisma.transact(client => {
      return client.reservationCharge.create({
        data,
      });
    });
  }

  public static update(id: number, data: ICreateCharge) {
    return Prisma.transact(client => {
      return client.reservationCharge.update({
        where: { id },
        data,
      });
    });
  }

  public static delete(id: number) {
    return Prisma.transact(client => {
      return client.reservationCharge.delete({
        where: { id },
      });
    });
  }

  public static deleteMany(ids: number[]) {
    if (!ids.length) {
      return { count: 0 };
    }
    return Prisma.transact(client => {
      return client.reservationCharge.deleteMany({
        where: { id: { in: ids } },
      });
    });
  }
}
