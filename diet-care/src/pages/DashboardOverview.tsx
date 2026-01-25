import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Flame, Goal, Scale, Sparkles } from "lucide-react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import type { JSX } from "react";
import type { DietPlan, UserProfile } from "../types";
import { getDietPlan } from "../services/diet.service";
import { getProfile } from "../services/user.service";
import { useAuth } from "../hooks/useAuth";

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

const statusTone: Record<DietStatus, string> = {
  "On Track": "bg-emerald-400/15 text-emerald-100 border-emerald-400/30",
  "Off Track": "bg-rose-400/15 text-rose-100 border-rose-400/30",
  "Needs Adjustment": "bg-amber-400/15 text-amber-100 border-amber-400/30",
};

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
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profileData, planData] = await Promise.all([
          getProfile().catch(() => null),
          getDietPlan().catch(() => null),
        ]);

        if (!mounted) return;
        setProfile(profileData);
        setDietPlan(planData);
      } catch (err) {
        if (mounted) {
          setError("Unable to load dashboard data.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const status: DietStatus = useMemo(() => {
    if (!profile || !dietPlan) return "Needs Adjustment";
    if (profile.profileCompleted) return "On Track";
    return "Needs Adjustment";
  }, [dietPlan, profile]);

  const metricCards: MetricCard[] = useMemo(() => {
    const currentWeight = profile?.currentWeightKg;
    const targetWeight = dietPlan?.targetWeight ?? null;
    const calorieTarget = dietPlan?.dailyCalorieTarget ?? null;
    const planType = dietPlan?.planType ?? null;

    const remainingText =
      currentWeight !== null && currentWeight !== undefined && targetWeight
        ? `${Math.abs(currentWeight - targetWeight).toFixed(1)} kg remaining`
        : "Add a target weight";

    const calorieSubtitle = calorieTarget
      ? `Daily target ${calorieTarget} kcal`
      : "Create a diet plan";

    const dietProgress = profile?.profileCompleted ? 80 : 35;

    return [
      {
        id: "current-weight",
        title: "Current Weight",
        value: currentWeight ? `${currentWeight.toFixed(1)} kg` : "--",
        subtitle: "Latest saved profile weight",
        icon: <Scale className="h-5 w-5 text-emerald-200" />,
      },
      {
        id: "target-weight",
        title: "Target Weight",
        value: targetWeight ? `${targetWeight.toFixed(1)} kg` : "--",
        subtitle: remainingText,
        icon: <Goal className="h-5 w-5 text-emerald-200" />,
      },
      {
        id: "today-calories",
        title: "Daily Calories",
        value: calorieTarget ? `${calorieTarget} kcal` : "--",
        subtitle: calorieSubtitle,
        icon: <Flame className="h-5 w-5 text-emerald-200" />,
      },
      {
        id: "diet-progress",
        title: "Diet Progress",
        value: `${dietProgress}%`,
        subtitle: planType ? `Plan: ${planType}` : "Complete your profile",
        icon: <Activity className="h-5 w-5 text-emerald-200" />,
      },
      {
        id: "consistency",
        title: "Consistency",
        value: profile?.profileCompleted ? "Good" : "Low",
        subtitle: profile?.profileCompleted ? "Profile complete" : "Fill in your profile",
        icon: <Sparkles className="h-5 w-5 text-emerald-200" />,
      },
    ];
  }, [dietPlan, profile]);

  const trendData: WeightTrendPoint[] = useMemo(() => {
    if (!profile?.currentWeightKg) return [];
    return [
      { day: "Mon", value: profile.currentWeightKg + 1.0 },
      { day: "Tue", value: profile.currentWeightKg + 0.8 },
      { day: "Wed", value: profile.currentWeightKg + 0.6 },
      { day: "Thu", value: profile.currentWeightKg + 0.4 },
      { day: "Fri", value: profile.currentWeightKg + 0.3 },
      { day: "Sat", value: profile.currentWeightKg + 0.2 },
      { day: "Sun", value: profile.currentWeightKg },
    ];
  }, [profile?.currentWeightKg]);

  const trendLine = trendData.length ? getTrendPolyline(trendData) : "";

  if (loading) {
    return (
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
          Dashboard Overview
        </p>
        <p className="text-sm text-slate-300">Loading dashboard...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
          Dashboard Overview
        </p>
        <p className="text-sm text-rose-300">{error}</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
        Dashboard Overview
      </p>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="flex text-3xl font-semibold text-white md:text-4xl">
            Welcome back, {user?.name ?? "friend"} 👋
          </h1>
          <p className="text-sm text-slate-300 md:text-base">
            Here's your current diet status and recommended next steps.
          </p>
        </div>
        <Badge className={`border ${statusTone[status]}`}>{status}</Badge>
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
                    <span>{metric.value}</span>
                  </div>
                  <Progress
                    value={Number(metric.value.replace("%", ""))}
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
        <CardContent className="flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-xl bg-emerald-400 text-emerald-950 hover:bg-emerald-300">
            <Link to="/dashboard/profile">Update Profile</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-white/20 text-black hover:bg-white/70">
            <Link to="/dashboard/diet-plan">View Diet Plan</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-white/20 text-black hover:bg-white/70">
            <Link to="/dashboard/chatbot">Consult Chat</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-slate-950/40">
          <CardHeader>
            <CardTitle className="text-white">Weight trend (7 days)</CardTitle>
            <CardDescription className="text-slate-300">
              Save weight logs to track progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trendData.length ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <svg viewBox="0 0 100 100" className="h-48 w-full">
                  <polyline fill="none" stroke="#34d399" strokeWidth="3" points={trendLine} />
                  <circle cx="100" cy="20" r="4" fill="#34d399" />
                </svg>
                <div className="mt-3 flex justify-between text-xs text-slate-300">
                  {trendData.map((point) => (
                    <span key={point.day}>{point.day}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                Add your current weight in the profile to view trends.
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Weekly change</span>
              <span className="text-emerald-200">--</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-950/40">
          <CardHeader>
            <CardTitle className="text-white">Diet insight</CardTitle>
            <CardDescription className="text-slate-300">
              Guidance based on your current plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              {dietPlan?.planType
                ? `Your plan is set to ${dietPlan.planType.toLowerCase()}. Stay consistent.`
                : "Create a diet plan to get tailored recommendations."}
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              {profile?.profileCompleted
                ? "Profile complete. Update weight regularly for best accuracy."
                : "Complete your profile to unlock full recommendations."}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
