import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { type IPropertyAddon, PropertyAddon } from "GQL/Addons/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context } from "Types/GraphQL";

export interface IBasicPropertyInfo {
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
}

interface IAdminBasicProperty extends IBasicPropertyInfo {
  id: number;
  slug: string;
  mapsLink: string;
  addons: IPropertyAddon[];
  images: IPropertyImage[];
}

interface IPropertyImage {
  id: number;
  url: string;
}

export interface IdentifyProperty {
  propertyId: number;
  organizationId: number;
}

export interface IUpdateBasicPropertyInfo
  extends IdentifyProperty,
    IBasicPropertyInfo {}

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
