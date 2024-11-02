import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import type { IOrganizationID } from "GQL/Organization/Types";
import type { IdentifyProperty } from "GQL/Property/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context, DBID, IEntitySnapshot } from "Types/GraphQL";
import { EntitySnapshot } from "Types/GraphQL";

export interface ICreateReservation extends IdentifyProperty {
  date: string;
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
  amenityIds?: number[];
}

export interface IReservation {
  id: number;
  date: string;
  start: string;
  end: string;
  amenity: IEntitySnapshot;
  person: IEntitySnapshot;
}

export const AmenityReservation = new GraphQLObjectType<IReservation, Context>({
  name: "AmenityReservation",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: v => v.id,
    },
    date: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: v => v.date,
    },
    start: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: v => v.start,
    },
    end: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: v => v.end,
    },
    amenity: {
      type: SchemaBuilder.nonNull(EntitySnapshot),
      resolve: v => v.amenity,
    },
    person: {
      type: SchemaBuilder.nonNull(EntitySnapshot),
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
  date: {
    type: SchemaBuilder.nonNull(GraphQLString),
  },
  start: {
    type: SchemaBuilder.nonNull(GraphQLString),
  },
  end: {
    type: SchemaBuilder.nonNull(GraphQLString),
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
