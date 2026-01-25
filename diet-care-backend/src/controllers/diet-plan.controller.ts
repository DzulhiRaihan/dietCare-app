import type { NextFunction, Request, Response } from "express";
import { createDietPlan, getActiveDietPlan } from "../services/diet-plan.service.js";

export const createDietPlanController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { targetWeight } = req.body as { targetWeight?: number | null };
    const result = await createDietPlan(userId, { targetWeight });
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

export const getDietPlanController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await getActiveDietPlan(userId);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
