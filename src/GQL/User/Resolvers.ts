import type { GraphQLFieldConfig } from "graphql";
import { GraphQLError, GraphQLInt, GraphQLString } from "graphql";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { UserController } from "./Controller";
import type { ILinkEmail, IUpdateEmail } from "./Types";
import { BasicUser, LoggedInUser } from "./Types";

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

export const updateEmail: GraphQLFieldConfig<any, Context, IUpdateEmail> = {
  type: SchemaBuilder.nonNull(BasicUser),
  args: {
    userId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    previous: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    next: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: (_, args, context) => {
    const operation = UserController.createUserModifier(
      UserController.updateEmail,
    );
    return operation(context.req, args);
  },
};

export const linkEmail: GraphQLFieldConfig<any, Context, ILinkEmail> = {
  type: SchemaBuilder.nonNull(BasicUser),
  args: {
    userId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    email: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: (_, args, context) => {
    const operation = UserController.createUserModifier(
      UserController.linkEmail,
    );
    return operation(context.req, args);
  },
};
