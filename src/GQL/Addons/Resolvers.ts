import { type GraphQLFieldConfig, GraphQLInt } from "graphql";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { AddonController } from "./Controller";
import type { IModifyAddons } from "./Types";
import { PropertyAddon, PropertyAddonType } from "./Types";

export const modifyPropertyAddons: GraphQLFieldConfig<
  any,
  Context,
  IModifyAddons
> = {
  type: SchemaBuilder.nonNullArray(PropertyAddon),
  args: {
    propertyId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    additions: {
      type: SchemaBuilder.nonNullArray(PropertyAddonType),
    },
    deletions: {
      type: SchemaBuilder.nonNullArray(GraphQLInt),
    },
  },
  resolve: async (_, args, context) => {
    const transaction = AddonController.wrapTransaction(
      context.req.session,
      args.organizationId,
      AddonController.modifyAddons,
    );
    return transaction(args);
  },
};
