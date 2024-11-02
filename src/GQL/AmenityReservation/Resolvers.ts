import type { GraphQLFieldConfig } from "graphql";
import { GraphQLInt, GraphQLList, GraphQLString } from "graphql";
import { PersonRole } from "@prisma/client";
import { Locale } from "Tools/Locale";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { AmenityReservationController } from "./Controller";
import type {
  ICreateReservation,
  IDeleteReservation,
  IListReservations,
  IUpdateReservation,
} from "./Types";
import {
  AmenityReservation,
  CreateReservationArgs,
  IdentifyPropertyArgs,
  UpdateReservationArgs,
} from "./Types";

export const fetchAmenityReservations: GraphQLFieldConfig<
  any,
  Context,
  IListReservations
> = {
  type: SchemaBuilder.nonNullArray(AmenityReservation),
  args: {
    ...IdentifyPropertyArgs,
    date: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    amenityIds: {
      type: new GraphQLList(SchemaBuilder.nonNull(GraphQLInt)),
    },
  },
  resolve: (_, args, context) => {
    // TODO - move property related operations over to this middleware
    const transaction = Permission.permissedPropertyTransaction({
      propertyId: args.propertyId,
      session: context.req.session,
      organizationId: args.organizationId,
      permissions: [PersonRole.maintenance],
      operation: AmenityReservationController.listReservations,
      errorMessage:
        "You do not have permission to view amenity reservations for this property",
    });
    return transaction(args);
  },
};

export const createAmenityReservation: GraphQLFieldConfig<
  any,
  Context,
  ICreateReservation
> = {
  type: SchemaBuilder.nonNull(AmenityReservation),
  args: CreateReservationArgs,
  resolve: (_, { propertyId, organizationId, ...rest }, context) => {
    const transaction = Permission.permissedPropertyTransaction({
      propertyId,
      organizationId,
      session: context.req.session,
      permissions: [PersonRole.maintenance],
      operation: AmenityReservationController.createAmenityReservation,
      errorMessage:
        "You do not have permission to create reservations for this property",
    });
    return transaction(rest, Locale.parseUserLanguage(context.req));
  },
};

export const updateAmenityReservation: GraphQLFieldConfig<
  any,
  Context,
  IUpdateReservation
> = {
  type: SchemaBuilder.nonNull(AmenityReservation),
  args: UpdateReservationArgs,
  resolve: (_, { propertyId, organizationId, ...rest }, context) => {
    const transaction = Permission.permissedPropertyTransaction({
      propertyId,
      organizationId,
      session: context.req.session,
      permissions: [PersonRole.maintenance],
      operation: AmenityReservationController.updateAmenityReservation,
      errorMessage:
        "You do not have permission to update reservations for this property",
    });
    return transaction(rest, Locale.parseUserLanguage(context.req));
  },
};

export const cancelAmenityReservation: GraphQLFieldConfig<
  any,
  Context,
  IDeleteReservation
> = {
  type: SchemaBuilder.nonNull(GraphQLInt),
  args: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    ...IdentifyPropertyArgs,
  },
  resolve: (_, { propertyId, organizationId, id }, context) => {
    const transaction = Permission.permissedPropertyTransaction({
      propertyId,
      organizationId,
      session: context.req.session,
      permissions: [PersonRole.maintenance],
      operation: AmenityReservationController.cancelAmenityReservation,
      errorMessage:
        "You do not have permission to delete reservations for this property",
    });
    return transaction(id);
  },
};
