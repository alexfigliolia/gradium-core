import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context, IPagination } from "Types/GraphQL";

export interface IPerson {
  id: number;
  name: string;
  userId: number;
  organizationId: number;
}

export interface IFetchPeople extends IPagination {
  organizationId: number;
}

export const Person = new GraphQLObjectType<IPerson, Context>({
  name: "Person",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    userId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
});
