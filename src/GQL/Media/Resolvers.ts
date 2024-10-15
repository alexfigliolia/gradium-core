import type { GraphQLFieldConfig } from "graphql";
import { GraphQLError, GraphQLInt } from "graphql";
import { PropertyImageType } from "GQL/PropertyImage/Types";
import { MediaClient } from "Media/Client";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import type { IGenerateCloudinarySignature } from "./Types";
import { CloudinarySignature } from "./Types";

export const generateCloudinarySignature: GraphQLFieldConfig<
  any,
  Context,
  IGenerateCloudinarySignature
> = {
  type: SchemaBuilder.nonNull(CloudinarySignature),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    type: {
      type: SchemaBuilder.nonNull(PropertyImageType),
    },
  },
  resolve: async (_, { organizationId, type }, context) => {
    if (!Permission.hasOrgAccess(context.req.session, organizationId)) {
      throw new GraphQLError("You do not have access to this organization");
    }
    try {
      const destination = await MediaClient.sign(type);
      return destination;
    } catch (error) {
      throw new GraphQLError("Something went wrong. Please try again");
    }
  },
};
