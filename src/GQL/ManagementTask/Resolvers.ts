import { GraphQLBoolean, type GraphQLFieldConfig, GraphQLInt } from "graphql";
import { PersonRole } from "@prisma/client";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { ManagementTaskController } from "./Controller";
import type { IlistManagementTasks, ISetStatus } from "./Types";
import { ManagementTask, ManagementTaskStatus } from "./Types";

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
