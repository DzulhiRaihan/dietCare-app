import type { Request, Response } from "express";
import {
  login,
  register,
  issueTokens,
  rotateRefreshToken,
  guestLogin,
  logoutWithRefreshToken,
} from "../services/auth.service.js";
import { clearAuthCookies, getRefreshTokenFromCookies, setAuthCookies, setCsrfCookie } from "../utils/auth-cookies.js";
import { sendError, sendSuccess } from "../utils/api-response.js";

export const registerController = async (req: Request, res: Response) => {
  const { email, password, name } = req.body as {
    email?: string;
    password?: string;
    name?: string;
  };

  if (!email || !password) {
    return sendError(res, 400, "Email and password are required");
  }

  try {
    const result = await register({
      email,
      password,
      ...(name !== undefined ? { name } : {}),
    });

    const tokens = await issueTokens({ id: result.user.id, email: result.user.email });
    setAuthCookies(res, tokens, tokens.refreshExpiresAt);
    setCsrfCookie(res);

    return sendSuccess(res, 201, { user: result.user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return sendError(res, 400, message);
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return sendError(res, 400, "Email and password are required");
  }

  try {
    const result = await login({ email, password });
    const tokens = await issueTokens({ id: result.user.id, email: result.user.email });
    setAuthCookies(res, tokens, tokens.refreshExpiresAt);
    setCsrfCookie(res);

    return sendSuccess(res, 200, { user: result.user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return sendError(res, 401, message);
  }
};

export const guestLoginController = async (_req: Request, res: Response) => {
  try {
    const result = await guestLogin();
    const tokens = await issueTokens({ id: result.user.id, email: result.user.email });
    setAuthCookies(res, tokens, tokens.refreshExpiresAt);
    setCsrfCookie(res);
    return sendSuccess(res, 200, { user: result.user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Guest login failed";
    return sendError(res, 400, message);
  }
};

export const refreshController = async (req: Request, res: Response) => {
  const token = getRefreshTokenFromCookies(req);
  if (!token) {
    return sendError(res, 401, "Missing refresh token");
  }

  try {
    const tokens = await rotateRefreshToken(token);
    setAuthCookies(res, tokens, tokens.refreshExpiresAt);
    setCsrfCookie(res);
    return sendSuccess(res, 200, { ok: true });
  } catch (error) {
    clearAuthCookies(res);
    return sendError(res, 403, "Invalid refresh token");
  }
};

export const logoutController = async (req: Request, res: Response) => {
  const token = getRefreshTokenFromCookies(req);
  if (token) {
    await logoutWithRefreshToken(token);
  }
  clearAuthCookies(res);
  return sendSuccess(res, 200, { ok: true });
};

export const csrfController = (_req: Request, res: Response) => {
  const token = setCsrfCookie(res);
  return sendSuccess(res, 200, { csrfToken: token });
};

export const meController = (req: Request, res: Response) => {
  return sendSuccess(res, 200, { user: req.user });
};
