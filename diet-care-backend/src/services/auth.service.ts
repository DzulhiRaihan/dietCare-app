import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { userRepo } from "../repositories/index.js";

const SALT_ROUNDS = 10;

export type AuthUserResponse = {
  id: string;
  email: string;
  name?: string | null;
};

export type AuthResponse = {
  user: AuthUserResponse;
  token: string;
};

const signToken = (user: { id: string; email: string }) => {
  return jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, {
    subject: user.id,
    expiresIn: "7d",
  });
};

export const register = async (input: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthResponse> => {
  const existing = await userRepo.findUserByEmail(input.email);
  if (existing) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await userRepo.createUser({
    email: input.email,
    passwordHash,
    ...(input.name !== undefined ? { name: input.name } : {}),
  });

  const token = signToken(user);

  return {
    user: { id: user.id, email: user.email, name: user.name },
    token,
  };
};

export const login = async (input: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const user = await userRepo.findUserByEmail(input.email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const match = await bcrypt.compare(input.password, user.passwordHash);
  if (!match) {
    throw new Error("Invalid email or password");
  }

  const token = signToken(user);

  return {
    user: { id: user.id, email: user.email, name: user.name },
    token,
  };
};
