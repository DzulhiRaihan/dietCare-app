import jwt, { type SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import { userRepo } from "../repositories/index.js";
import * as refreshRepo from "../repositories/refresh-token.repository.js";
import { generateToken, hashToken } from "../utils/token-utils.js";
import { HttpError } from "../utils/http-error.js";

const SALT_ROUNDS = 10;

export type AuthUserResponse = {
  id: string;
  email: string;
  name?: string | null;
  isGuest?: boolean;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  refreshTokenId: string;
  refreshExpiresAt: Date;
};

const signAccessToken = (user: { id: string; email: string }) => {
  const expiresIn: SignOptions["expiresIn"] = parseInt(env.accessTokenTtl, 10);
  const options: SignOptions = {
    subject: user.id,
    expiresIn,
  };

  return jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, options);
};

const createRefreshToken = async (userId: string): Promise<AuthTokens> => {
  const refreshToken = generateToken();
  const refreshTokenHash = hashToken(refreshToken);
  const refreshExpiresAt = new Date(
    Date.now() + env.refreshTokenTtlDays * 24 * 60 * 60 * 1000
  );

  const record = await refreshRepo.createRefreshToken({
    userId,
    tokenHash: refreshTokenHash,
    expiresAt: refreshExpiresAt,
  });

  return {
    accessToken: "",
    refreshToken,
    refreshTokenId: record.id,
    refreshExpiresAt,
  };
};

export const issueTokens = async (user: { id: string; email: string }) => {
  const accessToken = signAccessToken(user);
  const refresh = await createRefreshToken(user.id);

  return {
    accessToken,
    refreshToken: refresh.refreshToken,
    refreshTokenId: refresh.refreshTokenId,
    refreshExpiresAt: refresh.refreshExpiresAt,
  };
};

export const rotateRefreshToken = async (refreshToken: string) => {
  const refreshTokenHash = hashToken(refreshToken);
  const record = await refreshRepo.findRefreshToken(refreshTokenHash);

  if (!record || record.revokedAt) {
    throw new HttpError(403, "Invalid refresh token");
  }

  if (record.expiresAt.getTime() < Date.now()) {
    throw new HttpError(403, "Refresh token expired");
  }

  const user = await userRepo.findUserById(record.userId);
  if (!user) {
    throw new HttpError(403, "Invalid refresh token");
  }

  const accessToken = signAccessToken({ id: user.id, email: user.email });
  const newRefresh = await createRefreshToken(record.userId);

  await refreshRepo.revokeRefreshToken(record.id, newRefresh.refreshTokenId);

  return {
    accessToken,
    refreshToken: newRefresh.refreshToken,
    refreshTokenId: newRefresh.refreshTokenId,
    refreshExpiresAt: newRefresh.refreshExpiresAt,
  };
};

export const revokeRefreshToken = async (refreshToken: string) => {
  const refreshTokenHash = hashToken(refreshToken);
  const record = await refreshRepo.findRefreshToken(refreshTokenHash);
  if (!record || record.revokedAt) return;
  await refreshRepo.revokeRefreshToken(record.id, null);
};

export const register = async (input: {
  email: string;
  password: string;
  name?: string;
}) => {
  const existing = await userRepo.findUserByEmail(input.email);
  if (existing) {
    throw new HttpError(400, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await userRepo.createUser({
    email: input.email,
    passwordHash,
    ...(input.name !== undefined ? { name: input.name } : {}),
  });

  return { user: { id: user.id, email: user.email, name: user.name } };
};

export const login = async (input: { email: string; password: string }) => {
  const user = await userRepo.findUserByEmail(input.email);
  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const match = await bcrypt.compare(input.password, user.passwordHash);
  if (!match) {
    throw new HttpError(401, "Invalid email or password");
  }

  return { user: { id: user.id, email: user.email, name: user.name } };
};

export const guestLogin = async () => {
  const token = generateToken();
  const email = `guest_${token.slice(0, 12)}@guest.local`;
  const passwordHash = await bcrypt.hash(generateToken(), SALT_ROUNDS);
  const user = await userRepo.createUser({
    email,
    passwordHash,
    name: "Guest",
    isGuest: true,
  });

  return { user: { id: user.id, email: user.email, name: user.name, isGuest: true } };
};

export const logoutWithRefreshToken = async (refreshToken: string) => {
  const refreshTokenHash = hashToken(refreshToken);
  const record = await refreshRepo.findRefreshToken(refreshTokenHash);
  if (!record || record.revokedAt) return;

  const user = await userRepo.findUserById(record.userId);
  if (user?.isGuest) {
    await userRepo.deleteUserById(user.id);
    return;
  }

  await refreshRepo.revokeRefreshToken(record.id, null);
};
