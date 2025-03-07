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
import {
  createExpense,
  deleteExpense,
  updateExpense,
} from "./Expense/Resolvers";
import { createLease, fetchLeases } from "./Leases/Resolvers";
import { deleteEmail, linkEmail, updateEmail } from "./LinkedEmail/Resolvers";
import {
  createOrUpdateLivingSpace,
  deleteLivingSpace,
  fetchAvailableSpaces,
  fetchSoonToBeAvailableSpaces,
  getLivingSpaces,
  listSpacesForRent,
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
  deleteManagementTask,
  listManagementTasks,
  setManagementTaskStatus,
  updateManagementTask,
} from "./ManagementTask/Resolvers";
import {
  deleteDocument,
  deleteImage,
  generateDestroySignature,
  generateUploadSignature,
  saveDocument,
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
    fetchLeases,
    getAmenities,
    verifySession,
    listSpacesForRent,
    getLivingSpaces,
    listStaffMembers,
    listManagementTasks,
    fetchAvailableSpaces,
    fetchAmenityReservations,
    generateUploadSignature,
    generateDestroySignature,
    adminBasicPropertiesList,
    fetchSoonToBeAvailableSpaces,
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
    createLease,
    deleteEmail,
    updateEmail,
    saveDocument,
    resetPassword,
    createAccount,
    forgotPassword,
    deleteAmenity,
    createProperty,
    createExpense,
    updateExpense,
    deleteExpense,
    deleteDocument,
    inviteStaffMember,
    deleteLivingSpace,
    setOrganizationName,
    modifyPropertyAddons,
    createOrUpdateAmenity,
    createManagementTask,
    updateManagementTask,
    deleteManagementTask,
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
