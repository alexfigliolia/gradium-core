import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { Role } from "@prisma/client";
import { type IEmail, LinkedEmail } from "GQL/LinkedEmail/Types";
import { RoleType } from "GQL/Roles/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context, Identity } from "Types/GraphQL";

export interface ID {
  id: number;
}

export interface ILogin extends IEmail {
  password: string;
}

export interface ICreateUser {
  name: string;
  password: string;
}

export interface ISignUp extends ILogin {
  name: string;
}

export interface IUserAffiliation {
  organization: Identity;
  roles: Pick<Role, "role">[];
}

export interface ILoggedInUser {
  id: number;
  name: string;
  emails: IEmail[];
  affiliations: IUserAffiliation[];
}

export interface IUpdateStringValue {
  next: string;
  previous: string;
  userId: number;
}

export type IBasicUser = Pick<ILoggedInUser, "name" | "emails">;

export const OrgAffiliation = new GraphQLObjectType<Identity, Context>({
  name: "OrgAffiliation",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: organization => organization.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: organization => organization.name,
    },
  },
});

export const UserAffiliation = new GraphQLObjectType<IUserAffiliation, Context>(
  {
    name: "UserAffiliation",
    fields: {
      organization: {
        type: SchemaBuilder.nonNull(OrgAffiliation),
        resolve: affiliation => affiliation.organization,
      },
      roles: {
        type: SchemaBuilder.nonNullArray(RoleType),
        resolve: affiliation => affiliation.roles,
      },
    },
  },
);

export const BasicUser = new GraphQLObjectType<IBasicUser, Context>({
  name: "BasicUser",
  fields: {
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: user => user.name,
    },
    emails: {
      type: SchemaBuilder.nonNullArray(LinkedEmail),
      resolve: user => user.emails,
    },
  },
});

export const LoggedInUser = new GraphQLObjectType<ILoggedInUser, Context>({
  name: "LoggedInUser",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: user => user.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: user => user.name,
    },
    emails: {
      type: SchemaBuilder.nonNullArray(LinkedEmail),
      resolve: user => user.emails,
    },
    affiliations: {
      type: SchemaBuilder.nonNullArray(UserAffiliation),
      resolve: user => user.affiliations,
    },
  },
});
