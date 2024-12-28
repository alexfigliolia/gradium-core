import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { GradiumImage, type IGradiumImage } from "GQL/Media/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";

export interface IExpense {
  id: number;
  createdAt: string;
  cost: string;
  title: string;
  description: string;
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
