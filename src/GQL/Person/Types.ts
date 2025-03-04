import type { IOrganizationID } from "GQL/Organization/Types";
import type { IPagination } from "Types/GraphQL";

export interface IFetchPeople extends IPagination, IOrganizationID {}
