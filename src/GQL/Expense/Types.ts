import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { GradiumImage, type IGradiumImage } from "GQL/Media/Types";
import type { IOrganizationID } from "GQL/Organization/Types";
import type { IPerson } from "GQL/Person/Types";
import { Person } from "GQL/Person/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";

export interface IExpenseContent {
  cost: string;
  title: string;
  description: string;
}

export interface ICreateExpense extends IOrganizationID, IExpenseContent {
  taskId: number;
  propertyId?: number;
}

export interface IUpdateExpense extends ICreateExpense {
  id: number;
}

export interface IExpense extends IExpenseContent {
  id: number;
  createdAt: string;
  createdBy: IPerson;
  attachments: IGradiumImage[];
}

export const Expense = new GraphQLObjectType<IExpense, Context>({
  name: "Expense",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: e => e.id,
    },
    createdAt: {
      type: SchemaBuilder.nonNull(GraphQLDateTime),
      resolve: e => e.createdAt,
    },
    createdBy: {
      type: SchemaBuilder.nonNull(Person),
      resolve: e => e.createdBy,
    },
    cost: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: e => e.cost,
    },
    title: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: e => e.title,
    },
    description: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: e => e.description,
    },
    attachments: {
      type: SchemaBuilder.nonNullArray(GradiumImage),
      resolve: e => e.attachments,
    },
  },
});

export const TaskArgs = {
  organizationId: {
    type: SchemaBuilder.nonNull(GraphQLInt),
  },
  propertyId: {
    type: GraphQLInt,
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
};
