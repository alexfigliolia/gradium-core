import type { GraphQLFieldConfig } from "graphql";
import { GraphQLBoolean, GraphQLInt, GraphQLString } from "graphql";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { OrganizationController } from "./Controller";
import type { IOrganizationName } from "./Types";

export const setOrganizationName: GraphQLFieldConfig<
  any,
  Context,
  IOrganizationName
> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  args: {
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args, context) => {
    return OrganizationController.setName(args, context.req);
  },
};
