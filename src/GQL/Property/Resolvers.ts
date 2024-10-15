import type { GraphQLFieldConfig } from "graphql";
import { GraphQLError, GraphQLInt, GraphQLString } from "graphql";
import type { INameAndOrgID, IOrganizationID } from "GQL/Organization/Types";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { PropertyController } from "./Controller";
import type { IUpdateBasicPropertyInfo } from "./Types";
import { AdminBasicProperty } from "./Types";

export const createProperty: GraphQLFieldConfig<any, Context, INameAndOrgID> = {
  type: SchemaBuilder.nonNull(AdminBasicProperty),
  args: {
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, args, context) => {
    if (!Permission.hasOrgAccess(context.req.session, args.organizationId)) {
      throw new GraphQLError(
        "You do not have permission to create properties within this organizaiton",
      );
    }
    return PropertyController.create(args);
  },
};

export const updateBasicPropertyInfo: GraphQLFieldConfig<
  any,
  Context,
  IUpdateBasicPropertyInfo
> = {
  type: SchemaBuilder.nonNull(AdminBasicProperty),
  args: {
    propertyId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    address1: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    address2: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    city: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    state: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    zipCode: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
  resolve: (_, args, context) => {
    const operation = Permission.permissedTransaction({
      session: context.req.session,
      organizationId: args.organizationId,
      operation: PropertyController.updateBasicInfo,
      errorMessage: "You do not have permission to modify this property",
    });
    return operation(args);
  },
};

export const adminBasicPropertiesList: GraphQLFieldConfig<
  any,
  Context,
  IOrganizationID
> = {
  type: SchemaBuilder.nonNullArray(AdminBasicProperty),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
  },
  resolve: (_, { organizationId }, context) => {
    const { session } = context.req;
    if (!Permission.hasOrgAccess(session, organizationId)) {
      throw new GraphQLError("You do not have access to this organization");
    }
    return PropertyController.fetch(session.userID, organizationId);
  },
};
