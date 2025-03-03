import { type GraphQLFieldConfig, GraphQLInt } from "graphql";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import { type Context, PaginationArgs } from "Types/GraphQL";
import { LeaseController } from "./Controller";
import type { IFetchLeases } from "./Types";
import { PaginatedLeasesType } from "./Types";

export const getLeases: GraphQLFieldConfig<any, Context, IFetchLeases> = {
  type: SchemaBuilder.nonNullArray(PaginatedLeasesType),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
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
