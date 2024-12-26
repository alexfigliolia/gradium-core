import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import type { IOrganizationID } from "GQL/Organization/Types";
import type { IdentifyProperty } from "GQL/Property/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";

export interface IGenerateUploadSignature extends IOrganizationID {
  type: IGradiumImageType;
}

export interface IGenerateDestroySignature extends IGenerateUploadSignature {
  publicId: string;
}

export interface IUploadSignature {
  api_key: string;
  name: string;
  folder: string;
  timestamp: number;
  signature: string;
}

export interface IDestroySignature extends Omit<IUploadSignature, "folder"> {
  public_id: string;
  invalidate: boolean;
  resource_type: string;
}

export const UploadSignature = new GraphQLObjectType<IUploadSignature, Context>(
  {
    name: "UploadSignature",
    fields: {
      api_key: {
        type: SchemaBuilder.nonNull(GraphQLString),
        resolve: sig => sig.api_key,
      },
      name: {
        type: SchemaBuilder.nonNull(GraphQLString),
        resolve: sig => sig.name,
      },
      folder: {
        type: SchemaBuilder.nonNull(GraphQLString),
        resolve: sig => sig.folder,
      },
      timestamp: {
        type: SchemaBuilder.nonNull(GraphQLInt),
        resolve: sig => sig.timestamp,
      },
      signature: {
        type: SchemaBuilder.nonNull(GraphQLString),
        resolve: sig => sig.signature,
      },
    },
  },
);

export const DestroySignature = new GraphQLObjectType<
  IDestroySignature,
  Context
>({
  name: "DestroySignature",
  fields: {
    ...UploadSignature.toConfig().fields,
    invalidate: {
      type: SchemaBuilder.nonNull(GraphQLBoolean),
      resolve: sig => sig.invalidate,
    },
    resource_type: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: sig => sig.resource_type,
    },
    public_id: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: sig => sig.public_id,
    },
  },
});

export interface IGradiumImage {
  id: number;
  url: string;
}
export interface IdentifyGradiumImage extends IdentifyProperty {
  type: IGradiumImageType;
}

export interface IDeleteGradiumImage extends IdentifyGradiumImage {
  id: number;
}

export interface ICreateGradiumImage extends IdentifyGradiumImage {
  url: string;
  entityId: number;
}

export enum IGradiumImageType {
  "propertyImage" = "propertyImage",
  "livingSpaceImage" = "livingSpaceImage",
  "livingSpaceFloorPlan" = "livingSpaceFloorPlan",
  "amenityImage" = "amenityImage",
  "amenityFloorPlan" = "amenityFloorPlan",
  "taskImage" = "taskImage",
}

export const GradiumImageType = new GraphQLEnumType({
  name: "GradiumImageType",
  values: {
    propertyImage: {
      value: "propertyImage",
    },
    livingSpaceImage: {
      value: "livingSpaceImage",
    },
    livingSpaceFloorPlan: {
      value: "livingSpaceFloorPlan",
    },
    amenityImage: {
      value: "amenityImage",
    },
    amenityFloorPlan: {
      value: "amenityFloorPlan",
    },
    taskImage: {
      value: "taskImage",
    },
  },
});

export const GradiumImage = new GraphQLObjectType<IGradiumImage, Context>({
  name: "GradiumImage",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: property => property.id,
    },
    url: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: property => property.url,
    },
  },
});

export const GradiumImageInput = new GraphQLInputObjectType({
  name: "GradiumImageInput",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
    },
    url: {
      type: SchemaBuilder.nonNull(GraphQLString),
    },
  },
});
