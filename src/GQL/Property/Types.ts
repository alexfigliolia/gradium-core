import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import type { PropertyAddonType as IPropertyAddonType } from "@prisma/client";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";

interface IAdminBasicProperty {
  id: number;
  slug: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  mapsLink: string;
  addons: IPropertyAddon[];
  images: IPropertyImage[];
}

interface IPropertyImage {
  id: number;
  url: string;
}

interface IPropertyAddon {
  id: number;
  type: IPropertyAddonType;
}

export const PropertyAddonType = new GraphQLEnumType({
  name: "PropertyAddonType",
  values: {
    packageManagement: {
      value: "packageManagement",
    },
    amenityReservations: {
      value: "amenityReservations",
    },
    propertyEvents: {
      value: "propertyEvents",
    },
    leaseManagement: {
      value: "leaseManagement",
    },
    hoaManagement: {
      value: "hoaManagement",
    },
  },
});

export const PropertyAddon = new GraphQLObjectType<IPropertyAddon, Context>({
  name: "PropertyAddon",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: property => property.id,
    },
    type: {
      type: SchemaBuilder.nonNull(PropertyAddonType),
      resolve: property => property.type,
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

export const AdminBasicProperty = new GraphQLObjectType<
  IAdminBasicProperty,
  Context
>({
  name: "AdminBasicProperty",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: property => property.id,
    },
    slug: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: property => property.slug,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: property => property.name,
    },
    address1: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: property => property.address1,
    },
    address2: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: property => property.address2,
    },
    city: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: property => property.city,
    },
    state: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: property => property.state,
    },
    zipCode: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: property => property.zipCode,
    },
    mapsLink: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: property => property.mapsLink,
    },
    images: {
      type: SchemaBuilder.nonNullArray(PropertyImage),
      resolve: property => property.images,
    },
    addons: {
      type: SchemaBuilder.nonNullArray(PropertyAddon),
      resolve: property => property.addons,
    },
  },
});
