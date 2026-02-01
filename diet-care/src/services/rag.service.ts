import api from "./api";
import type { ApiResponse } from "../types";

export type RagChatPayload = {
  sessionId: string;
  content: string;
  topK?: number;
  source?: string;
  language?: string;
  topic?: string;
  chapter?: string;
};

export type RagSource = {
  id: string;
  title: string | null;
  chapter: string | null;
  topic: string | null;
  language: string | null;
  source: string | null;
  score: number;
};

export type RagChatResponse = {
  userMessage: {
    id: string;
    sessionId: string;
    role: "USER";
    content: string;
    createdAt: string;
  };
  assistantMessage: {
    id: string;
    sessionId: string;
    role: "ASSISTANT";
    content: string;
    createdAt: string;
  };
  sources: RagSource[];
};

export const sendRagMessage = async (payload: RagChatPayload): Promise<RagChatResponse> => {
  const response = await api.post<ApiResponse<RagChatResponse>>("/rag/chat", payload);
  return response.data.data;
};
