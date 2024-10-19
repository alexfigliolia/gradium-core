import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { modifyPropertyAddons } from "./Addons/Resolvers";
import {
  createOrUpdateLivingSpace,
  deleteLivingSpace,
  getLivingSpaces,
} from "./LivingSpace/Resolvers";
import {
  createAccount,
  forgotPassword,
  login,
  logout,
  verifySession,
} from "./Login/Resolvers";
import {
  deleteImage,
  generateDestroySignature,
  generateUploadSignature,
  saveImage,
} from "./Media/Resolvers";
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
    getLivingSpaces,
    generateUploadSignature,
    generateDestroySignature,
    adminBasicPropertiesList,
  },
});

const MutationRoot = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    login,
    logout,
    linkEmail,
    saveImage,
    deleteImage,
    deleteEmail,
    updateEmail,
    resetPassword,
    createAccount,
    forgotPassword,
    createProperty,
    inviteStaffMember,
    deleteLivingSpace,
    setOrganizationName,
    modifyPropertyAddons,
    updateBasicPropertyInfo,
    createOrUpdateLivingSpace,
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
