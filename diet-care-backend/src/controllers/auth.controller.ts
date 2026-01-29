import type { Request, Response } from "express";
import { login, register, issueTokens, rotateRefreshToken, revokeRefreshToken } from "../services/auth.service.js";
import { clearAuthCookies, getRefreshTokenFromCookies, setAuthCookies, setCsrfCookie } from "../utils/auth-cookies.js";

export const registerController = async (req: Request, res: Response) => {
  const { email, password, name } = req.body as {
    email?: string;
    password?: string;
    name?: string;
  };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
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

    return res.status(201).json({ user: result.user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return res.status(400).json({ message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await login({ email, password });
    const tokens = await issueTokens({ id: result.user.id, email: result.user.email });
    setAuthCookies(res, tokens, tokens.refreshExpiresAt);
    setCsrfCookie(res);

    return res.status(200).json({ user: result.user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return res.status(401).json({ message });
  }
};

export const refreshController = async (req: Request, res: Response) => {
  const token = getRefreshTokenFromCookies(req);
  if (!token) {
    return res.status(401).json({ message: "Missing refresh token" });
  }

  try {
    const tokens = await rotateRefreshToken(token);
    setAuthCookies(res, tokens, tokens.refreshExpiresAt);
    setCsrfCookie(res);
    return res.status(200).json({ ok: true });
  } catch (error) {
    clearAuthCookies(res);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  const token = getRefreshTokenFromCookies(req);
  if (token) {
    await revokeRefreshToken(token);
  }
  clearAuthCookies(res);
  return res.status(200).json({ ok: true });
};

export const csrfController = (_req: Request, res: Response) => {
  const token = setCsrfCookie(res);
  return res.status(200).json({ csrfToken: token });
};

export const meController = (req: Request, res: Response) => {
  return res.status(200).json({ user: req.user });
};
