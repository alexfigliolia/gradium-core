import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { modifyPropertyAddons } from "./Addons/Resolvers";
import {
  createOrUpdateAmenity,
  deleteAmenity,
  getAmenities,
} from "./Amenity/Resolvers";
import { deleteEmail, linkEmail, updateEmail } from "./LinkedEmail/Resolvers";
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
import { resetPassword, userScope } from "./User/Resolvers";

const QueryRoot = new GraphQLObjectType({
  name: "Query",
  fields: {
    userScope,
    getAmenities,
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
    deleteAmenity,
    createProperty,
    inviteStaffMember,
    deleteLivingSpace,
    setOrganizationName,
    modifyPropertyAddons,
    createOrUpdateAmenity,
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
