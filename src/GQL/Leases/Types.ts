import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import type { LeaseStatus, RentPaymentFrequency } from "@prisma/client";
import type { ILivingSpace } from "GQL/LivingSpace/Types";
import type { IGradiumDocument } from "GQL/Media/Types";
import { GradiumDocument } from "GQL/Media/Types";
import type { IOrganizationID } from "GQL/Organization/Types";
import { GradiumPersonType } from "Tools/GraphQLIdentity";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context, IPagination, PersonIdentifier } from "Types/GraphQL";

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
      type: SchemaBuilder.nonNullArray(GradiumPersonType),
      resolve: lease => lease.lessees,
    },
    invites: {
      type: SchemaBuilder.nonNullArray(GradiumPersonType),
      resolve: lease => lease.invites,
    },
    paymentFrequency: {
      type: SchemaBuilder.nonNull(RentPaymentFrequencyType),
      resolve: lease => lease.paymentFrequency,
    },
    terminatedDate: {
      type: GraphQLDateTime,
      resolve: lease => lease.terminatedDate,
    },
    documents: {
      type: SchemaBuilder.nonNullArray(GradiumDocument),
      resolve: lease => lease.documents,
    },
    ...LeaseSnapShotType.toConfig().fields,
  },
});

export const PaginatedLeasesType = SchemaBuilder.paginatedType<ILease>(
  "PaginatedLeases",
  LeaseType,
);

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
  propertyId: number;
  lessees: PersonIdentifier[];
  invites: PersonIdentifier[];
  status: ILeaseStatus;
  terminatedDate?: string;
  paymentFrequency: IRentPaymentFrequency;
  livingSpace: ILivingSpace;
  documents: IGradiumDocument[];
}

export interface IFetchLeases extends IPagination, IOrganizationID {}

export interface ILessee {
  name: string;
  email: string;
}

export interface ICreateLease extends IOrganizationID {
  start: string;
  end: string;
  price: number;
  propertyId: number;
  paymentFrequency: IRentPaymentFrequency;
  lessees: ILessee[];
  livingSpaceId: number;
}

export const LesseeType = new GraphQLInputObjectType({
  name: "Lessee",
  fields: {
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    email: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
});

export interface IRawLease {
  id: number;
  start: Date;
  end: Date;
  status: LeaseStatus;
  price: number;
  livingSpace: {
    name: string;
  };
  property: {
    id: number;
    name: string;
  };
  invites: {
    name: string;
    email: string;
  }[];
  lessees: {
    id: number;
    linkedEmail: {
      email: string;
    };
    user: {
      name: string;
    };
  }[];
  terminatedDate: Date | null;
  paymentFrequency: RentPaymentFrequency;
  documents: {
    id: number;
    url: string;
    thumbnail: string;
  }[];
}
