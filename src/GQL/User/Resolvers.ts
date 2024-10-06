import type { GraphQLFieldConfig } from "graphql";
import {
  GraphQLBoolean,
  GraphQLError,
  GraphQLInt,
  GraphQLString,
} from "graphql";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { UserController } from "./Controller";
import type { IdentifyEmail, IUpdateStringValue } from "./Types";
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

export const updateEmail: GraphQLFieldConfig<any, Context, IUpdateStringValue> =
  {
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

export const linkEmail: GraphQLFieldConfig<any, Context, IdentifyEmail> = {
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

export const deleteEmail: GraphQLFieldConfig<any, Context, IdentifyEmail> = {
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
      UserController.deleteEmail,
    );
    return operation(context.req, args);
  },
};

export const resetPassword: GraphQLFieldConfig<
  any,
  Context,
  IUpdateStringValue
> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
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
  resolve: async (_, args, context) => {
    if (!Permission.matchesKnownUser(context.req.session, args.userId)) {
      throw new GraphQLError("This operation is only permitted by the owner");
    }
    await UserController.resetPassword(args);
    return true;
  },
};
