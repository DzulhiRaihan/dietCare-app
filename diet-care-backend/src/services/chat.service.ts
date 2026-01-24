import { ChatRole } from "@prisma/client";
import { HttpError } from "../utils/http-error.js";
import * as chatRepo from "../repositories/chat.repository.js";

export type CreateSessionResponse = {
  sessionId: string;
};

export type CreateMessagePayload = {
  sessionId: string;
  content: string;
};

const DUMMY_ASSISTANT_RESPONSE = "Thanks! I've saved your message. A diet consultant will reply soon.";

const assertSessionAccess = (session: { userId: string | null; isGuest: boolean }, userId?: string) => {
  if (session.userId) {
    if (!userId || session.userId !== userId) {
      throw new HttpError(403, "You do not have access to this session");
    }
    return;
  }

  if (!session.isGuest) {
    throw new HttpError(403, "You do not have access to this session");
  }
};

const ensureNonEmptyContent = (content: string) => {
  if (!content || content.trim().length === 0) {
    throw new HttpError(400, "Message content cannot be empty");
  }
};

export const createChatSession = async (userId?: string | null): Promise<CreateSessionResponse> => {
  const isGuest = !userId;
  const session = await chatRepo.createSession({
    userId: userId ?? null,
    isGuest,
  });

  return { sessionId: session.id };
};

export const createChatMessage = async (userId: string | undefined, payload: CreateMessagePayload) => {
  ensureNonEmptyContent(payload.content);

  const session = await chatRepo.findSessionById(payload.sessionId);
  if (!session) {
    throw new HttpError(404, "Session not found");
  }

  assertSessionAccess(session, userId);

  const userMessage = await chatRepo.createMessage({
    sessionId: session.id,
    role: ChatRole.USER,
    content: payload.content.trim(),
  });

  const assistantMessage = await chatRepo.createMessage({
    sessionId: session.id,
    role: ChatRole.ASSISTANT,
    content: DUMMY_ASSISTANT_RESPONSE,
  });

  return {
    userMessage,
    assistantMessage,
  };
};

export const getChatHistory = async (userId: string | undefined, sessionId: string) => {
  const session = await chatRepo.findSessionById(sessionId);
  if (!session) {
    throw new HttpError(404, "Session not found");
  }

  assertSessionAccess(session, userId);

  return chatRepo.listMessagesBySession(sessionId);
};
