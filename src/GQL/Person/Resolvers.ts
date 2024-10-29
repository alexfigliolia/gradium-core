import type { GraphQLFieldConfig } from "graphql";
import { GraphQLInt } from "graphql";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { PersonController } from "./Controller";
import { Person } from "./Types";

export const listPeople: GraphQLFieldConfig<any, Context, any> = {
  type: SchemaBuilder.nonNullArray(Person),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
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
