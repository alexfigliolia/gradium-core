import {
  type GraphQLFieldConfig,
  GraphQLFloat,
  GraphQLInt,
  GraphQLString,
} from "graphql";
import type { IdentifyProperty } from "GQL/Property/Types";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { LivingSpaceController } from "./Controller";
import type { IDeleteLivingSpace, IUpdateProperty } from "./Types";
import { LivingSpace, LivingSpaceType } from "./Types";

export const getLivingSpaces: GraphQLFieldConfig<
  any,
  Context,
  IdentifyProperty
> = {
  type: SchemaBuilder.nonNullArray(LivingSpace),
  args: {
    propertyId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
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
  IUpdateProperty
> = {
  type: SchemaBuilder.nonNull(LivingSpace),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    propertyId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
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
    footage: {
      type: SchemaBuilder.nonNull(GraphQLFloat),
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
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    propertyId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
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
