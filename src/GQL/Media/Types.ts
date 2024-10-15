import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import type { IOrganizationID } from "GQL/Organization/Types";
import type { IPropertyImageType } from "GQL/PropertyImage/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";

export interface IGenerateUploadSignature extends IOrganizationID {
  type: IPropertyImageType;
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
