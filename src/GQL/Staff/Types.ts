import type { IOrganizationID } from "GQL/Organization/Types";

export interface IInviteStaffMember extends IOrganizationID {
  email: string;
}
