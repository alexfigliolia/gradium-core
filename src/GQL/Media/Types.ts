import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { IOrganizationID } from "GQL/Organization/Types";
import type { IPropertyImageType } from "GQL/PropertyImage/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";

export interface IGenerateUploadSignature extends IOrganizationID {
  type: IPropertyImageType;
}

export interface IUploadSignature {
  api_key: string;
  name: string;
  folder: string;
  timestamp: number;
  signature: string;
  transformation: string;
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
      transformation: {
        type: SchemaBuilder.nonNull(GraphQLString),
        resolve: sig => sig.transformation,
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
