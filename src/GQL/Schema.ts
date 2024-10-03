import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {
  createAccount,
  forgotPassword,
  login,
  logout,
  verifySession,
} from "./Login/Resolvers";
import { setOrganizationName } from "./Organization/Resolvers";
import { inviteStaffMember } from "./Staff/Resolvers";
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
    inviteStaffMember,
    setOrganizationName,
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
