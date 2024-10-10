import type { Request, Response } from "express";
import type { Session as ISession, SessionData } from "express-session";

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

export type Session = ISession & Partial<SessionData>;
