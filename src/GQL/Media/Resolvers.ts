import type { GraphQLFieldConfig } from "graphql";
import { GraphQLError, GraphQLInt, GraphQLString } from "graphql";
import { IdentifyPropertyArgs } from "GQL/AmenityReservation/Types";
import { MediaClient } from "Media/Client";
import { Permission } from "Tools/Permission";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";
import { MediaController } from "./Controller";
import type {
  ICreateGradiumDocument,
  ICreateGradiumImage,
  IDeleteGradiumDocument,
  IDeleteGradiumImage,
  IGenerateDestroySignature,
  IGenerateUploadSignature,
} from "./Types";
import {
  DestroySignature,
  GradiumDocument,
  GradiumDocumentType,
  GradiumImage,
  GradiumImageType,
  UploadSignature,
} from "./Types";

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
    imageType: {
      type: GradiumImageType,
    },
    documentType: {
      type: GradiumDocumentType,
    },
  },
  resolve: (_, { organizationId, imageType, documentType }, context) => {
    if (!imageType || documentType) {
      throw new GraphQLError("An image or document type must be specified");
    }
    MediaController.verify(context.req.session, organizationId);
    return MediaController.wrapSignature(
      MediaClient.signUpload,
      imageType || documentType,
    );
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
    imageType: {
      type: GradiumImageType,
    },
    documentType: {
      type: GradiumDocumentType,
    },
  },
  resolve: (
    _,
    { organizationId, publicId, imageType, documentType },
    context,
  ) => {
    if (!imageType || documentType) {
      throw new GraphQLError("An image or document type must be specified");
    }
    MediaController.verify(context.req.session, organizationId);
    return MediaController.wrapSignature(
      MediaClient.signDestroy,
      imageType || documentType,
      publicId,
    );
  },
};

export const deleteImage: GraphQLFieldConfig<
  any,
  Context,
  IDeleteGradiumImage
> = {
  type: SchemaBuilder.nonNull(GradiumImage),
  args: {
    ...IdentifyPropertyArgs,
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    type: {
      type: SchemaBuilder.nonNull(GradiumImageType),
    },
  },
  resolve: (_, { organizationId, ...rest }, context) => {
    const operation = Permission.permissedTransaction({
      organizationId,
      session: context.req.session,
      operation: MediaController.Images.delete,
      errorMessage:
        "You do not have permission to modify attachments for this property",
    });
    return operation(rest);
  },
};

export const saveImage: GraphQLFieldConfig<any, Context, ICreateGradiumImage> =
  {
    type: SchemaBuilder.nonNull(GradiumImage),
    args: {
      ...IdentifyPropertyArgs,
      entityId: {
        type: SchemaBuilder.nonNull(GraphQLInt),
      },
      url: {
        type: SchemaBuilder.nonNull(GraphQLString),
      },
      type: {
        type: SchemaBuilder.nonNull(GradiumImageType),
      },
    },
    resolve: (_, { organizationId, ...rest }, context) => {
      const operation = Permission.permissedTransaction({
        organizationId,
        session: context.req.session,
        operation: MediaController.Images.create,
        errorMessage:
          "You do not have permission to modify media content for this property",
      });
      return operation(rest);
    },
  };

export const deleteDocument: GraphQLFieldConfig<
  any,
  Context,
  IDeleteGradiumDocument
> = {
  type: SchemaBuilder.nonNull(GradiumDocument),
  args: {
    ...IdentifyPropertyArgs,
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    type: {
      type: SchemaBuilder.nonNull(GradiumDocumentType),
    },
  },
  resolve: (_, { organizationId, ...rest }, context) => {
    const operation = Permission.permissedTransaction({
      organizationId,
      session: context.req.session,
      operation: MediaController.Documents.delete,
      errorMessage:
        "You do not have permission to modify documents for this property",
    });
    return operation(rest);
  },
};

export const saveDocument: GraphQLFieldConfig<
  any,
  Context,
  ICreateGradiumDocument
> = {
  type: SchemaBuilder.nonNull(GradiumDocument),
  args: {
    ...IdentifyPropertyArgs,
    entityId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    url: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    thumbnail: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
    type: {
      type: SchemaBuilder.nonNull(GradiumDocumentType),
    },
  },
  resolve: (_, { organizationId, ...rest }, context) => {
    const operation = Permission.permissedTransaction({
      organizationId,
      session: context.req.session,
      operation: MediaController.Documents.create,
      errorMessage:
        "You do not have permission to modify media content for this property",
    });
    return operation(rest);
  },
};
