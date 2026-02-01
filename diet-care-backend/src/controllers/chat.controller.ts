import type { NextFunction, Request, Response } from "express";
import { createChatMessage, createChatSession, getChatHistory } from "../services/chat.service.js";
import type { CreateMessagePayload } from "../services/chat.service.js";
import { sendSuccess } from "../utils/api-response.js";

export const createSessionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await createChatSession(req.user?.id ?? null);
    return sendSuccess(res, 201, session);
  } catch (error) {
    return next(error);
  }
};

export const createMessageController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body as CreateMessagePayload;
    const result = await createChatMessage(req.user?.id, payload);
    return sendSuccess(res, 200, result);
  } catch (error) {
    return next(error);
  }
};

export const getHistoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params as { sessionId: string };
    const messages = await getChatHistory(req.user?.id, sessionId);
    return sendSuccess(res, 200, { sessionId, messages });
  } catch (error) {
    return next(error);
  }
};
