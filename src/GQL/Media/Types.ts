import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { IOrganizationID } from "GQL/Organization/Types";
import type { IPropertyImageType } from "GQL/PropertyImage/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";

export interface IGenerateCloudinarySignature extends IOrganizationID {
  type: IPropertyImageType;
}

export interface ICloudinarySignature {
  api_key: string;
  name: string;
  folder: string;
  timestamp: number;
  signature: string;
}

export const CloudinarySignature = new GraphQLObjectType<
  ICloudinarySignature,
  Context
>({
  name: "CloudinarySignature",
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
});
