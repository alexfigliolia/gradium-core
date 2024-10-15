import type { GraphQLFieldConfig } from "graphql";
import { GraphQLInt, GraphQLString } from "graphql";
import { PropertyImageType } from "GQL/PropertyImage/Types";
import { MediaClient } from "Media/Client";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { MediaController } from "./Controller";
import type {
  IGenerateDestroySignature,
  IGenerateUploadSignature,
} from "./Types";
import { DestroySignature, UploadSignature } from "./Types";

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
  resolve: (_, { organizationId, type }, context) => {
    MediaController.verify(context.req.session, organizationId);
    return MediaController.wrapSignature(MediaClient.signUpload, type);
  },
};

export const generateDestroySignature: GraphQLFieldConfig<
  any,
  Context,
  IGenerateDestroySignature
> = {
  type: SchemaBuilder.nonNull(DestroySignature),
  args: {
    organizationId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    publicId: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    type: {
      type: SchemaBuilder.nonNull(PropertyImageType),
    },
  },
  resolve: (_, { organizationId, publicId, type }, context) => {
    MediaController.verify(context.req.session, organizationId);
    return MediaController.wrapSignature(
      MediaClient.signDestroy,
      type,
      publicId,
    );
  },
};
