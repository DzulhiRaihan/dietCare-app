import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { WeightChart } from "../components/charts/WeightChart";

export const DietPlan = () => {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-emerald-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14">
        <div className="space-y-3">
          <Badge className="w-fit border border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
            Diet plan
          </Badge>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">
            Your weekly plan, tailored to your goals.
          </h1>
          <p className="text-base text-slate-300">
            Stay aligned with your calorie targets and adjust meals as your routine changes.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Recommended meals</CardTitle>
              <CardDescription className="text-slate-300">
                Balanced suggestions based on your preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "Greek yogurt with berries and almonds",
                "Grilled chicken quinoa bowl",
                "Salmon with roasted vegetables",
              ].map((meal) => (
                <div key={meal} className="rounded-xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-200">
                  {meal}
                </div>
              ))}
              <Button className="rounded-xl bg-emerald-400 text-emerald-950 hover:bg-emerald-300">
                Update preferences
              </Button>
            </CardContent>
          </Card>
          <WeightChart />
        </div>
      </section>
    </main>
  );
};
