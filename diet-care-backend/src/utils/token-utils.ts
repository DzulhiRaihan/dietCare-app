import crypto from "crypto";

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const generateToken = () => crypto.randomBytes(48).toString("hex");

export const generateCsrfToken = () => crypto.randomBytes(32).toString("hex");
