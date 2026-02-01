import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/api-response.js";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return sendError(res, 401, "Unauthorized");
  }

  return next();
};
