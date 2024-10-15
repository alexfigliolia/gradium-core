import { type GraphQLFieldConfig, GraphQLInt } from "graphql";
import { Permission } from "Tools/Permission";
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
    const transaction = Permission.permissedTransaction({
      session: context.req.session,
      organizationId: args.organizationId,
      operation: AddonController.modifyAddons,
      errorMessage:
        "You do not have permission to modify this property's addons",
    });
    return transaction(args);
  },
};
