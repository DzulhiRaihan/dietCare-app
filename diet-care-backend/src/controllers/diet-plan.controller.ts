import type { NextFunction, Request, Response } from "express";
import { createDietPlan, getActiveDietPlan } from "../services/diet-plan.service.js";
import { sendError, sendSuccess } from "../utils/api-response.js";

export const createDietPlanController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, 401, "Unauthorized");
    }

    const result = await createDietPlan(userId);
    return sendSuccess(res, 201, result);
  } catch (error) {
    return next(error);
  }
};

export const getDietPlanController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, 401, "Unauthorized");
    }

    const result = await getActiveDietPlan(userId);
    return sendSuccess(res, 200, result);
  } catch (error) {
    return next(error);
  }
};
