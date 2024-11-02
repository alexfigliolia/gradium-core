import type { Request, Response } from "express";
import type { Session as ISession, SessionData } from "express-session";
import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import type { PersonRole } from "@prisma/client";
import { SchemaBuilder } from "Tools/SchemaBuilder";

export interface Context {
  req: Request;
  res: Response;
}

export interface DBID {
  id: number;
}

export interface Identity extends DBID {
  name: string;
}

export interface IPagination {
  limit?: number;
  cursor?: number;
}

export type Session = ISession & Partial<SessionData>;

export interface IPermissedTransaction<F extends (...args: any[]) => any> {
  operation: F;
  session: Session;
  errorMessage?: string;
  organizationId: number;
  permissions?: PersonRole[];
}

export interface IPermissedPropertyTransaction<
  F extends (...args: any[]) => any,
> extends IPermissedTransaction<F> {
  propertyId: number;
}

export interface IEntitySnapshot extends DBID {
  name: string;
}

export const EntitySnapshot = new GraphQLObjectType<IEntitySnapshot, Context>({
  name: "EntitySnapShot",
  fields: {
    id: {
      type: SchemaBuilder.nonNull(GraphQLInt),
      resolve: v => v.id,
    },
    name: {
      type: SchemaBuilder.nonNull(GraphQLString),
      resolve: v => v.name,
    },
  },
});
