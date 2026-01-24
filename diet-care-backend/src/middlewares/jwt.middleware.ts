import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

type AppJwtPayload = JwtPayload & {
  sub?: string;
  id?: string;
  email?: string;
  role?: string;
};

const getTokenFromHeader = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
};

const attachUser = (req: Request, payload: AppJwtPayload) => {
  const userId = payload.sub ?? payload.id;
  if (!userId) {
    throw new Error("Invalid token payload");
  }

  req.user = {
    id: userId,
    payload,
    ...(payload.email !== undefined ? { email: payload.email } : {}),
    ...(payload.role !== undefined ? { role: payload.role } : {}),
  };
};

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({ message: "Missing Authorization token" });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AppJwtPayload;
    attachUser(req, payload);
    return next();
  } catch (error) {
    console.error("JWT verification failed", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const optionalJwtMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const token = getTokenFromHeader(req);
  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AppJwtPayload;
    attachUser(req, payload);
    return next();
  } catch (error) {
    console.error("JWT verification failed", error);
    return next();
  }
};
