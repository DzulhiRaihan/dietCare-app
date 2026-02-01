import { useEffect, useState } from "react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Progress } from "../components/ui/progress";
import type { DietPlan as DietPlanType } from "../types";
import { createDietPlan, getDietPlan } from "../services/diet.service";

export const DietPlan = () => {
  const [plan, setPlan] = useState<DietPlanType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const loadPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDietPlan();
      setPlan(data);
    } catch (err) {
      setPlan(null);
      setError("No diet plan data yet. Create your plan to get started.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, []);

  const handleCreatePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const planData = await createDietPlan();
      setPlan(planData);
      setError(null);
      setDialogContent({
        type: "success",
        title: "Diet plan created",
        message: "Your diet plan has been generated successfully.",
      });
      setDialogOpen(true);
    } catch (err) {
      setError("Unable to create diet plan. Check your profile details.");
      setDialogContent({
        type: "error",
        title: "Create failed",
        message: "Unable to create diet plan. Check your profile details.",
      });
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const calorieProgress = plan?.dailyCalorieTarget ? 0 : 0;

  return (
    <section className="space-y-6">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-white/10 bg-slate-950/95 text-white">
          <DialogHeader>
            <DialogTitle>{dialogContent?.title}</DialogTitle>
            <DialogDescription className="text-slate-300">
              {dialogContent?.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
          Diet Plan
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">Diet Plan</h1>
          {plan?.planType && (
            <Badge className="border border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
              {plan.planType}
            </Badge>
          )}
        </div>
        <p className="text-sm text-slate-300 md:text-base">
          Your daily calorie and macro targets are calculated from your profile.
        </p>
      </header>

      {loading && <p className="text-sm text-slate-300">Loading diet plan...</p>}
      {error && <p className="text-sm text-rose-300">{error}</p>}

      {!plan && !loading && (
        <Card className="border-white/10 bg-slate-950/40">
          <CardHeader>
            <CardTitle className="text-white">No diet plan yet</CardTitle>
            <CardDescription className="text-slate-300">
              Create a diet plan to see your calorie and macro targets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="rounded-xl bg-emerald-400 text-emerald-950 hover:bg-emerald-300"
              onClick={handleCreatePlan}
              disabled={loading}
            >
              Generate plan
            </Button>
          </CardContent>
        </Card>
      )}

      {plan && (
        <Card className="border-white/10 bg-slate-950/40">
          <CardHeader>
            <CardTitle className="text-white">Diet target summary</CardTitle>
            <CardDescription className="text-slate-300">
              Daily calorie goal and macro targets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Daily calorie target
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-200">
                  {plan.dailyCalorieTarget ?? "--"} kcal
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Protein target
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-200">
                  {plan.proteinTarget ?? "--"} g
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Carbs target
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-200">
                  {plan.carbsTarget ?? "--"} g
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Fat target
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-200">
                  {plan.fatTarget ?? "--"} g
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Target weight
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-200">
                  {plan.targetWeight ? `${plan.targetWeight} kg` : "--"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Plan status
                </p>
                <Badge className="mt-2 border border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
                  {plan.planType ?? "--"}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Calorie progress</span>
                <span>
                  {plan.dailyCalorieTarget ? `0 / ${plan.dailyCalorieTarget} kcal` : "--"}
                </span>
              </div>
              <Progress value={calorieProgress} className="h-3 bg-white/10" indicatorClassName="bg-emerald-400" />
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
};
