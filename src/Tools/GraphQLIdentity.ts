import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { Context, Identity, IPaginationResult } from "Types/GraphQL";
import { SchemaBuilder } from "./SchemaBuilder";

export const GraphQLIdentityType = new GraphQLObjectType<Identity, Context>({
  name: "Identity",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: i => i.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: i => i.name,
    },
  },
});

export type IPaginatedPeople = IPaginationResult<Identity>;

export const PaginatedIdentitiesType = SchemaBuilder.paginatedType<Identity>(
  "PaginatedIdentities",
  GraphQLIdentityType,
);
