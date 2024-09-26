import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { Role } from "@prisma/client";
import { RoleType } from "GraphQL/Roles/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";

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
  organizationId: number;
  roles: Pick<Role, "role">[];
}

export const UserAffiliation = new GraphQLObjectType<IUserAffiliation, Context>(
  {
    name: "UserAffiliation",
    fields: {
      organizationId: {
        type: SchemaBuilder.nonNull(GraphQLString),
      },
      roles: {
        type: SchemaBuilder.nonNullArray(RoleType),
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
