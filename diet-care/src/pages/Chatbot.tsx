import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bot, SendHorizontal } from "lucide-react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import type { ChatMessage, ChatRole } from "../types";
import { createSession, getHistory } from "../services/chat.service";
import { sendRagMessage } from "../services/rag.service";
import { useAuth } from "../hooks/useAuth";

const suggestedPrompts = [
  "What should I eat today?",
  "Why is my weight not decreasing?",
  "Can I change my dinner menu?",
  "Is my diet on track?",
];

const userContext = {
  calorieTarget: 1800,
  latestWeight: 74.2,
  status: "On Track" as const,
};

const statusTone: Record<typeof userContext.status, string> = {
  "On Track": "bg-emerald-400/15 text-emerald-100 border-emerald-400/30",
};

const formatRole = (role: ChatRole) => role.toLowerCase();

const renderFormattedText = (text: string) => {
  const lines = text.split("\n");
  return lines.map((line, lineIndex) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const content = parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={`${part}-${index}`} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={`${part}-${index}`}>{part}</span>;
    });

    return (
      <p key={`line-${lineIndex}`} className="min-h-[1.1em]">
        {content}
      </p>
    );
  });
};

const TypingDots = () => (
  <span className="inline-flex items-center gap-1">
    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-200 [animation-delay:-0.2s]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-200 [animation-delay:-0.1s]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-200" />
  </span>
);

const getSessionKey = (userId?: string | null) => {
  if (!userId) return "chat_session_id_guest";
  return `chat_session_id_${userId}`;
};

export const Chatbot = () => {
  const { user } = useAuth();
  const sessionKey = useMemo(() => getSessionKey(user?.id), [user?.id]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(() => localStorage.getItem(sessionKey));
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const emptyState = useMemo(() => messages.length === 0, [messages.length]);

  const loadHistory = async (activeSessionId: string) => {
    const history = await getHistory(activeSessionId);
    setMessages(history);
  };

  const ensureSession = async () => {
    if (sessionId) return sessionId;
    const session = await createSession();
    localStorage.setItem(sessionKey, session.sessionId);
    setSessionId(session.sessionId);
    return session.sessionId;
  };

  const startNewSession = async () => {
    setMessages([]);
    setError(null);
    const session = await createSession();
    localStorage.setItem(sessionKey, session.sessionId);
    setSessionId(session.sessionId);
    await loadHistory(session.sessionId);
  };

  useEffect(() => {
    const storedSession = localStorage.getItem(sessionKey);
    setSessionId(storedSession);
    setMessages([]);
  }, [sessionKey]);

  useEffect(() => {
    if (!sessionId) return;
    loadHistory(sessionId).catch(() => {
      setError("Unable to load history.");
    });
  }, [sessionId]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setIsTyping(true);
    setError(null);

    try {
      const activeSessionId = await ensureSession();
      const optimisticMessage: ChatMessage = {
        id: `local-${Date.now()}`,
        sessionId: activeSessionId,
        role: "USER",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMessage]);
      setInput("");

      const response = await sendRagMessage({
        sessionId: activeSessionId,
        content: trimmed,
        language: "id",
        source: "nutrition_book_id",
        topK: 5,
      });
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== optimisticMessage.id),
        response.userMessage,
        response.assistantMessage,
      ]);
    } catch (err) {
      setError("Unable to send message. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleLoadHistory = async () => {
    if (!sessionId) return;
    try {
      await loadHistory(sessionId);
    } catch (err) {
      setError("Unable to load history.");
    }
  };

  return (
    <section className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
        Diet Consultation Chatbot
      </p>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Diet Consultation Chatbot
          </h1>
          <p className="flex text-sm text-slate-300 md:text-base">
            Ask anything about your diet and nutrition.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="border-white/20 text-black hover:bg-white/70"
            onClick={startNewSession}
          >
            New conversation
          </Button>
          <Button
            variant="outline"
            className="border-white/20 text-black hover:bg-white/70"
            onClick={handleLoadHistory}
            disabled={!sessionId}
          >
            Load history
          </Button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <Card className="border-white/10 bg-slate-950/50 backdrop-blur xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Conversation</CardTitle>
            <CardDescription className="text-slate-300">
              Messages are private and synced to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-130 flex-col gap-5 overflow-hidden">
            <div className="flex min-h-0 flex-1 flex-col rounded-3xl border border-white/10 bg-slate-950/60 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
              {emptyState ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center text-slate-300">
                <div className="rounded-full border border-white/10 bg-white/5 p-4">
                  <Bot className="h-6 w-6 text-emerald-200" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">Start your first chat</p>
                  <p className="text-sm text-slate-300">
                    Ask anything about meals, calories, or nutrition goals.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedPrompts.map((prompt) => (
                    <Button
                      key={prompt}
                      variant="outline"
                      className="border-white/20 text-black hover:bg-white/70"
                      onClick={() => handleSend(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
                {isTyping && (
                  <div className="mt-4 flex w-full justify-start">
                    <div className="max-w-[70%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-100 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          assistant
                        </p>
                      </div>
                      <div className="mt-2">
                        <TypingDots />
                      </div>
                    </div>
                  </div>
                )}
                </div>
              ) : (
                <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-thin">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "USER" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl border px-4 py-3 text-sm shadow-sm text-justify ${
                        message.role === "USER"
                          ? "border-emerald-300/30 bg-emerald-400/20 text-emerald-50 shadow-[0_8px_24px_-16px_rgba(16,185,129,0.6)]"
                          : message.role === "ASSISTANT"
                          ? "border-white/10 bg-white/10 text-slate-100"
                          : "bg-slate-900/60 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          {formatRole(message.role)}
                        </p>
                      </div>
                      <div className="mt-2 space-y-1 wrap-break-word whitespace-pre-wrap leading-relaxed">
                        {renderFormattedText(message.content)}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[70%] rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          assistant
                        </p>
                      </div>
                      <div className="mt-2">
                        <TypingDots />
                      </div>
                    </div>
                  </div>
                )}
                </div>
              )}
            </div>

            <div className="space-y-3 border-t border-white/10 pt-4">
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    className="border-white/20 text-xs bg-emerald-400/15 text-white hover:bg-emerald-300/30"
                    onClick={() => handleSend(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Type your question here..."
                  disabled={isTyping}
                  className="border-white/10 bg-slate-950/40 text-white placeholder:text-slate-400"
                />
                <Button
                  className="rounded-xl bg-emerald-400 text-emerald-950 hover:bg-emerald-300"
                  disabled={isTyping || !input.trim()}
                  onClick={() => handleSend(input)}
                >
                  <SendHorizontal className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </div>
              {isTyping && <p className="text-xs text-slate-400">Assistant is typing...</p>}
              {error && <p className="text-xs text-rose-300">{error}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-white/10 bg-slate-950/40">
            <CardHeader>
              <CardTitle className="text-white">Your context</CardTitle>
              <CardDescription className="text-slate-300">
                Quick stats to guide the conversation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-200">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Daily calorie target
                </p>
                <p className="mt-2 text-lg font-semibold text-emerald-200">
                  {userContext.calorieTarget} kcal
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Latest weight
                </p>
                <p className="mt-2 text-lg font-semibold text-emerald-200">
                  {userContext.latestWeight} kg
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Diet status
                </p>
                <Badge className={`mt-2 border ${statusTone[userContext.status]}`}>
                  {userContext.status}
                </Badge>
              </div>
              <div className="grid gap-2">
                <Button asChild variant="outline" className="border-white/20 text-black hover:bg-white/70">
                  <Link to="/dashboard/diet-plan">View Diet Plan</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 text-black hover:bg-white/70">
                  <Link to="/dashboard/monitoring">View Progress</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-slate-950/40">
            <CardHeader>
              <CardTitle className="text-white">Medical disclaimer</CardTitle>
              <CardDescription className="text-slate-300">
                This chatbot does not replace professional medical advice.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};
