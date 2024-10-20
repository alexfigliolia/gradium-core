import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GradiumImage, type IGradiumImage } from "GQL/Media/Types";
import type { IdentifyProperty } from "GQL/Property/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";

export interface IAmenity {
  id: number;
  name: string;
  price: number;
  open: string;
  close: string;
  footage: number;
  billed: IBillFrequency;
  images: IGradiumImage[];
  floorPlans: IGradiumImage[];
  propertyId: number;
}

export interface IUpdateAmenity extends IdentifyProperty {
  id?: number;
  name: string;
  price: number;
  open: string;
  close: string;
  footage: number;
  billed: IBillFrequency;
}

export interface IDeleteAmenity extends IdentifyProperty {
  id: number;
}

export enum IBillFrequency {
  "hour" = "hour",
  "day" = "day",
}

export const BillFrequency = new GraphQLEnumType({
  name: "BillFrequency",
  values: {
    hour: {
      value: "hour",
    },
    day: {
      value: "day",
    },
  },
});

export const Amenity = new GraphQLObjectType<IAmenity, Context>({
  name: "Amenity",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: space => space.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: space => space.name,
    },
    price: {
      type: SchemaBuilder.nonNull(GraphQLFloat),
      resolve: space => space.price,
    },
    billed: {
      type: SchemaBuilder.nonNull(BillFrequency),
      resolve: space => space.billed,
    },
    open: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: space => space.open,
    },
    close: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: space => space.close,
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
