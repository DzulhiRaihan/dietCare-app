import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error.js";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found", path: req.path });
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error("Unhandled error", err);
  return res.status(500).json({ message: "Internal Server Error" });
};
