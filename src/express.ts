import * as express from "express";
import * as core from "express-serve-static-core";
import { StringRecordUnknown } from "./types";
import { Response, NextFunction } from "express";

export interface Request<
  B = StringRecordUnknown,
  P extends core.ParamsDictionary = core.ParamsDictionary,
  Q extends core.Query = core.Query
> extends express.Request {
  body: B;
  query: Q;
  params: P;
  status?: "Success" | "Validated" | "Failed";
}

export function wrapAsyncHandler<T>(
  fn: (req: Request<T>, res: Response, next?: NextFunction) => Promise<unknown>
): (req: Request<T>, res: Response, next: NextFunction) => Promise<unknown> {
  return function (req: Request<T>, res: Response, next: NextFunction) {
    return fn(req, res, next).catch(next);
  };
}
