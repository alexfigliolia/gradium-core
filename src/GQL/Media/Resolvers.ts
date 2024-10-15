import type { GraphQLFieldConfig } from "graphql";
import { GraphQLError, GraphQLInt } from "graphql";
import { PropertyImageType } from "GQL/PropertyImage/Types";
import { MediaClient } from "Media/Client";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import type { IGenerateUploadSignature } from "./Types";
import { UploadSignature } from "./Types";

export const generateUploadSignature: GraphQLFieldConfig<
  any,
  Context,
  IGenerateUploadSignature
> = {
  type: SchemaBuilder.nonNull(UploadSignature),
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
      const destination = await MediaClient.signUpload(type);
      return destination;
    } catch (error) {
      throw new GraphQLError("Something went wrong. Please try again");
    }
  },
};
