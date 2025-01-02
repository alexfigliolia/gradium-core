import { GraphQLError } from "graphql";
import type { ManagementTaskStatus } from "@prisma/client";
import { Prisma } from "DB/Client";
import { PersonController } from "GQL/Person/Controller";
import { Permission } from "Tools/Permission";
import type { IPermissedTransaction } from "Types/GraphQL";
import { Access } from "./Access";
import type {
  ICreateManagementTask,
  IlistManagementTasks,
  IUpdateManagementTask,
} from "./Types";

export class ManagementTaskController extends Access {
  public static listManagementTasks = ({
    searchString,
    assignedToId,
    priority,
    propertyId,
    organizationId,
  }: IlistManagementTasks) => {
    return Prisma.transact(async client => {
      const tasks = await client.managementTask.findMany({
        where: {
          AND: this.buildFilterCombinator({
            priority,
            propertyId,
            searchString,
            assignedToId,
            organizationId,
          }),
        },
        select: this.DEFAULT_SELECTION,
      });
      return tasks.map(task => ({
        ...task,
        createdBy: PersonController.toPersonType(task.createdBy),
        assignedTo: task.assignedTo
          ? PersonController.toPersonType(task.assignedTo)
          : undefined,
      }));
    });
  };

  public static createTask = async (
    data: ICreateManagementTask,
    userID: number,
  ) => {
    const person = await PersonController.fetchPerson(
      userID,
      data.organizationId,
      {
        id: true,
      },
    );
    if (!person) {
      throw new GraphQLError(
        "You do not have permission to create tasks for this organization",
      );
    }
    return Prisma.transact(async client => {
      const task = await client.managementTask.create({
        data: {
          ...data,
          personId: person.id,
        },
      });
      return this.getByID(task.id);
    });
  };

  public static updateTask = ({ id, ...data }: IUpdateManagementTask) => {
    return Prisma.transact(async client => {
      await client.managementTask.update({
        where: { id },
        data: {
          ...data,
          assignedToId: data.assignedToId || null,
        },
      });
      return this.getByID(id);
    });
  };

  public static getPropertyRelation(id: number) {
    return Prisma.transact(client => {
      return client.managementTask.findUnique({
        where: { id },
        select: {
          propertyId: true,
        },
      });
    });
  }

  public static setTaskStatus = (id: number, status: ManagementTaskStatus) => {
    return Prisma.transact(async client => {
      await client.managementTask.update({
        where: { id },
        data: {
          status,
        },
        select: { id: true },
      });
      return true;
    });
  };

  public static async getByID(id: number) {
    return Prisma.transact(async client => {
      const newTask = await client.managementTask.findUnique({
        where: { id },
        select: Access.DEFAULT_SELECTION,
      });
      if (!newTask) {
        throw new GraphQLError(
          "Something went wrong while createing your task. Please try again",
        );
      }
      const { assignedTo, createdBy, ...taskData } = newTask;
      return {
        ...taskData,
        assignedTo: assignedTo
          ? PersonController.toPersonType(assignedTo)
          : undefined,
        createdBy: PersonController.toPersonType(createdBy),
      };
    });
  }

  public static deleteTask = (id: number) => {
    return Prisma.transact(async client => {
      await client.managementTask.update({
        where: { id },
        data: { deleted: true },
      });
      return true;
    });
  };

  public static permissedTransaction<F extends (...args: any[]) => any>({
    session,
    operation,
    errorMessage,
    permissions,
    propertyId,
    organizationId,
  }: IPermissedTaskTransaction<F>) {
    if (typeof propertyId === "number") {
      return Permission.permissedPropertyTransaction({
        session,
        operation,
        propertyId,
        permissions,
        errorMessage,
        organizationId,
      });
    }
    return Permission.permissedTransaction({
      session,
      operation,
      permissions,
      errorMessage,
      organizationId,
    });
  }
}

export interface IPermissedTaskTransaction<F extends (...args: any[]) => any>
  extends IPermissedTransaction<F> {
  propertyId?: number;
}
