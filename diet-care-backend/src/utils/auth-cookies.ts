import type { CookieOptions, Request, Response } from "express";
import { env } from "../config/env.js";
import { generateCsrfToken } from "../utils/token-utils.js";

const cookieBaseOptions: CookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: "lax",
  path: "/",
};

export const setAuthCookies = (
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
  refreshExpiresAt: Date
) => {
  res.cookie("access_token", tokens.accessToken, {
    ...cookieBaseOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresh_token", tokens.refreshToken, {
    ...cookieBaseOptions,
    maxAge: refreshExpiresAt.getTime() - Date.now(),
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("access_token", { ...cookieBaseOptions, maxAge: 0 });
  res.clearCookie("refresh_token", { ...cookieBaseOptions, maxAge: 0 });
};

export const setCsrfCookie = (res: Response) => {
  const token = generateCsrfToken();
  res.cookie("csrf_token", token, {
    httpOnly: false,
    secure: env.cookieSecure,
    sameSite: "lax",
    path: "/",
  });
  return token;
};

export const getRefreshTokenFromCookies = (req: Request) => {
  return req.cookies?.refresh_token as string | undefined;
};
