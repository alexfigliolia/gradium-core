import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { type IPropertyAddon, PropertyAddon } from "GQL/Addons/Types";
import { GradiumImage, type IGradiumImage } from "GQL/Media/Types";
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
  images: IGradiumImage[];
}

export interface IdentifyProperty {
  propertyId: number;
  organizationId: number;
}

export interface IUpdateBasicPropertyInfo
  extends IdentifyProperty,
    IBasicPropertyInfo {}

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
      type: SchemaBuilder.nonNullArray(GradiumImage),
      resolve: property => property.images,
    },
    addons: {
      type: SchemaBuilder.nonNullArray(PropertyAddon),
      resolve: property => property.addons,
    },
  },
});
