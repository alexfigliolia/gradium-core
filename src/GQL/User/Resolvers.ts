import type { GraphQLFieldConfig } from "graphql";
import { GraphQLError } from "graphql";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { UserController } from "./Controller";
import { LoggedInUser } from "./Types";

export const userScope: GraphQLFieldConfig<
  any,
  Context,
  Record<string, never>
> = {
  type: SchemaBuilder.nonNull(LoggedInUser),
  resolve: (_1, _2, context) => {
    if (!Permission.knownUser(context.req.session)) {
      throw new GraphQLError("You must be logged in to access user data");
    }
    return UserController.authenticatedUserScope(context.req.session.userID);
  },
};
