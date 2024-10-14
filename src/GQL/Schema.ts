import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { modifyPropertyAddons } from "./Addons/Resolvers";
import {
  createAccount,
  forgotPassword,
  login,
  logout,
  verifySession,
} from "./Login/Resolvers";
import { setOrganizationName } from "./Organization/Resolvers";
import {
  adminBasicPropertiesList,
  createProperty,
  updateBasicPropertyInfo,
} from "./Property/Resolvers";
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
    adminBasicPropertiesList,
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
    modifyPropertyAddons,
    updateBasicPropertyInfo,
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
