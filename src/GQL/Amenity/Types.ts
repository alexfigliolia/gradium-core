import {
  GraphQLEnumType,
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
  price: string;
  open: string;
  close: string;
  size: string;
  billed: IBillFrequency;
  images: IGradiumImage[];
  floorPlans: IGradiumImage[];
  propertyId: number;
}

export interface IUpdateAmenity extends IdentifyProperty {
  id?: number;
  name: string;
  price: string;
  open: string;
  close: string;
  size: string;
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
      type: SchemaBuilder.nonNull(GraphQLString),
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
    size: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: space => space.size,
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
