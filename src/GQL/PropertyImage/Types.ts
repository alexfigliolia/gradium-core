import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import type { Context } from "vm";
import type { IdentifyProperty } from "GQL/Property/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";

export interface IPropertyImage {
  id: number;
  url: string;
}

export interface ICreatePropertyImage extends IdentifyProperty {
  url: string;
}

export enum IPropertyImageType {
  "propertyImage" = "propertyImage",
  "livingSpaceImage" = "livingSpaceImage",
  "livingSpaceFloorPlan" = "livingSpaceFloorPlan",
}

export const PropertyImageType = new GraphQLEnumType({
  name: "PropertyImageType",
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
  },
});

export const PropertyImage = new GraphQLObjectType<IPropertyImage, Context>({
  name: "PropertyImage",
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
