import type { AxiosResponse } from "axios";

import api from "./api";
import type { ChatMessage } from "../types";

type ChatPayload = {
  message: string;
};

type ChatResponse = {
  messages: ChatMessage[];
};

export const sendMessage = (
  payload: ChatPayload
): Promise<AxiosResponse<ChatResponse>> => api.post("/chat", payload);
