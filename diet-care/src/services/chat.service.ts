import api from "./api";
import type { ApiResponse, ChatMessage, ChatSession, ChatMessagePayload, ChatMessageResponse } from "../types";

export const createSession = async (): Promise<ChatSession> => {
  const response = await api.post<ApiResponse<ChatSession>>("/chat/session", {});
  return response.data.data;
};

export const sendMessage = async (
  payload: ChatMessagePayload
): Promise<ChatMessageResponse> => {
  const response = await api.post<ApiResponse<ChatMessageResponse>>("/chat/message", payload);
  return response.data.data;
};

export const getHistory = async (sessionId: string): Promise<ChatMessage[]> => {
  const response = await api.get<ApiResponse<{ sessionId: string; messages: ChatMessage[] }>>(
    `/chat/history/${sessionId}`
  );
  return response.data.data.messages;
};
