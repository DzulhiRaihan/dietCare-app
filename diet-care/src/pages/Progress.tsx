import { useMemo, useState } from "react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";

type WeightPoint = {
  date: string;
  weight: number;
};

type CaloriePoint = {
  date: string;
  intake: number;
  target: number;
};

const weightData: WeightPoint[] = [
  { date: "Aug 01", weight: 75.2 },
  { date: "Aug 03", weight: 75.0 },
  { date: "Aug 05", weight: 74.8 },
  { date: "Aug 07", weight: 74.9 },
  { date: "Aug 09", weight: 74.6 },
  { date: "Aug 11", weight: 74.4 },
  { date: "Aug 13", weight: 74.2 },
];

const calorieData: CaloriePoint[] = [
  { date: "Aug 07", intake: 1780, target: 1800 },
  { date: "Aug 08", intake: 1900, target: 1800 },
  { date: "Aug 09", intake: 1650, target: 1800 },
  { date: "Aug 10", intake: 1720, target: 1800 },
  { date: "Aug 11", intake: 1850, target: 1800 },
  { date: "Aug 12", intake: 1760, target: 1800 },
  { date: "Aug 13", intake: 1680, target: 1800 },
];

const summary = {
  currentWeight: 74.2,
  targetWeight: 70,
  averageCalories: 1765,
  durationDays: 42,
};

const filterOptions = ["7 days", "30 days", "All time"] as const;

const getCalorieStatus = (intake: number, target: number) => {
  if (intake > target + 100) return { label: "Over", tone: "text-rose-300" };
  if (intake < target - 100) return { label: "Under", tone: "text-amber-300" };
  return { label: "On Track", tone: "text-emerald-300" };
};

const getWeightLine = (points: WeightPoint[]) => {
  const weights = points.map((point) => point.weight);
  const max = Math.max(...weights);
  const min = Math.min(...weights);
  const range = max - min || 1;

  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - ((point.weight - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");
};

export const ProgressPage = () => {
  const [filter, setFilter] = useState<(typeof filterOptions)[number]>("7 days");

  const weightLine = useMemo(() => getWeightLine(weightData), []);
  const calorieAverage = useMemo(
    () => Math.round(calorieData.reduce((sum, item) => sum + item.intake, 0) / calorieData.length),
    []
  );

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
          Diet Progress Monitoring
        </p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          Diet Progress Monitoring
        </h1>
        <p className="text-sm text-slate-300 md:text-base">
          Track your weight, calories, and diet consistency.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Current Weight", value: `${summary.currentWeight} kg`, note: "Latest check-in" },
          { label: "Target Weight", value: `${summary.targetWeight} kg`, note: "Goal" },
          { label: "Average Calories", value: `${summary.averageCalories} kcal`, note: "Last 7 days" },
          { label: "Diet Duration", value: `${summary.durationDays} days`, note: "Active plan" },
        ].map((item) => (
          <Card key={item.label} className="border-white/10 bg-slate-950/40">
            <CardHeader>
              <CardTitle className="text-white">{item.label}</CardTitle>
              <CardDescription className="text-slate-300">{item.note}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-emerald-200">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-slate-950/40">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-white flex">Weight progress</CardTitle>
              <CardDescription className="text-slate-300">
                Weight changes over time.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <Button
                  key={option}
                  variant={filter === option ? "default" : "outline"}
                  className={
                    filter === option
                      ? "bg-emerald-400 text-emerald-950 hover:bg-emerald-300"
                      : "border-white/20 text-black hover:bg-white/70"
                  }
                  onClick={() => setFilter(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <svg viewBox="0 0 100 100" className="h-48 w-full">
              <polyline
                fill="none"
                stroke="#34d399"
                strokeWidth="3"
                points={weightLine}
              />
              <circle cx="100" cy="20" r="4" fill="#34d399" />
            </svg>
            <div className="mt-3 flex justify-between text-xs text-slate-300">
              {weightData.map((point) => (
                <span key={point.date}>{point.date}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Current trend</span>
            <Badge className="border border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
              -1.0 kg in 2 weeks
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-slate-950/40">
        <CardHeader>
          <CardTitle className="text-white">Calorie intake</CardTitle>
          <CardDescription className="text-slate-300">
            Daily intake compared to your target.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {calorieData.map((entry) => {
              const status = getCalorieStatus(entry.intake, entry.target);
              const percent = Math.min(100, Math.round((entry.intake / entry.target) * 100));
              return (
                <div key={entry.date} className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>{entry.date}</span>
                    <span className={status.tone}>
                      {entry.intake} kcal ({status.label})
                    </span>
                  </div>
                  <Progress value={percent} className="h-2 bg-white/10" indicatorClassName="bg-emerald-400" />
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Average intake</span>
            <span className="text-emerald-200">{calorieAverage} kcal</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-slate-950/40">
        <CardHeader>
          <CardTitle className="text-white">Daily input</CardTitle>
          <CardDescription className="text-slate-300">
            Add today&apos;s weight and calories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-emerald-400 text-emerald-950 hover:bg-emerald-300">
                Add Daily Data
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-950">
              <DialogHeader>
                <DialogTitle>Add daily data</DialogTitle>
                <DialogDescription>
                  Enter today&apos;s weight and calorie intake.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2 text-slate-200">
                  <label className="text-sm">Weight (kg)</label>
                  <Input type="number" min={30} className="border-white/10 bg-slate-950/40 text-white" />
                </div>
                <div className="space-y-2 text-slate-200">
                  <label className="text-sm">Calories</label>
                  <Input type="number" min={0} className="border-white/10 bg-slate-950/40 text-white" />
                </div>
              </div>
              <DialogFooter className="pt-5">
                <DialogClose asChild>
                  <Button variant="outline" className="border-white/20 text-white bg-red-500 hover:bg-red-500/70">
                    Cancel
                  </Button>
                </DialogClose>
                <Button className="bg-emerald-400 text-emerald-950 hover:bg-emerald-300">
                  Save data
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-slate-950/40">
        <CardHeader>
          <CardTitle className="text-white">AI insights</CardTitle>
          <CardDescription className="text-slate-300">
            Patterns detected from your recent data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            Your weight has been stable for the last 5 days.
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            Calorie intake is often higher on weekends.
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            You are consistently within 5% of your target calorie range.
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
