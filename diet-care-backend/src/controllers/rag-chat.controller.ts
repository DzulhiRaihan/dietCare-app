import type { NextFunction, Request, Response } from "express";
import { createRagChatMessage } from "../services/rag-chat.service.js";
import { sendError, sendSuccess } from "../utils/api-response.js";

export const ragChatMessageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId, content, topK, source, language, topic, chapter } = req.body as {
      sessionId?: string;
      content?: string;
      topK?: number;
      source?: string;
      language?: string;
      topic?: string;
      chapter?: string;
    };

    if (!sessionId || !content) {
      return sendError(res, 400, "sessionId and content are required");
    }

    const result = await createRagChatMessage(req.user?.id, {
      sessionId,
      content,
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
