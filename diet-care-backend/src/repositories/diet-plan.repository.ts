import type { DietPlan, Prisma } from "@prisma/client";
import { prisma } from "../database/prisma.js";

export const findActivePlanByUserId = (userId: string): Promise<DietPlan | null> => {
  return prisma.dietPlan.findFirst({
    where: { userId, isActive: true },
    orderBy: { createdAt: "desc" },
  });
};

export const deactivatePlansByUserId = (userId: string) => {
  return prisma.dietPlan.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  });
};

export const createPlan = (data: Prisma.DietPlanCreateInput): Promise<DietPlan> => {
  return prisma.dietPlan.create({ data });
};
