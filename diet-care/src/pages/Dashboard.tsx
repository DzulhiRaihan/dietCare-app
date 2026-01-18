import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export const Dashboard = () => {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-emerald-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge className="border border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
              Overview
            </Badge>
            <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
              Track your progress at a glance.
            </h1>
            <p className="mt-2 text-base text-slate-300">
              Review your targets, streaks, and next steps for the week.
            </p>
          </div>
          <Button className="rounded-xl bg-emerald-400 text-emerald-950 hover:bg-emerald-300">
            Log today
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Calories remaining", value: "620 kcal", note: "Goal 1,800 kcal" },
            { title: "Hydration", value: "1.8 L", note: "65% of goal" },
            { title: "Workout streak", value: "4 days", note: "Keep it going" },
          ].map((stat) => (
            <Card key={stat.title} className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">{stat.title}</CardTitle>
                <CardDescription className="text-slate-300">{stat.note}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-emerald-200">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};
