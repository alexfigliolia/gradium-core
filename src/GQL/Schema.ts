import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {
  createPropertyAddon,
  createPropertyAddons,
  deletePropertyAddon,
} from "./Addons/Resolvers";
import {
  createAccount,
  forgotPassword,
  login,
  logout,
  verifySession,
} from "./Login/Resolvers";
import { setOrganizationName } from "./Organization/Resolvers";
import { adminBasicProperties, createProperty } from "./Property/Resolvers";
import { inviteStaffMember } from "./Staff/Resolvers";
import {
  deleteEmail,
  linkEmail,
  resetPassword,
  updateEmail,
  userScope,
} from "./User/Resolvers";

const QueryRoot = new GraphQLObjectType({
  name: "Query",
  fields: {
    userScope,
    verifySession,
    adminBasicProperties,
  },
});

const MutationRoot = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    login,
    logout,
    linkEmail,
    deleteEmail,
    updateEmail,
    resetPassword,
    createAccount,
    forgotPassword,
    createProperty,
    inviteStaffMember,
    setOrganizationName,
    createPropertyAddon,
    deletePropertyAddon,
    createPropertyAddons,
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
