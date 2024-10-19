import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import type { LivingSpaceType as ILivingSpaceType } from "@prisma/client";
import { GradiumImage, type IGradiumImage } from "GQL/Media/Types";
import type { IdentifyProperty } from "GQL/Property/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";

export interface ILivingSpace {
  id: number;
  name: string;
  type: ILivingSpaceType;
  beds: number;
  baths: number;
  footage: number;
  propertyId: number;
  images: IGradiumImage;
  floorPlans: IGradiumImage;
}

export interface IUpdateProperty extends IdentifyProperty {
  id?: number;
  name: string;
  type: ILivingSpaceType;
  beds: number;
  baths: number;
  footage: number;
}

export interface IDeleteLivingSpace extends IdentifyProperty {
  id: number;
}

export const LivingSpaceType = new GraphQLEnumType({
  name: "LivingSpaceType",
  values: {
    unit: {
      value: "unit",
    },
    dwelling: {
      value: "dwelling",
    },
  },
});

export const LivingSpace = new GraphQLObjectType<ILivingSpace, Context>({
  name: "LivingSpace",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: space => space.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: space => space.name,
    },
    type: {
      type: SchemaBuilder.nonNull(LivingSpaceType),
      resolve: space => space.type,
    },
    beds: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: space => space.beds,
    },
    baths: {
      type: SchemaBuilder.nonNull(GraphQLFloat),
      resolve: space => space.baths,
    },
    footage: {
      type: SchemaBuilder.nonNull(GraphQLFloat),
      resolve: space => space.footage,
    },
    propertyId: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: space => space.propertyId,
    },
    images: {
      type: SchemaBuilder.nonNullArray(GradiumImage),
      resolve: space => space.images,
    },
    floorPlans: {
      type: SchemaBuilder.nonNullArray(GradiumImage),
      resolve: space => space.floorPlans,
    },
  },
});
