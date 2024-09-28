import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {
  createAccount,
  forgotPassword,
  login,
  logout,
  verifySession,
} from "./Login/Resolvers";
import { userScope } from "./User/Resolvers";

const QueryRoot = new GraphQLObjectType({
  name: "Query",
  fields: {
    userScope,
    verifySession,
  },
});

const MutationRoot = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    login,
    logout,
    createAccount,
    forgotPassword,
  },
});

// const SubscriptionRoot = new GraphQLObjectType({
//   name: "Subscription",
//   fields: () => ({}),
// });

export const Schema = new GraphQLSchema({
  query: QueryRoot,
  mutation: MutationRoot,
  // subscription: SubscriptionRoot,
});
