import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLObjectType,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import type { ILivingSpace } from "GQL/LivingSpace/Types";
import type { IOrganizationID } from "GQL/Organization/Types";
import { type IPerson, Person } from "GQL/Person/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context, IPagination, IPaginationResult } from "Types/GraphQL";

export const RentPaymentFrequencyType = new GraphQLEnumType({
  name: "RentPaymentFrequency",
  values: {
    day: {
      value: "day",
    },
    month: {
      value: "month",
    },
    year: {
      value: "year",
    },
  },
});

export const LeaseStatusType = new GraphQLEnumType({
  name: "LeaseStatus",
  values: {
    complete: {
      value: "complete",
    },
    inProgress: {
      value: "inProgress",
    },
    terminated: {
      value: "terminated",
    },
    pending: {
      value: "pending",
    },
  },
});

export const LeaseSnapShotType = new GraphQLObjectType<ILeaseSnapShot, Context>(
  {
    name: "LeaseSnapShot",
    fields: {
      start: {
        type: SchemaBuilder.nonNull(GraphQLDateTime),
        resolve: result => result.start,
      },
      end: {
        type: SchemaBuilder.nonNull(GraphQLDateTime),
        resolve: result => result.end,
      },
      status: {
        type: SchemaBuilder.nonNull(LeaseStatusType),
      },
    },
  },
);

export const LeaseType = new GraphQLObjectType<ILease, Context>({
  name: "Lease",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: lease => lease.id,
    },
    price: {
      type: SchemaBuilder.nonNull(GraphQLFloat),
      resolve: lease => lease.price,
    },
    lessees: {
      type: SchemaBuilder.nonNullArray(Person),
      resolve: lease => lease.lessees,
    },
    paymentFrequency: {
      type: SchemaBuilder.nonNull(RentPaymentFrequencyType),
      resolve: lease => lease.paymentFrequency,
    },
    ...LeaseSnapShotType.toConfig().fields,
  },
});

export const PaginatedLeasesType = new GraphQLObjectType<
  IPaginationResult<ILease>
>({
  name: "PaginatedLeases",
  fields: {
    list: {
      type: SchemaBuilder.nonNullArray(LeaseType),
      resolve: result => result.list,
    },
    cursor: {
      type: GraphQLInt,
    },
  },
});

export interface ILeaseSnapShot {
  start: string;
  end: string;
  status: ILeaseStatus;
}

export enum ILeaseStatus {
  complete = "complete",
  inProgress = "inProgress",
  terminated = "terminated",
  pending = "pending",
}

export enum IRentPaymentFrequency {
  day = "day",
  week = "week",
  month = "month",
  year = "year",
}

export interface ILease {
  id: number;
  start: string;
  end: string;
  price: number;
  lessees: IPerson;
  status: ILeaseStatus;
  paymentFrequency: IRentPaymentFrequency;
  livingSpace: ILivingSpace;
}

export interface IFetchLeases extends IPagination, IOrganizationID {}
