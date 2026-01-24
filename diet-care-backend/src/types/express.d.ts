import "express";
import type { JwtPayload } from "jsonwebtoken";

export type AuthUser = {
  id: string;
  email?: string;
  role?: string;
  payload: JwtPayload;
};

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}
