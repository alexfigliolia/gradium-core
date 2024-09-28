import type { GraphQLFieldConfig } from "graphql";
import { GraphQLInt } from "graphql";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { UserController } from "./Controller";
import type { ID } from "./Types";
import { LoggedInUser } from "./Types";

export const userScope: GraphQLFieldConfig<any, Context, ID> = {
  type: SchemaBuilder.nonNull(LoggedInUser),
  args: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, { id }) => {
    return UserController.authenticatedUserScope(id);
  },
};
