import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { GradiumImage, type IGradiumImage } from "GQL/Media/Types";
import type { IdentifyProperty } from "GQL/Property/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context, DBID } from "Types/GraphQL";

export interface IBaseAmenity {
  name: string;
  price: string;
  open: string;
  close: string;
  capacity: number;
  billed: IBillFrequency;
}

export interface IAmenity extends IBaseAmenity, DBID {
  images: IGradiumImage[];
  floorPlans: IGradiumImage[];
  propertyId: number;
}

export interface IUpdateAmenity extends IdentifyProperty, IBaseAmenity {
  id?: number;
}

export interface IDeleteAmenity extends IdentifyProperty, DBID {}

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
      type: SchemaBuilder.nonNull(GraphQLDateTime),
      resolve: space => space.open,
    },
    close: {
      type: SchemaBuilder.nonNull(GraphQLDateTime),
      resolve: space => space.close,
    },
    capacity: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: space => space.capacity,
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
