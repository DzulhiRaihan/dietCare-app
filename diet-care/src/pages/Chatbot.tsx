import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";

const sampleMessages = [
  { role: "assistant", content: "Hi! How can I help with your diet today?" },
  { role: "user", content: "I need a quick high-protein breakfast idea." },
];

export const Chatbot = () => {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-emerald-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge className="border border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
              DietCare Assistant
            </Badge>
            <h1 className="mt-4 text-4xl font-semibold text-white">Chat with your nutrition guide</h1>
            <p className="mt-2 text-base text-slate-300">
              Ask anything about meals, macros, or progress adjustments.
            </p>
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            New conversation
          </Button>
        </div>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Conversation</CardTitle>
            <CardDescription className="text-slate-300">
              Messages are synced to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sampleMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-2xl px-4 py-3 text-sm ${
                  message.role === "assistant"
                    ? "bg-white/10 text-slate-100"
                    : "bg-emerald-500/20 text-emerald-100"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                  {message.role}
                </p>
                <p className="mt-2">{message.content}</p>
              </div>
            ))}
            <div className="space-y-3">
              <Textarea
                placeholder="Type your question here..."
                className="min-h-[120px] border-white/10 bg-slate-950/40 text-white placeholder:text-slate-400"
              />
              <div className="flex justify-end">
                <Button className="rounded-xl bg-emerald-400 text-emerald-950 hover:bg-emerald-300">
                  Send message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};
