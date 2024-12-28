import { addDays, differenceInMilliseconds, isAfter, isBefore } from "date-fns";
import { GraphQLError } from "graphql";
import type { Prisma as Client } from "@prisma/client";
import { BillFrequency } from "@prisma/client";
import { Prisma } from "DB/Client";
import { AmenityController } from "GQL/Amenity/Controller";
import { ReservationChargeController } from "GQL/ReservationCharge/Controller";
import { Dates } from "Tools/Dates";
import { Access } from "./Access";
import type {
  ICreateReservation,
  IListReservations,
  IUpdateReservation,
} from "./Types";

export class AmenityReservationController extends Access {
  public static listReservations = async (args: IListReservations) => {
    const start = args.date;
    const end = new Date(addDays(args.date, 1)).toISOString();
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
        start: {
          gte: start,
          lte: end,
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
    if (args?.reservers?.length) {
      whereClauses.push({
        personId: {
          in: args.reservers,
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
      const now = new Date().toISOString();
      const { personId, charges, start, end, amenity } = reservation;
      if (isAfter(now, end.toISOString())) {
        throw new GraphQLError("You cannot cancel past reservations");
      }
      await client.amenityReservation.update({
        where: { id },
        data: { cancelled: true },
      });
      if (!charges.length) {
        return id;
      }
      const startISO = start.toISOString();
      await ReservationChargeController.deleteMany(charges.map(c => c.id));
      if (isBefore(now, startISO)) {
        return id;
      }
      const { billed, price } = amenity;
      const amount = this.calculate(
        differenceInMilliseconds(now, startISO),
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
    if (isBefore(start, new Date().toISOString())) {
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
      constraints.open.toISOString(),
      constraints.close.toISOString(),
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
  ) {
    return this.calculate(differenceInMilliseconds(end, start), billed, price);
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
    if (
      isAfter(start, end) ||
      Dates.dateToTime(start) === Dates.dateToTime(end)
    ) {
      return "Your reservation's start time must be before its end time";
    }
    const startDate = Dates.populateDateFrom(open, new Date(start));
    if (isBefore(startDate, open)) {
      return `Your reservation's start time cannot be before the ${name} opens`;
    }
    const endDate = Dates.populateDateFrom(close, new Date(end));
    if (isAfter(endDate, close)) {
      return `Your reservation's end time cannot be after the ${name} closes`;
    }
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
