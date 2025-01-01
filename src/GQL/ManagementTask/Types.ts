import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import type {
  ManagementTaskStatus as IManagementTaskStatus,
  TaskPriority as IManagementTaskPriorirty,
} from "@prisma/client";
import { Expense, type IExpense } from "GQL/Expense/Types";
import { GradiumImage, type IGradiumImage } from "GQL/Media/Types";
import type { IOrganizationID } from "GQL/Organization/Types";
import { type IPerson, Person } from "GQL/Person/Types";
import { type IStaffProfile, StaffMember } from "GQL/Staff/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context, DBID } from "Types/GraphQL";

export interface ISetStatus extends IOrganizationID, DBID {
  status: IManagementTaskStatus;
}

export interface IlistManagementTasks extends IOrganizationID {
  propertyId?: number;
  assignedToId?: number[];
  searchString?: string;
  priority?: IManagementTaskPriorirty[];
}

export interface ICreateManagementTask extends IOrganizationID {
  title: string;
  description: string;
  status: IManagementTaskStatus;
  priority: IManagementTaskPriorirty;
  assignedToId?: number;
  propertyId?: number;
}

export interface IUpdateManagementTask extends ICreateManagementTask {
  id: number;
}

export const ManagementTaskStatus = new GraphQLEnumType({
  name: "ManagementTaskStatus",
  values: {
    todo: {
      value: "todo",
    },
    inProgress: {
      value: "inProgress",
    },
    underReview: {
      value: "underReview",
    },
    complete: {
      value: "complete",
    },
  },
});

export const ManagementTaskPriority = new GraphQLEnumType({
  name: "ManagementTaskPriority",
  values: {
    high: {
      value: "high",
    },
    low: {
      value: "low",
    },
    immediate: {
      value: "immediate",
    },
  },
});

export interface IManagementTask {
  id: number;
  createdAt: string;
  title: string;
  description: string;
  status: IManagementTaskStatus;
  images: IGradiumImage[];
  createdBy: IPerson;
  priority: IManagementTaskPriorirty;
  assignedTo?: IStaffProfile;
  expenses: IExpense[];
}

export const ManagementTask = new GraphQLObjectType<IManagementTask, Context>({
  name: "ManagementTask",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: m => m.id,
    },
    createdAt: {
      type: SchemaBuilder.nonNull(GraphQLDateTime),
      resolve: m => m.createdAt,
    },
    title: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: m => m.title,
    },
    description: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: m => m.description,
    },
    status: {
      type: SchemaBuilder.nonNull(ManagementTaskStatus),
      resolve: m => m.status,
    },
    priority: {
      type: SchemaBuilder.nonNull(ManagementTaskPriority),
      resolve: m => m.priority,
    },
    createdBy: {
      type: SchemaBuilder.nonNull(Person),
      resolve: m => m.createdBy,
    },
    images: {
      type: SchemaBuilder.nonNullArray(GradiumImage),
      resolve: m => m.images,
    },
    assignedTo: {
      type: StaffMember,
      resolve: m => m.assignedTo,
    },
    expenses: {
      type: SchemaBuilder.nonNullArray(Expense),
      resolve: m => m.expenses,
    },
  },
});

export const TaskArguments = {
  organizationId: {
    type: SchemaBuilder.nonNull(GraphQLInt),
  },
  propertyId: {
    type: GraphQLInt,
  },
  title: {
    type: SchemaBuilder.nonNull(GraphQLString),
  },
  description: {
    type: SchemaBuilder.nonNull(GraphQLString),
  },
  status: {
    type: SchemaBuilder.nonNull(ManagementTaskStatus),
  },
  priority: {
    type: SchemaBuilder.nonNull(ManagementTaskPriority),
  },
  assignedToId: {
    type: GraphQLInt,
  },
};
