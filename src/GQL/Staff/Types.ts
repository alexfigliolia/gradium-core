import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { IOrganizationID } from "GQL/Organization/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type {
  Context,
  DBID,
  IPagination,
  IPaginationResult,
} from "Types/GraphQL";

export interface IInviteStaffMember extends IOrganizationID {
  email: string;
}

export interface IFetchStaff extends IPagination, IOrganizationID {}

export interface IStaffProfile extends DBID {
  name: string;
}

export const StaffMember = new GraphQLObjectType<IStaffProfile, Context>({
  name: "StaffMember",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: s => s.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: s => s.name,
    },
  },
});

export type IPaginatedStaff = IPaginationResult<IStaffProfile>;

export const PaginatedStaff = SchemaBuilder.paginatedType<IStaffProfile>(
  "PaginatedStaff",
  StaffMember,
);
