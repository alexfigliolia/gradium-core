import { type GraphQLFieldConfig, GraphQLInt, GraphQLString } from "graphql";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { PropertyImageController } from "./Controller";
import type { ICreatePropertyImage, IDeletePropertyImage } from "./Types";
import { PropertyImage } from "./Types";

export const createPropertyImage: GraphQLFieldConfig<
  any,
  Context,
  ICreatePropertyImage
> = {
  type: SchemaBuilder.nonNull(PropertyImage),
  args: {
    propertyId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    url: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: (_, { organizationId, ...rest }, context) => {
    const operation = Permission.permissedTransaction({
      organizationId,
      session: context.req.session,
      operation: PropertyImageController.create,
      errorMessage:
        "You do not have permission to modify this property's images",
    });
    return operation(rest);
  },
};

export const deletePropertyImage: GraphQLFieldConfig<
  any,
  Context,
  IDeletePropertyImage
> = {
  type: SchemaBuilder.nonNullArray(PropertyImage),
  args: {
    organizationId: {
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
      operation: PropertyImageController.delete,
      errorMessage:
        "You do not have permission to modify this property's images",
    });
    return operation(id);
  },
};
