import type { Request, Response } from "express";
import type { Session as ISession, SessionData } from "express-session";
import { GraphQLInt } from "graphql";
import type { PersonRole } from "@prisma/client";

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

export interface PersonIdentifier extends Identity {
  email: string;
}

export interface IPagination {
  limit?: number;
  cursor?: number;
}

export interface IPaginationResult<T> {
  cursor?: number;
  list: T[];
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

export const PaginationArgs = {
  limit: {
    type: GraphQLInt,
  },
  cursor: {
    type: GraphQLInt,
  },
};
