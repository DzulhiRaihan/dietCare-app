import type { NextFunction, Request, Response } from "express";

export const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const method = req.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return next();
  }

  const csrfCookie = req.cookies?.csrf_token as string | undefined;
  const csrfHeader = req.header("x-csrf-token");

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  return next();
};
