import type { ManagementTaskStatus, Prisma as IPrisma } from "@prisma/client";
import { Prisma } from "DB/Client";
import { Permission } from "Tools/Permission";
import type { IPermissedTransaction } from "Types/GraphQL";
import { Access } from "./Access";
import type { IlistManagementTasks } from "./Types";

export class ManagementTaskController extends Access {
  public static listManagementTasks = ({
    propertyId,
    organizationId,
  }: IlistManagementTasks) => {
    let where: IPrisma.ManagementTaskWhereInput;
    if (typeof propertyId === "number") {
      where = {
        AND: [{ propertyId }, { organizationId }],
      };
    } else {
      where = { organizationId };
    }
    return Prisma.transact(async client => {
      const tasks = await client.managementTask.findMany({
        where,
        select: this.DEFAULT_SELECTION,
      });
      return tasks.map(task => ({
        ...task,
        createdBy: {
          id: task.createdBy.id,
          name: task.createdBy.user.name,
        },
        assignedTo: task.assignedTo
          ? {
              id: task.assignedTo?.id,
              name: task.assignedTo.person.user.name,
            }
          : undefined,
      }));
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
    return Prisma.transact(client => {
      return client.managementTask.update({
        where: { id },
        data: {
          status,
        },
      });
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
