import { GraphQLEnumType, GraphQLObjectType } from "graphql";
import { SchemaBuilder } from "Tools/SchemaBuilder";

export const PersonRoleType = new GraphQLEnumType({
  name: "PersonRoleType",
  values: {
    owner: {
      value: "owner",
    },
    manager: {
      value: "manager",
    },
    maintenance: {
      value: "maintenance",
    },
    resident: {
      value: "resident",
    },
  },
});

export const RoleType = new GraphQLObjectType({
  name: "PersonRole",
  fields: {
    role: {
      type: SchemaBuilder.nonNull(PersonRoleType),
    },
  },
});
