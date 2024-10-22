import { GraphQLObjectType, GraphQLString } from "graphql";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";

export interface IEmail {
  email: string;
}

export interface IdentifyEmail {
  userId: number;
  email: string;
}

export const LinkedEmail = new GraphQLObjectType<IEmail, Context>({
  name: "LinkedEmail",
  fields: {
    email: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: email => email.email,
    },
  },
});
