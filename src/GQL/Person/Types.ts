import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { IOrganizationID } from "GQL/Organization/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type {
  Context,
  DBID,
  IPagination,
  IPaginationResult,
} from "Types/GraphQL";

export interface IPerson extends DBID {
  name: string;
}

export interface IFetchPeople extends IPagination, IOrganizationID {}

export const Person = new GraphQLObjectType<IPerson, Context>({
  name: "Person",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
});

export type IPaginatedPeople = IPaginationResult<IPerson>;

export const PaginatedPeople = SchemaBuilder.paginatedType<IPerson>(
  "PaginatedPeople",
  Person,
);
