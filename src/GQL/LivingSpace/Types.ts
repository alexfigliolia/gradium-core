import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import type {
  LeaseStatus,
  LivingSpaceType as ILivingSpaceType,
} from "@prisma/client";
import type { ILeaseSnapShot } from "GQL/Leases/Types";
import { LeaseSnapShotType } from "GQL/Leases/Types";
import { GradiumImage, type IGradiumImage } from "GQL/Media/Types";
import type { IOrganizationID } from "GQL/Organization/Types";
import type { IdentifyProperty } from "GQL/Property/Types";
import { SchemaBuilder } from "Tools/SchemaBuilder";
import { type Context, type IPagination, PaginationArgs } from "Types/GraphQL";

export interface ILivingSpace {
  id: number;
  name: string;
  type: ILivingSpaceType;
  beds: number;
  baths: number;
  size: string;
  propertyId: number;
  images: IGradiumImage[];
  floorPlans: IGradiumImage[];
}

export interface IRentableSpace extends ILivingSpace {
  propertyName: string;
}

export interface IAvailableRentableSpace extends IRentableSpace {
  availableSince: string;
}

export interface IAvailableSoonRentableSpace extends IRentableSpace {
  availableOn: string;
  lease: ILeaseSnapShot;
}

export interface IUpdateLivingSpace extends IdentifyProperty {
  id?: number;
  name: string;
  type: ILivingSpaceType;
  beds: number;
  baths: number;
  size: string;
}

export interface IDeleteLivingSpace extends IdentifyProperty {
  id: number;
}

export interface IFetchAvailableSpaces extends IPagination, IOrganizationID {
  search?: string;
}

export interface IRawRentableSpace extends ILivingSpace {
  property: {
    name: string;
    _count: { livingSpaces: number };
  };
}

export interface IRawAvailableRentableSpace extends IRawRentableSpace {
  createdAt: Date;
  leases: {
    end: Date;
    terminatedDate: Date | null;
  }[];
}

export interface IRawAvailableSoonRentableSpace extends IRawRentableSpace {
  leases: {
    end: Date;
    start: Date;
    status: LeaseStatus;
  }[];
}

export const LivingSpaceType = new GraphQLEnumType({
  name: "LivingSpaceType",
  values: {
    unit: {
      value: "unit",
    },
    dwelling: {
      value: "dwelling",
    },
  },
});

export const LivingSpace = new GraphQLObjectType<ILivingSpace, Context>({
  name: "LivingSpace",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: space => space.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: space => space.name,
    },
    type: {
      type: SchemaBuilder.nonNull(LivingSpaceType),
      resolve: space => space.type,
    },
    beds: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: space => space.beds,
    },
    baths: {
      type: SchemaBuilder.nonNull(GraphQLFloat),
      resolve: space => space.baths,
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

export const RentableSpace = new GraphQLObjectType<IRentableSpace, Context>({
  name: "RentableSpace",
  fields: {
    ...LivingSpace.toConfig().fields,
    propertyName: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: space => space.propertyName,
    },
  },
});

export const AvailableRentableSpace = new GraphQLObjectType<
  IAvailableRentableSpace,
  Context
>({
  name: "AvailableRentableSpace",
  fields: {
    ...RentableSpace.toConfig().fields,
    availableSince: {
      type: SchemaBuilder.nonNull(GraphQLDateTime),
      resolve: space => space.availableSince,
    },
  },
});

export const AvailableSoonRentableSpace = new GraphQLObjectType<
  IAvailableSoonRentableSpace,
  Context
>({
  name: "AvailableSoonRentableSpace",
  fields: {
    ...RentableSpace.toConfig().fields,
    availableOn: {
      type: SchemaBuilder.nonNull(GraphQLDateTime),
      resolve: space => space.availableOn,
    },
    lease: {
      type: SchemaBuilder.nonNull(LeaseSnapShotType),
      resolve: space => space.lease,
    },
  },
});

export const PaginatedAvailableLivingSpaces =
  SchemaBuilder.paginatedType<IAvailableRentableSpace>(
    "PaginatedAvailableLivingSpaces",
    AvailableRentableSpace,
  );

export const PaginatedAvailableSoonLivingSpaces =
  SchemaBuilder.paginatedType<IAvailableSoonRentableSpace>(
    "PaginatedAvailableSoonLivingSpaces",
    AvailableSoonRentableSpace,
  );

export const AvailableSpacesArgs = {
  organizationId: {
    type: SchemaBuilder.nonNull(GraphQLInt),
  },
  search: {
    type: GraphQLString,
  },
  ...PaginationArgs,
};
