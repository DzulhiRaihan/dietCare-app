import type { ChatMessage, ChatSession, ChatRole } from "@prisma/client";
import { prisma } from "../database/prisma.js";

export const createSession = (data: {
  userId?: string | null;
  isGuest: boolean;
}): Promise<ChatSession> => {
  return prisma.chatSession.create({
    data: {
      userId: data.userId ?? null,
      isGuest: data.isGuest,
    },
  });
};

export const findSessionById = (sessionId: string): Promise<ChatSession | null> => {
  return prisma.chatSession.findUnique({ where: { id: sessionId } });
};

export const createMessage = (data: {
  sessionId: string;
  role: ChatRole;
  content: string;
}): Promise<ChatMessage> => {
  return prisma.chatMessage.create({
    data: {
      sessionId: data.sessionId,
      role: data.role,
      content: data.content,
    },
  });
};

export const listMessagesBySession = (sessionId: string): Promise<ChatMessage[]> => {
  return prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  });
};
