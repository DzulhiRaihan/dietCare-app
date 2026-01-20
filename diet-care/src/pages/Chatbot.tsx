import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bot, SendHorizontal } from "lucide-react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";

type MessageRole = "user" | "assistant" | "system";

type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  time?: string;
};

type UserContext = {
  calorieTarget: number;
  latestWeight: number;
  status: "On Track" | "Off Track" | "Needs Adjustment";
};

const initialMessages: ChatMessage[] = [
  {
    id: "system-1",
    role: "system",
    content: "Tip: Ask about meal swaps, calorie targets, or macro balance.",
    time: "08:30",
  },
  {
    id: "assistant-1",
    role: "assistant",
    content: "Hi Alex! How can I help with your diet today?",
    time: "08:31",
  },
  {
    id: "user-1",
    role: "user",
    content: "Is my diet on track this week?",
    time: "08:31",
  },
  {
    id: "assistant-2",
    role: "assistant",
    content: "You are doing well. You are within 5% of your calorie target on most days.",
    time: "08:32",
  },
];

const suggestedPrompts = [
  "What should I eat today?",
  "Why is my weight not decreasing?",
  "Can I change my dinner menu?",
  "Is my diet on track?",
];

const assistantReplies = [
  "Based on your recent logs, try adding a protein-rich snack in the afternoon.",
  "A small calorie deficit with consistent sleep helps improve progress.",
  "You can swap dinner with a lighter option and keep your protein stable.",
  "You're mostly on track. Focus on hydration and weekend consistency.",
];

const userContext: UserContext = {
  calorieTarget: 1800,
  latestWeight: 74.2,
  status: "On Track",
};

const statusTone: Record<UserContext["status"], string> = {
  "On Track": "bg-emerald-400/15 text-emerald-100 border-emerald-400/30",
  "Off Track": "bg-rose-400/15 text-rose-100 border-rose-400/30",
  "Needs Adjustment": "bg-amber-400/15 text-amber-100 border-amber-400/30",
};

export const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const emptyState = useMemo(() => messages.length === 0, [messages.length]);

  const pushAssistantReply = (content: string) => {
    const reply: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, reply]);
  };

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const message: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, message]);
    setInput("");
    setIsTyping(true);

    const reply = assistantReplies[Math.floor(Math.random() * assistantReplies.length)];
    window.setTimeout(() => {
      pushAssistantReply(reply);
      setIsTyping(false);
    }, 900);
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
          <p className="text-sm text-slate-300 md:text-base flex">
            Ask anything about your diet and nutrition.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-white/20 text-black hover:bg-white/70"
          onClick={() => setMessages([])}
        >
          New conversation
        </Button>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <Card className="border-white/10 bg-slate-950/40 xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Conversation</CardTitle>
            <CardDescription className="text-slate-300">
              Messages are private and synced to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-130 flex-col gap-4">
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
              </div>
            ) : (
              <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-thin">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        message.role === "user"
                          ? "bg-emerald-400/20 text-emerald-100"
                          : message.role === "assistant"
                          ? "bg-white/10 text-slate-100"
                          : "bg-slate-900/60 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          {message.role}
                        </p>
                        {message.time && (
                          <span className="text-[10px] text-slate-400">{message.time}</span>
                        )}
                      </div>
                      <p className="mt-2 leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3 border-t border-white/10 pt-4">
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    className="border-white/20 text-xs bg-emerald-400/20 text-white hover:bg-emerald-300"
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
              {isTyping && <p className="text-xs text-slate-400">AI is typing...</p>}
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
