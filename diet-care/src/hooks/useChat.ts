import { useState } from "react";

import type { ChatMessage } from "../types";
import { sendMessage } from "../services/chat.service";

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const submitMessage = async (message: string) => {
    setLoading(true);
    try {
      const response = await sendMessage({ message });
      setMessages(response.data.messages);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, submitMessage };
};
