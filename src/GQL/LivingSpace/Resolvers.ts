import {
  type GraphQLFieldConfig,
  GraphQLFloat,
  GraphQLInt,
  GraphQLString,
} from "graphql";
import { IdentifyPropertyArgs } from "GQL/AmenityReservation/Types";
import type { IdentifyProperty } from "GQL/Property/Types";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { LivingSpaceController } from "./Controller";
import type { IDeleteLivingSpace, IUpdateLivingSpace } from "./Types";
import { LivingSpace, LivingSpaceType } from "./Types";

export const getLivingSpaces: GraphQLFieldConfig<
  any,
  Context,
  IdentifyProperty
> = {
  type: SchemaBuilder.nonNullArray(LivingSpace),
  args: IdentifyPropertyArgs,
  resolve: (_, { organizationId, propertyId }, context) => {
    const operation = Permission.permissedTransaction({
      organizationId,
      session: context.req.session,
      operation: LivingSpaceController.fetchAll,
      errorMessage:
        "You do not have permissions to access this property's living spaces",
    });
    return operation(propertyId);
  },
};

export const createOrUpdateLivingSpace: GraphQLFieldConfig<
  any,
  Context,
  IUpdateLivingSpace
> = {
  type: SchemaBuilder.nonNull(LivingSpace),
  args: {
    ...IdentifyPropertyArgs,
    id: {
      type: GraphQLInt,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    type: {
      type: SchemaBuilder.nonNull(LivingSpaceType),
    },
    beds: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    baths: {
      type: SchemaBuilder.nonNull(GraphQLFloat),
    },
    size: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: (_, { organizationId, ...rest }, context) => {
    let errorMessage: string;
    if (rest.id) {
      errorMessage = "You do not have permissions to update this living space";
    } else {
      errorMessage = "You do not have permissions to create living spaces";
    }
    const operation = Permission.permissedTransaction({
      errorMessage,
      organizationId,
      session: context.req.session,
      operation: LivingSpaceController.createOrUpdate,
    });
    return operation(rest);
  },
};

export const deleteLivingSpace: GraphQLFieldConfig<
  any,
  Context,
  IDeleteLivingSpace
> = {
  type: SchemaBuilder.nonNull(LivingSpace),
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
      operation: LivingSpaceController.delete,
      errorMessage: "You do not have permissions to delete this living space",
    });
    return operation(id);
  },
};
