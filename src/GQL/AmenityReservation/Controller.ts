import { isAfter, isBefore, isEqual } from "date-fns";
import { GraphQLError } from "graphql";
import type { Prisma as Client } from "@prisma/client";
import { BillFrequency } from "@prisma/client";
import { Prisma } from "DB/Client";
import { AmenityController } from "GQL/Amenity/Controller";
import { ReservationChargeController } from "GQL/ReservationCharge/Controller";
import { Access } from "./Access";
import type {
  ICreateReservation,
  IListReservations,
  IUpdateReservation,
} from "./Types";

export class AmenityReservationController extends Access {
  public static listReservations = async (args: IListReservations) => {
    const whereClauses: Client.AmenityReservationWhereInput[] = [
      {
        amenity: {
          propertyId: args.propertyId,
        },
      },
      {
        cancelled: false,
      },
      {
        date: {
          equals: args.date,
        },
      },
    ];
    if (args?.amenityIds?.length) {
      whereClauses.push({
        amenityId: {
          in: args.amenityIds,
        },
      });
    }
    const result = await this.list(whereClauses);
    return this.toGQL(...result);
  };

  public static createAmenityReservation = async (
    payload: Omit<ICreateReservation, "propertyId" | "organizationId">,
  ) => {
    const { price, billed } = await this.validateConstraints(payload, "create");
    const { charge = true, ...data } = payload;
    const { start, end } = data;
    return Prisma.transact(async client => {
      const reservation = await client.amenityReservation.create({
        data,
        select: this.DEFAULT_SELECTION,
      });
      if (charge !== false && price !== "0") {
        try {
          await ReservationChargeController.create({
            personId: data.personId,
            reservationId: reservation.id,
            amount: this.generateTotal(start, end, price, billed),
          });
        } catch (error) {
          await this.rollBack(reservation.id);
          throw new GraphQLError(
            "Something went wrong while creating a bill for this reservation. Please check the price and bill frequency for this amenity on the amenity configuration page",
          );
        }
      }
      return this.toGQL(reservation)[0];
    });
  };

  public static updateAmenityReservation = async (
    payload: Omit<IUpdateReservation, "propertyId" | "organizationId">,
  ) => {
    const { price, billed } = await this.validateConstraints(payload, "modify");
    const { id, charge = true, ...data } = payload;
    const { start, end } = data;
    return Prisma.transact(async client => {
      const reservation = await client.amenityReservation.update({
        where: {
          id,
        },
        data,
        select: {
          ...this.DEFAULT_SELECTION,
          charges: {
            select: {
              id: true,
            },
          },
        },
      });
      const charges = reservation.charges;
      const amount = this.generateTotal(start, end, price, billed);
      if (charges.length) {
        await ReservationChargeController.deleteMany(charges.map(c => c.id));
      }
      if (amount !== 0 && charge) {
        await ReservationChargeController.create({
          amount,
          reservationId: reservation.id,
          personId: reservation.person.id,
        });
      }
      return this.toGQL(reservation)[0];
    });
  };

  public static cancelAmenityReservation = (id: number) => {
    return Prisma.transact(async client => {
      const reservation = await client.amenityReservation.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          personId: true,
          start: true,
          end: true,
          date: true,
          amenity: {
            select: {
              price: true,
              billed: true,
            },
          },
          charges: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!reservation) {
        throw new GraphQLError(
          "This reservation was already deleted by another user. Please refresh your page",
        );
      }
      const now = new Date(new Date().toISOString());
      const { personId, charges, start, end, amenity } = reservation;
      if (isAfter(now, end)) {
        throw new GraphQLError("You cannot cancel past reservations");
      }
      await client.amenityReservation.update({
        where: { id },
        data: { cancelled: true },
      });
      if (!charges.length) {
        return id;
      }
      await ReservationChargeController.deleteMany(charges.map(c => c.id));
      if (isBefore(now, start)) {
        return id;
      }
      const { billed, price } = amenity;
      const amount = this.calculate(
        Math.min(now.getTime(), end.getTime()) - start.getTime(),
        billed,
        price,
      );
      if (amount > 0) {
        await ReservationChargeController.create({
          amount,
          personId,
          reservationId: id,
        });
      }
      return id;
    });
  };

  private static async validateConstraints(
    payload: Omit<ICreateReservation, "propertyId" | "organizationId">,
    action: "create" | "modify",
  ) {
    const { start, end, amenityId } = payload;
    if (!start || !end) {
      throw new GraphQLError(
        "Reservations must have valid starting and ending times",
      );
    }
    if (isBefore(new Date(start), new Date(new Date().toISOString()))) {
      throw new GraphQLError(
        `You may only ${action} reservations for future times`,
      );
    }
    const constraints = await AmenityController.getParameters(amenityId);
    if (!constraints) {
      throw new GraphQLError("This amenity does not exist");
    }
    const error = this.validateDuration(
      start,
      end,
      constraints.open,
      constraints.close,
      constraints.name,
    );
    if (error) {
      throw new GraphQLError(error);
    }
    return constraints;
  }

  private static rollBack(id: number) {
    return Prisma.transact(client => {
      return client.amenityReservation.delete({ where: { id } });
    });
  }

  private static generateTotal(
    start: string,
    end: string,
    price: string,
    billed: BillFrequency,
    date = new Date(),
  ) {
    const startMS = this.toDate(start, new Date(date)).getTime();
    const endMS = this.toDate(end, new Date(date)).getTime();
    return this.calculate(endMS - startMS, billed, price);
  }

  private static calculate(
    duration: number,
    billed: BillFrequency,
    price: string,
  ) {
    const billedBy = this.getBillFrequency(billed);
    const multipler = duration / billedBy;
    const total = parseFloat((parseFloat(price) * multipler).toFixed(2));
    if (isNaN(total)) {
      throw new GraphQLError(
        "Something went wrong when generating a cost for this reservation. Please check your price on the amenity configuration page",
      );
    }
    return total;
  }

  private static validateDuration(
    start: string,
    end: string,
    open: string,
    close: string,
    name: string,
  ) {
    const startTime = new Date(start);
    const endTime = new Date(end);
    if (isAfter(startTime, endTime) || isEqual(startTime, endTime)) {
      return "Your reservation's start time must be before its end time";
    }
    const openTime = this.toDate(open, new Date(start));
    if (isBefore(startTime, openTime)) {
      return `Your reservation's start time cannot be before the ${name} opens`;
    }
    // TODO allow reservations that span multiple days
    const closeTime = this.toDate(close, new Date(end));
    if (isAfter(endTime, closeTime)) {
      return `Your reservation's end time cannot be after after the ${name} opens`;
    }
  }

  private static toDate(time: string, date = new Date()) {
    const [hours, minutes] = time.split(":");
    if (!hours || !minutes) {
      throw new GraphQLError(
        "Your reservation has an invalid start or end time",
      );
    }
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  private static getBillFrequency(frequency: BillFrequency) {
    if (frequency === BillFrequency.hour) {
      return this.ONE_HOUR;
    }
    if (frequency === BillFrequency.day) {
      return this.ONE_DAY;
    }
    throw new GraphQLError(
      "This amenity has an invalid bill frequency. Please update it on the amenity configuration page",
    );
  }
}
