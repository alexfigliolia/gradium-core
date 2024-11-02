import type { GraphQLFieldConfig } from "graphql";
import { GraphQLInt } from "graphql";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { PersonController } from "./Controller";
import type { IFetchPeople } from "./Types";
import { PaginatedPeople } from "./Types";

export const listPeople: GraphQLFieldConfig<any, Context, IFetchPeople> = {
  type: SchemaBuilder.nonNull(PaginatedPeople),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    limit: {
      type: GraphQLInt,
    },
    cursor: {
      type: GraphQLInt,
    },
  },
  resolve: (_, args, context) => {
    const operation = Permission.permissedTransaction({
      operation: PersonController.fetch,
      organizationId: args.organizationId,
      session: context.req.session,
      errorMessage:
        "You do not have permission to access a list of organization members",
    });
    return operation(args);
  },
};
