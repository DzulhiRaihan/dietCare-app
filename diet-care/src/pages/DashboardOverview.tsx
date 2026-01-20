import { Link } from "react-router-dom";
import { Activity, Flame, Goal, Scale, Sparkles } from "lucide-react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import type { JSX } from "react";

type DietStatus = "On Track" | "Off Track" | "Needs Adjustment";

type MetricCard = {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: JSX.Element;
};

type WeightTrendPoint = {
  day: string;
  value: number;
};

const overviewData = {
  name: "Raihan",
  status: "On Track" as DietStatus,
  currentWeight: 74.2,
  lastWeekChange: -0.6,
  targetWeight: 70,
  dailyCalories: 1480,
  calorieTarget: 1800,
  progressPercent: 62,
  consistencyPercent: 86,
  trend: [
    { day: "Mon", value: 75.0 },
    { day: "Tue", value: 74.8 },
    { day: "Wed", value: 74.7 },
    { day: "Thu", value: 74.6 },
    { day: "Fri", value: 74.4 },
    { day: "Sat", value: 74.3 },
    { day: "Sun", value: 74.2 },
  ] as WeightTrendPoint[],
};

const statusTone: Record<DietStatus, string> = {
  "On Track": "bg-emerald-400/15 text-emerald-100 border-emerald-400/30",
  "Off Track": "bg-rose-400/15 text-rose-100 border-rose-400/30",
  "Needs Adjustment": "bg-amber-400/15 text-amber-100 border-amber-400/30",
};

const metricCards: MetricCard[] = [
  {
    id: "current-weight",
    title: "Current Weight",
    value: `${overviewData.currentWeight} kg`,
    subtitle: `${overviewData.lastWeekChange >= 0 ? "+" : ""}${overviewData.lastWeekChange} kg vs last week`,
    icon: <Scale className="h-5 w-5 text-emerald-200" />,
  },
  {
    id: "target-weight",
    title: "Target Weight",
    value: `${overviewData.targetWeight} kg`,
    subtitle: `${(overviewData.currentWeight - overviewData.targetWeight).toFixed(1)} kg remaining`,
    icon: <Goal className="h-5 w-5 text-emerald-200" />,
  },
  {
    id: "today-calories",
    title: "Today's Calories",
    value: `${overviewData.dailyCalories} kcal`,
    subtitle: `${overviewData.dailyCalories} / ${overviewData.calorieTarget} kcal`,
    icon: <Flame className="h-5 w-5 text-emerald-200" />,
  },
  {
    id: "diet-progress",
    title: "Diet Progress",
    value: `${overviewData.progressPercent}%`,
    subtitle: "Progress toward goal",
    icon: <Activity className="h-5 w-5 text-emerald-200" />,
  },
  {
    id: "consistency",
    title: "Consistency",
    value: `${overviewData.consistencyPercent}%`,
    subtitle: "Days within target",
    icon: <Sparkles className="h-5 w-5 text-emerald-200" />,
  },
];

const getTrendPolyline = (points: WeightTrendPoint[]) => {
  const values = points.map((point) => point.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - ((point.value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");
};

export const DashboardOverview = () => {
  const trendLine = getTrendPolyline(overviewData.trend);

  return (
    <section className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
            Dashboard Overview
          </p>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white md:text-4xl flex">
            Welcome back, {overviewData.name} 👋
          </h1>
          <p className="text-sm text-slate-300 md:text-base">
            Here's your current diet status and recommended next steps.
          </p>
        </div>
        <Badge className={`border ${statusTone[overviewData.status]}`}>
          {overviewData.status}
        </Badge>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metricCards.map((metric) => (
          <Card key={metric.id} className="border-white/10 bg-slate-950/40">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-white">{metric.title}</CardTitle>
                <CardDescription className="text-slate-300">{metric.subtitle}</CardDescription>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-emerald-200">{metric.value}</p>
              {metric.id === "diet-progress" && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Goal progress</span>
                    <span>{overviewData.progressPercent}%</span>
                  </div>
                  <Progress
                    value={overviewData.progressPercent}
                    className="h-2 bg-white/10"
                    indicatorClassName="bg-emerald-400"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Today's Actions</CardTitle>
          <CardDescription className="text-slate-300">
            Complete these tasks to stay on track today.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 justify-center">
          <Button asChild className="rounded-xl bg-emerald-400 text-emerald-950 hover:bg-emerald-300">
            <Link to="/dashboard/monitoring">Log Today's Weight</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-white/20 text-black hover:bg-white/70">
            <Link to="/dashboard/diet-plan">Log Today's Meals</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-white/20 text-black hover:bg-white/70">
            <Link to="/dashboard/chatbot">Consult AI</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-slate-950/40">
          <CardHeader>
            <CardTitle className="text-white">Weight trend (7 days)</CardTitle>
            <CardDescription className="text-slate-300">
              Small progress adds up over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <svg viewBox="0 0 100 100" className="h-48 w-full">
                <polyline
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="3"
                  points={trendLine}
                />
                <circle cx="100" cy="20" r="4" fill="#34d399" />
              </svg>
              <div className="mt-3 flex justify-between text-xs text-slate-300">
                {overviewData.trend.map((point) => (
                  <span key={point.day}>{point.day}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Weekly change</span>
              <span className="text-emerald-200">-0.8 kg</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-950/40">
          <CardHeader>
            <CardTitle className="text-white">AI insight</CardTitle>
            <CardDescription className="text-slate-300">
              Guidance based on recent trends.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              You're doing great! Keep maintaining your calorie target.
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              Try to stay consistent on weekends to keep the momentum.
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
