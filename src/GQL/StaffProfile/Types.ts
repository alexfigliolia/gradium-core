import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context, DBID } from "Types/GraphQL";

export interface IStaffProfile extends DBID {
  name: string;
}

export const StaffProfile = new GraphQLObjectType<IStaffProfile, Context>({
  name: "StaffProfile",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: s => s.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: s => s.name,
    },
  },
});
