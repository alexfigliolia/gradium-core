import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { type IPropertyAddon, PropertyAddon } from "GQL/Addons/Types";
import { GradiumImage, type IGradiumImage } from "GQL/Media/Types";
import type { IOrganizationID } from "GQL/Organization/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context, IPagination } from "Types/GraphQL";

export interface IBasicPropertyInfo {
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ICreateProperty extends IBasicPropertyInfo, IOrganizationID {}

interface IAdminBasicProperty extends IBasicPropertyInfo {
  id: number;
  slug: string;
  mapsLink: string;
  addons: IPropertyAddon[];
  images: IGradiumImage[];
}

export interface IdentifyProperty extends IOrganizationID {
  propertyId: number;
}

export interface IPaginateProperties extends IdentifyProperty, IPagination {}

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

export type IConnectedProperty = Pick<
  IAdminBasicProperty,
  "name" | "slug" | "images"
>;

export const ConnectedProperty = new GraphQLObjectType<
  IConnectedProperty,
  Context
>({
  name: "ConnectedProperty",
  fields: {
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: c => c.name,
    },
    slug: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: c => c.slug,
    },
    images: {
      type: SchemaBuilder.nonNullArray(GradiumImage),
      resolve: c => c.images,
    },
  },
});

export const CreatePropertyArgs = {
  name: {
    type: SchemaBuilder.nonNull(GraphQLString),
  },
  address1: {
    type: SchemaBuilder.nonNull(GraphQLString),
  },
  address2: {
    type: SchemaBuilder.nonNull(GraphQLString),
  },
  city: {
    type: SchemaBuilder.nonNull(GraphQLString),
  },
  state: {
    type: SchemaBuilder.nonNull(GraphQLString),
  },
  zipCode: {
    type: SchemaBuilder.nonNull(GraphQLString),
  },
};
