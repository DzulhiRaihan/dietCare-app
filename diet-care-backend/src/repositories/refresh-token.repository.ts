import type { RefreshToken } from "@prisma/client";
import { prisma } from "../database/prisma.js";

export const createRefreshToken = (data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}): Promise<RefreshToken> => {
  return prisma.refreshToken.create({ data });
};

export const findRefreshToken = (tokenHash: string): Promise<RefreshToken | null> => {
  return prisma.refreshToken.findUnique({ where: { tokenHash } });
};

export const revokeRefreshToken = (id: string, replacedById?: string | null) => {
  return prisma.refreshToken.update({
    where: { id },
    data: {
      revokedAt: new Date(),
      ...(replacedById ? { replacedById } : {}),
    },
  });
};
