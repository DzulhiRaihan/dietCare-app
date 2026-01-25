import api from "./api";
import type { ChatMessage, ChatSession, ChatMessagePayload, ChatMessageResponse } from "../types";

export const createSession = async (): Promise<ChatSession> => {
  const response = await api.post<ChatSession>("/chat/session");
  return response.data;
};

export const sendMessage = async (
  payload: ChatMessagePayload
): Promise<ChatMessageResponse> => {
  const response = await api.post<ChatMessageResponse>("/chat/message", payload);
  return response.data;
};

export const getHistory = async (sessionId: string): Promise<ChatMessage[]> => {
  const response = await api.get<{ sessionId: string; messages: ChatMessage[] }>(
    `/chat/history/${sessionId}`
  );
  return response.data.messages;
};
