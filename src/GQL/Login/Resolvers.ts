import {
  GraphQLBoolean,
  type GraphQLFieldConfig,
  GraphQLString,
} from "graphql";
import type { IEmail } from "GQL/LinkedEmail/Types";
import type { ILogin, ISignUp } from "GQL/User/Types";
import { LoggedInUser } from "GQL/User/Types";
import { SessionsManager } from "Sessions/Manager";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { LoginController } from "./Controller";

export const createAccount: GraphQLFieldConfig<any, Context, ISignUp> = {
  type: SchemaBuilder.nonNull(LoggedInUser),
  args: {
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    email: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    password: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: async (_, args, context) => {
    const user = await LoginController.signUp(args);
    SessionsManager.setSessionData(user, context.req);
    return user;
  },
};

export const login: GraphQLFieldConfig<any, Context, ILogin> = {
  type: SchemaBuilder.nonNull(LoggedInUser),
  args: {
    email: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    password: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: async (_, args, context) => {
    const user = await LoginController.login(args);
    SessionsManager.setSessionData(user, context.req);
    return user;
  },
};

export const verifySession: GraphQLFieldConfig<
  any,
  Context,
  Record<string, never>
> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  resolve: async (_1, _2, context) => {
    return SessionsManager.validateSession(context.req);
  },
};

export const logout: GraphQLFieldConfig<any, Context, Record<string, never>> = {
  type: SchemaBuilder.nonNull(GraphQLBoolean),
  resolve: async (_1, _2, context) => {
    await SessionsManager.destroySession(context.req);
    return true;
  },
};

export const forgotPassword: GraphQLFieldConfig<any, Context, IEmail> = {
  type: SchemaBuilder.nonNull(GraphQLString),
  args: {
    email: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: async (_1, { email }) => {
    return LoginController.sendPasswordResetEmail(email);
  },
};
