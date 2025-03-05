import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { Context, Identity, PersonIdentifier } from "Types/GraphQL";
import { SchemaBuilder } from "./SchemaBuilder";

export const GradiumIdentityType = new GraphQLObjectType<Identity, Context>({
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

export const GradiumPersonType = new GraphQLObjectType<
  PersonIdentifier,
  Context
>({
  name: "GradiumPerson",
  fields: {
    ...GradiumIdentityType.toConfig().fields,
    email: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: i => i.email,
    },
  },
});

export const PaginatedIdentitiesType = SchemaBuilder.paginatedType<Identity>(
  "PaginatedIdentities",
  GradiumIdentityType,
);

export const PaginatedPersonType =
  SchemaBuilder.paginatedType<PersonIdentifier>(
    "PaginatedGradiumPeople",
    GradiumPersonType,
  );
