import {
  type GraphQLFieldConfig,
  GraphQLFloat,
  GraphQLInt,
  GraphQLString,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { IdentifyPropertyArgs } from "GQL/AmenityReservation/Types";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import { type Context, PaginationArgs } from "Types/GraphQL";
import { LeaseController } from "./Controller";
import type { ICreateLease, IFetchLeases } from "./Types";
import {
  LeaseType,
  LesseeType,
  PaginatedLeasesType,
  RentPaymentFrequencyType,
} from "./Types";

export const fetchLeases: GraphQLFieldConfig<any, Context, IFetchLeases> = {
  type: SchemaBuilder.nonNull(PaginatedLeasesType),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    search: {
      type: GraphQLString,
    },
    ...PaginationArgs,
  },
  resolve: (_, args, context) => {
    const operation = Permission.permissedTransaction({
      organizationId: args.organizationId,
      session: context.req.session,
      errorMessage:
        "You do not have permission to view leases for this organization",
      operation: LeaseController.fetch,
    });
    return operation(args);
  },
};

export const createLease: GraphQLFieldConfig<any, Context, ICreateLease> = {
  type: SchemaBuilder.nonNull(LeaseType),
  args: {
    start: {
      type: SchemaBuilder.nonNull(GraphQLDateTime),
    },
    end: {
      type: SchemaBuilder.nonNull(GraphQLDateTime),
    },
    price: {
      type: SchemaBuilder.nonNull(GraphQLFloat),
    },
    lessees: {
      type: SchemaBuilder.nonNullArray(LesseeType),
    },
    livingSpaceId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    paymentFrequency: {
      type: SchemaBuilder.nonNull(RentPaymentFrequencyType),
    },
    ...IdentifyPropertyArgs,
  },
  resolve: (_, args, context) => {
    const operation = Permission.permissedTransaction({
      organizationId: args.organizationId,
      session: context.req.session,
      errorMessage:
        "You do not have permission to create leases for this organization",
      operation: LeaseController.create,
    });
    return operation(args);
  },
};
