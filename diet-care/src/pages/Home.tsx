import { Link } from "react-router-dom";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";

export const Home = () => {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-emerald-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14">
        <div className="space-y-4">
          <Badge className="w-fit border border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
            Personalized nutrition
          </Badge>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">
            Your DietCare journey starts with small, consistent wins.
          </h1>
          <p className="text-base text-slate-300 md:text-lg">
            Explore your dashboard, update your diet plan, and chat with your assistant whenever you need clarity.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-xl bg-emerald-400 text-emerald-950 hover:bg-emerald-300">
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10">
              <Link to="/diet-plan">View diet plan</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Track daily nutrition",
              description: "Log meals and stay aligned with your calories and macros.",
            },
            {
              title: "Smart recommendations",
              description: "Get adaptive suggestions based on your progress and goals.",
            },
            {
              title: "Chat assistant",
              description: "Ask questions and get guidance any time you need it.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">{item.title}</CardTitle>
                <CardDescription className="text-slate-300">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="link" className="h-auto p-0 text-emerald-200">
                  Learn more
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};
