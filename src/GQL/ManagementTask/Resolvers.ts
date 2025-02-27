import {
  GraphQLBoolean,
  type GraphQLFieldConfig,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from "graphql";
import { PersonRole } from "@prisma/client";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { ManagementTaskController } from "./Controller";
import type {
  ICreateManagementTask,
  IDeleteTask,
  IlistManagementTasks,
  ISetStatus,
  IUpdateManagementTask,
} from "./Types";
import {
  ManagementTask,
  ManagementTaskPriority,
  ManagementTaskStatus,
  ScopeArgs,
  TaskArguments,
} from "./Types";

export const listManagementTasks: GraphQLFieldConfig<
  any,
  Context,
  IlistManagementTasks
> = {
  type: SchemaBuilder.nonNullArray(ManagementTask),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    propertyId: {
      type: GraphQLInt,
    },
    priority: {
      type: new GraphQLList(ManagementTaskPriority),
    },
    assignedToId: {
      type: new GraphQLList(GraphQLInt),
    },
    searchString: {
      type: GraphQLString,
    },
    archive: {
      type: GraphQLBoolean,
    },
  },
  resolve: async (_, args, context) => {
    const { organizationId, propertyId } = args;
    const operation = ManagementTaskController.permissedTransaction({
      propertyId,
      organizationId,
      session: context.req.session,
      permissions: [PersonRole.maintenance],
      operation: ManagementTaskController.listManagementTasks,
      errorMessage: `You do not have permission to view management tasks for this ${typeof propertyId === "number" ? "property" : "organization"}`,
    });
    return operation(args);
  },
};

export const setManagementTaskStatus: GraphQLFieldConfig<
  any,
  Context,
  ISetStatus
> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  args: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    status: {
      type: SchemaBuilder.nonNull(ManagementTaskStatus),
    },
  },
  resolve: async (_, { id, organizationId, status }, context) => {
    const property = await ManagementTaskController.getPropertyRelation(id);
    const operation = ManagementTaskController.permissedTransaction({
      organizationId,
      session: context.req.session,
      permissions: [PersonRole.maintenance],
      propertyId: property?.propertyId ?? undefined,
      operation: ManagementTaskController.setTaskStatus,
      errorMessage: "You do not have permission to modify this task",
    });
    return operation(id, status);
  },
};

export const createManagementTask: GraphQLFieldConfig<
  any,
  Context,
  ICreateManagementTask
> = {
  type: SchemaBuilder.nonNull(ManagementTask),
  args: TaskArguments,
  resolve: (_, args, context) => {
    const { organizationId, propertyId } = args;
    const operation = ManagementTaskController.permissedTransaction({
      propertyId,
      organizationId,
      session: context.req.session,
      permissions: [PersonRole.maintenance],
      operation: ManagementTaskController.createTask,
      errorMessage: `You do not have permission to create management tasks for this ${typeof propertyId === "number" ? "property" : "organization"}`,
    });
    return operation(args, context.req.session.userID!);
  },
};

export const updateManagementTask: GraphQLFieldConfig<
  any,
  Context,
  IUpdateManagementTask
> = {
  type: SchemaBuilder.nonNull(ManagementTask),
  args: {
    ...TaskArguments,
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args, context) => {
    const { organizationId, propertyId } = args;
    const operation = ManagementTaskController.permissedTransaction({
      propertyId,
      organizationId,
      session: context.req.session,
      permissions: [PersonRole.maintenance],
      operation: ManagementTaskController.updateTask,
      errorMessage: `You do not have permission to edit management tasks for this ${typeof propertyId === "number" ? "property" : "organization"}`,
    });
    return operation(args);
  },
};

export const deleteManagementTask: GraphQLFieldConfig<
  any,
  Context,
  IDeleteTask
> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  args: {
    ...ScopeArgs,
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args, context) => {
    const { organizationId, propertyId, id } = args;
    const operation = ManagementTaskController.permissedTransaction({
      propertyId,
      organizationId,
      session: context.req.session,
      permissions: [PersonRole.maintenance],
      operation: ManagementTaskController.deleteTask,
      errorMessage: `You do not have permission to delete management tasks for this ${typeof propertyId === "number" ? "property" : "organization"}`,
    });
    return operation(id);
  },
};
