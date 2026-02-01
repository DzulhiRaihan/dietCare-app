import type { NextFunction, Request, Response } from "express";
import { searchNutrition } from "../services/rag.service.js";
import { sendError, sendSuccess } from "../utils/api-response.js";

export const searchNutritionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { query, topK, source, language, topic, chapter } = req.body as {
      query?: string;
      topK?: number;
      source?: string;
      language?: string;
      topic?: string;
      chapter?: string;
    };
    if (!query) {
      return sendError(res, 400, "Query is required");
    }

    const result = await searchNutrition(query, topK ?? 5, {
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

export const searchNutritionQueryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q, topK, source, language, topic, chapter } = req.query as {
      q?: string;
      topK?: string;
      source?: string;
      language?: string;
      topic?: string;
      chapter?: string;
    };
    if (!q) {
      return sendError(res, 400, "Query is required");
    }

    const parsedTopK = topK ? Number.parseInt(topK, 10) : undefined;
    const result = await searchNutrition(q, parsedTopK ?? 5, {
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
