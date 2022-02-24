import { NextFunction, Response } from "express";
import R from "ramda";
import { Request } from "../express";

export function cleanUpReqBody(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  req.body = R.omit(["createdAt", "updatedAt"], req.body);
  next();
}
