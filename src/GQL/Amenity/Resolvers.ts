import { type GraphQLFieldConfig, GraphQLInt, GraphQLString } from "graphql";
import { IdentifyPropertyArgs } from "GQL/AmenityReservation/Types";
import type { IdentifyProperty } from "GQL/Property/Types";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { AmenityController } from "./Controller";
import type { IDeleteAmenity, IUpdateAmenity } from "./Types";
import { Amenity, BillFrequency } from "./Types";

export const getAmenities: GraphQLFieldConfig<any, Context, IdentifyProperty> =
  {
    type: SchemaBuilder.nonNullArray(Amenity),
    args: IdentifyPropertyArgs,
    resolve: (_, { organizationId, propertyId }, context) => {
      const operation = Permission.permissedTransaction({
        organizationId,
        session: context.req.session,
        operation: AmenityController.fetchAll,
        errorMessage:
          "You do not have permissions to access this property's living spaces",
      });
      return operation(propertyId);
    },
  };

export const createOrUpdateAmenity: GraphQLFieldConfig<
  any,
  Context,
  IUpdateAmenity
> = {
  type: SchemaBuilder.nonNull(Amenity),
  args: {
    ...IdentifyPropertyArgs,
    id: {
      type: GraphQLInt,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    billed: {
      type: SchemaBuilder.nonNull(BillFrequency),
    },
    open: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    close: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    price: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    capacity: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, { organizationId, ...rest }, context) => {
    let errorMessage: string;
    if (rest.id) {
      errorMessage = "You do not have permissions to update this amenity";
    } else {
      errorMessage = "You do not have permissions to create amenities";
    }
    const operation = Permission.permissedTransaction({
      errorMessage,
      organizationId,
      session: context.req.session,
      operation: AmenityController.createOrUpdate,
    });
    return operation(rest);
  },
};

export const deleteAmenity: GraphQLFieldConfig<any, Context, IDeleteAmenity> = {
  type: SchemaBuilder.nonNull(Amenity),
  args: {
    ...IdentifyPropertyArgs,
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, { organizationId, id }, context) => {
    const operation = Permission.permissedTransaction({
      organizationId,
      session: context.req.session,
      operation: AmenityController.delete,
      errorMessage: "You do not have permissions to delete this amenity",
    });
    return operation(id);
  },
};
