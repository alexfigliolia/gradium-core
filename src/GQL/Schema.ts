import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { modifyPropertyAddons } from "./Addons/Resolvers";
import {
  createOrUpdateAmenity,
  deleteAmenity,
  getAmenities,
} from "./Amenity/Resolvers";
import {
  cancelAmenityReservation,
  createAmenityReservation,
  fetchAmenityReservations,
  updateAmenityReservation,
} from "./AmenityReservation/Resolvers";
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
  createManagementTask,
  listManagementTasks,
  setManagementTaskStatus,
  updateManagementTask,
} from "./ManagementTask/Resolvers";
import {
  deleteImage,
  generateDestroySignature,
  generateUploadSignature,
  saveImage,
} from "./Media/Resolvers";
import { setOrganizationName } from "./Organization/Resolvers";
import { listPeople } from "./Person/Resolvers";
import {
  adminBasicPropertiesList,
  createProperty,
  updateBasicPropertyInfo,
} from "./Property/Resolvers";
import { inviteStaffMember, listStaffMembers } from "./Staff/Resolvers";
import { resetPassword, userScope } from "./User/Resolvers";

const QueryRoot = new GraphQLObjectType({
  name: "Query",
  fields: {
    userScope,
    listPeople,
    getAmenities,
    verifySession,
    getLivingSpaces,
    listStaffMembers,
    listManagementTasks,
    fetchAmenityReservations,
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
    createManagementTask,
    updateManagementTask,
    setManagementTaskStatus,
    updateBasicPropertyInfo,
    createAmenityReservation,
    cancelAmenityReservation,
    updateAmenityReservation,
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
