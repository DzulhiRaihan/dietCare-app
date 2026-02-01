import type { NextFunction, Request, Response } from "express";
import { createRecommendation } from "../services/recommendation.service.js";
import { sendError, sendSuccess } from "../utils/api-response.js";

export const createRecommendationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, 401, "Unauthorized");
    }

    const { query, topK, source, language, topic, chapter } = req.body as {
      query?: string;
      topK?: number;
      source?: string;
      language?: string;
      topic?: string;
      chapter?: string;
    };

    const result = await createRecommendation(userId, {
      query: query ?? "",
      topK,
      source,
      language,
      topic,
      chapter,
    });

    return sendSuccess(res, 200, result);
  } catch (error) {
    return next(error);
  }
};
