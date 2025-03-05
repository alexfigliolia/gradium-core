import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import type { IOrganizationID } from "GQL/Organization/Types";
import type { IdentifyProperty } from "GQL/Property/Types";
import { GradiumIdentityType } from "Tools/GraphQLIdentity";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context, DBID, Identity } from "Types/GraphQL";

export interface ICreateReservation extends IdentifyProperty {
  start: string;
  end: string;
  charge?: boolean;
  amenityId: number;
  personId: number;
}

export interface IUpdateReservation extends ICreateReservation, DBID {}

export interface IDeleteReservation extends IdentifyProperty, DBID {}

export interface IListReservations extends IOrganizationID {
  date: string;
  propertyId: number;
  reservers?: number[];
  amenityIds?: number[];
}

export interface IReservation {
  id: number;
  start: string;
  end: string;
  amenity: Identity;
  person: Identity;
}

export const AmenityReservation = new GraphQLObjectType<IReservation, Context>({
  name: "AmenityReservation",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: v => v.id,
    },
    start: {
      type: SchemaBuilder.nonNull(GraphQLDateTime),
      resolve: v => v.start,
    },
    end: {
      type: SchemaBuilder.nonNull(GraphQLDateTime),
      resolve: v => v.end,
    },
    amenity: {
      type: SchemaBuilder.nonNull(GradiumIdentityType),
      resolve: v => v.amenity,
    },
    person: {
      type: SchemaBuilder.nonNull(GradiumIdentityType),
      resolve: v => v.person,
    },
  },
});

export const IdentifyPropertyArgs = {
  propertyId: {
    type: SchemaBuilder.nonNull(GraphQLInt),
  },
  organizationId: {
    type: SchemaBuilder.nonNull(GraphQLInt),
  },
};

export const CreateReservationArgs = {
  ...IdentifyPropertyArgs,
  amenityId: {
    type: SchemaBuilder.nonNull(GraphQLInt),
  },
  personId: {
    type: SchemaBuilder.nonNull(GraphQLInt),
  },
  start: {
    type: SchemaBuilder.nonNull(GraphQLDateTime),
  },
  end: {
    type: SchemaBuilder.nonNull(GraphQLDateTime),
  },
  charge: {
    type: GraphQLBoolean,
  },
};

export const UpdateReservationArgs = {
  id: {
    type: SchemaBuilder.nonNull(GraphQLInt),
  },
  ...CreateReservationArgs,
};
