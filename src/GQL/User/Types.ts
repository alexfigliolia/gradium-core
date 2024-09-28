import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { Role } from "@prisma/client";
import { RoleType } from "GQL/Roles/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context, Identity } from "Types/GraphQL";

export interface ID {
  id: number;
}

export interface IEmail {
  email: string;
}

export interface ILogin extends IEmail {
  password: string;
}

export interface ISignUp extends ILogin {
  name: string;
}

export interface IUserAffiliation {
  organization: Identity;
  roles: Pick<Role, "role">[];
}

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

export interface ILoggedInUser {
  id: number;
  name: string;
  email: string;
  affiliations: IUserAffiliation[];
}

export const LoggedInUser = new GraphQLObjectType<ILoggedInUser, Context>({
  name: "LoggedInUser",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: user => user.id,
    },
    email: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: user => user.email,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: user => user.name,
    },
    affiliations: {
      type: SchemaBuilder.nonNullArray(UserAffiliation),
      resolve: user => user.affiliations,
    },
  },
});
