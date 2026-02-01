import type { Prisma, Recommendation } from "@prisma/client";
import { prisma } from "../database/prisma.js";

export const createRecommendation = (data: Prisma.RecommendationCreateInput): Promise<Recommendation> => {
  return prisma.recommendation.create({ data });
};

export const listRecommendationsByUser = (userId: string, limit = 10) => {
  return prisma.recommendation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
};
