import { type GraphQLFieldConfig, GraphQLInt } from "graphql";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { AddonController } from "./Controller";
import type {
  IDeleteAddonArgs,
  IPropertyAddonArgs,
  IPropertyAddonsArgs,
} from "./Types";
import { PropertyAddon, PropertyAddonType } from "./Types";

export const createPropertyAddon: GraphQLFieldConfig<
  any,
  Context,
  IPropertyAddonArgs
> = {
  type: SchemaBuilder.nonNullArray(PropertyAddon),
  args: {
    propertyId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    type: {
      type: SchemaBuilder.nonNull(PropertyAddonType),
    },
  },
  resolve: async (_, { organizationId, propertyId, type }, context) => {
    const transaction = AddonController.wrapTransaction(
      context.req.session,
      organizationId,
      AddonController.createAddon,
    );
    return transaction(propertyId, type);
  },
};

export const createPropertyAddons: GraphQLFieldConfig<
  any,
  Context,
  IPropertyAddonsArgs
> = {
  type: SchemaBuilder.nonNullArray(PropertyAddon),
  args: {
    propertyId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    addons: {
      type: SchemaBuilder.nonNullArray(PropertyAddonType),
    },
  },
  resolve: async (_, { organizationId, propertyId, addons }, context) => {
    const transaction = AddonController.wrapTransaction(
      context.req.session,
      organizationId,
      AddonController.createAddons,
    );
    return transaction(propertyId, addons);
  },
};

export const deletePropertyAddon: GraphQLFieldConfig<
  any,
  Context,
  IDeleteAddonArgs
> = {
  type: SchemaBuilder.nonNullArray(PropertyAddon),
  args: {
    propertyId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: async (_, { organizationId, propertyId, id }, context) => {
    const transaction = AddonController.wrapTransaction(
      context.req.session,
      organizationId,
      AddonController.deleteAddon,
    );
    return transaction(id, propertyId);
  },
};
