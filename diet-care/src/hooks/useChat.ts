import { useState } from "react";

import type { ChatMessage } from "../types";
import { createSession, getHistory, sendMessage } from "../services/chat.service";

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(
    () => localStorage.getItem("chat_session_id")
  );

  const ensureSession = async () => {
    if (sessionId) return sessionId;
    const session = await createSession();
    localStorage.setItem("chat_session_id", session.sessionId);
    setSessionId(session.sessionId);
    return session.sessionId;
  };

  const loadHistory = async () => {
    if (!sessionId) return [];
    const history = await getHistory(sessionId);
    setMessages(history);
    return history;
  };

  const submitMessage = async (content: string) => {
    setLoading(true);
    try {
      const activeSessionId = await ensureSession();
      const response = await sendMessage({ sessionId: activeSessionId, content });
      setMessages((prev) => [...prev, response.userMessage, response.assistantMessage]);
      return response;
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, submitMessage, loadHistory, sessionId };
};
