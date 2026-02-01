import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error.js";
import { sendError } from "../utils/api-response.js";

export const notFound = (req: Request, res: Response) => {
  return sendError(res, 404, "Not Found", null);
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return sendError(res, err.status, err.message, null);
  }

  console.error("Unhandled error", err);
  return sendError(res, 500, "Internal Server Error", null);
};
