import type { GraphQLFieldConfig } from "graphql";
import { GraphQLBoolean, GraphQLInt } from "graphql";
import { PersonRole } from "@prisma/client";
import { ManagementTaskController } from "GQL/ManagementTask/Controller";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { ExpenseController } from "./Controller";
import type { ICreateExpense, IDeleteExpense, IUpdateExpense } from "./Types";
import { Expense, TaskArgs } from "./Types";

export const createExpense: GraphQLFieldConfig<any, Context, ICreateExpense> = {
  type: SchemaBuilder.nonNull(Expense),
  args: {
    taskId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    ...TaskArgs,
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

export const updateExpense: GraphQLFieldConfig<any, Context, IUpdateExpense> = {
  type: SchemaBuilder.nonNull(Expense),
  args: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    ...TaskArgs,
  },
  resolve: (_, args, context) => {
    const operation = ManagementTaskController.permissedTransaction({
      propertyId: args.propertyId,
      organizationId: args.organizationId,
      session: context.req.session,
      permissions: [PersonRole.maintenance],
      operation: ExpenseController.update,
      errorMessage: `You do not have permission to update expenses for this ${typeof args.propertyId === "number" ? "property" : "organization"}`,
    });
    return operation(args);
  },
};

export const deleteExpense: GraphQLFieldConfig<any, Context, IDeleteExpense> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  args: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    propertyId: {
      type: GraphQLInt,
    },
  },
  resolve: (_, args, context) => {
    const operation = ManagementTaskController.permissedTransaction({
      propertyId: args.propertyId,
      organizationId: args.organizationId,
      session: context.req.session,
      permissions: [PersonRole.maintenance],
      operation: ExpenseController.delete,
      errorMessage: `You do not have permission to delete expenses for this ${typeof args.propertyId === "number" ? "property" : "organization"}`,
    });
    return operation(args);
  },
};
