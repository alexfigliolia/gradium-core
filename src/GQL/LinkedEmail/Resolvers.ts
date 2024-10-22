import { type GraphQLFieldConfig, GraphQLInt, GraphQLString } from "graphql";
import { BasicUser, type IUpdateStringValue } from "GQL/User/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { LinkedEmailController } from "./Controller";
import type { IdentifyEmail } from "./Types";

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
      const operation = LinkedEmailController.generateUserFlow({
        operation: LinkedEmailController.updateEmail,
        errorMessage: "Only the owner of this email address can update it",
      });
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
    const operation = LinkedEmailController.generateUserFlow({
      operation: LinkedEmailController.linkEmail,
      errorMessage:
        "Only the end user may link email addresses to his or her account.",
    });
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
    const operation = LinkedEmailController.generateUserFlow({
      operation: LinkedEmailController.deleteEmail,
      errorMessage: "Only the owner of this email address can delete it.",
    });
    return operation(context.req, args);
  },
};
