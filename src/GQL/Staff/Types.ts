import type { IOrganizationID } from "GQL/Organization/Types";
import type { IPagination } from "Types/GraphQL";

export interface IInviteStaffMember extends IOrganizationID {
  email: string;
}

export interface IFetchStaff extends IPagination, IOrganizationID {}
