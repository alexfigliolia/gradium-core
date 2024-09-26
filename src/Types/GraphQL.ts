import type { Request, Response } from "express";

export interface Context {
  req: Request;
  res: Response;
}
