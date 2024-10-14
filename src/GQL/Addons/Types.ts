import { GraphQLEnumType, GraphQLInt, GraphQLObjectType } from "graphql";
import type { PropertyAddonType as IPropertyAddonType } from "@prisma/client";
import type { IdentifyProperty } from "GQL/Property/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import type { Context, DBID } from "Types/GraphQL";

export interface IPropertyAddon extends DBID {
  type: IPropertyAddonType;
}

export interface IModifyAddons extends IdentifyProperty {
  deletions: number[];
  additions: IPropertyAddonType[];
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
      resolve: addon => addon.id,
    },
    type: {
      type: SchemaBuilder.nonNull(PropertyAddonType),
      resolve: addon => addon.type,
    },
  },
});
