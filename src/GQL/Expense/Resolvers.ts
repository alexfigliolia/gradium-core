import type { GraphQLFieldConfig } from "graphql";
import { GraphQLInt, GraphQLString } from "graphql";
import { PersonRole } from "@prisma/client";
import { ManagementTaskController } from "GQL/ManagementTask/Controller";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { ExpenseController } from "./Controller";
import type { ICreateExpense } from "./Types";
import { Expense } from "./Types";

export const createExpense: GraphQLFieldConfig<any, Context, ICreateExpense> = {
  type: SchemaBuilder.nonNull(Expense),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    propertyId: {
      type: GraphQLInt,
    },
    taskId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    cost: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    title: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    description: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: (_, args, context) => {
    const operation = ManagementTaskController.permissedTransaction({
      propertyId: args.propertyId,
      organizationId: args.organizationId,
      session: context.req.session,
      permissions: [PersonRole.maintenance],
      operation: ExpenseController.create,
      errorMessage: `You do not have permission to create expenses for this ${typeof args.propertyId === "number" ? "property" : "organization"}`,
    });
    const { userID } = context.req.session;
    return operation(args, userID!);
  },
};
