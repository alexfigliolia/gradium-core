import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { IOrganizationID } from "GQL/Organization/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context, IPagination } from "Types/GraphQL";

export interface IPerson extends IOrganizationID {
  id: number;
  name: string;
  userId: number;
}

export interface IFetchPeople extends IPagination, IOrganizationID {}

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

export interface IPaginatedPeople {
  cursor?: number;
  list: IPerson[];
}

export const PaginatedPeople = new GraphQLObjectType<IPaginatedPeople, Context>(
  {
    name: "PaginatedPeople",
    fields: {
      cursor: {
        type: SchemaBuilder.nonNull(GraphQLInt),
        resolve: p => p.cursor,
      },
      list: {
        type: SchemaBuilder.nonNullArray(Person),
        resolve: p => p.list,
      },
    },
  },
);
