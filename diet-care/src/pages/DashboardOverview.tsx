import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { WeightChart } from "../components/charts/WeightChart";

export const DashboardOverview = () => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-1">
          {[
            { title: "Calories remaining", value: "620 kcal", note: "Goal 1,800 kcal" },
            { title: "Hydration", value: "1.8 L", note: "65% of goal" },
            { title: "Workout streak", value: "4 days", note: "Keep it going" },
          ].map((stat) => (
            <Card key={stat.title} className="border-white/10 bg-slate-950/40">
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
        <WeightChart />
      </div>
    </div>
  );
};
