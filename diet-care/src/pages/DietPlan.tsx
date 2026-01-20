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

const dietPlan = {
  calorieTarget: 1800,
  totalCalories: 1650,
  weightTarget: "72 kg",
  status: "On Track",
  statusTone: "bg-emerald-400/15 text-emerald-100",
  dietStatus: "Calorie Deficit",
  meals: [
    {
      type: "Breakfast",
      name: "Oatmeal + Banana",
      calories: 350,
      protein: 12,
      carbs: 55,
      fat: 8,
    },
    {
      type: "Lunch",
      name: "Grilled Chicken Salad",
      calories: 480,
      protein: 38,
      carbs: 30,
      fat: 16,
    },
    {
      type: "Dinner",
      name: "Salmon + Quinoa Bowl",
      calories: 520,
      protein: 35,
      carbs: 45,
      fat: 18,
    },
    {
      type: "Snack",
      name: "Greek Yogurt + Berries",
      calories: 300,
      protein: 18,
      carbs: 32,
      fat: 6,
    },
  ],
};

const macroTotals = dietPlan.meals.reduce(
  (totals, meal) => ({
    protein: totals.protein + meal.protein,
    carbs: totals.carbs + meal.carbs,
    fat: totals.fat + meal.fat,
  }),
  { protein: 0, carbs: 0, fat: 0 }
);

const totalMacros = macroTotals.protein + macroTotals.carbs + macroTotals.fat;
const macroPercentages = {
  protein: Math.round((macroTotals.protein / totalMacros) * 100),
  carbs: Math.round((macroTotals.carbs / totalMacros) * 100),
  fat: Math.round((macroTotals.fat / totalMacros) * 100),
};

const calorieProgress = Math.min(
  100,
  Math.round((dietPlan.totalCalories / dietPlan.calorieTarget) * 100)
);

export const DietPlan = () => {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
          Today's Diet Plan
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Today's Diet Plan
          </h1>
          <Badge className="border border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
            {dietPlan.dietStatus}
          </Badge>
        </div>
        <p className="text-sm text-slate-300 md:text-base">
          Track your daily intake and stay aligned with your goals.
        </p>
      </header>

      <Card className="border-white/10 bg-slate-950/40">
        <CardHeader>
          <CardTitle className="text-white">Diet target summary</CardTitle>
          <CardDescription className="text-slate-300">
            Daily calorie goal, weight target, and progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Daily calorie target
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-200">
                {dietPlan.calorieTarget} kcal
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Weight target
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-200">
                {dietPlan.weightTarget}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Status
              </p>
              <Badge className={`mt-2 ${dietPlan.statusTone}`}>{dietPlan.status}</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Calorie progress</span>
              <span>
                {dietPlan.totalCalories} / {dietPlan.calorieTarget} kcal
              </span>
            </div>
            <Progress
              value={calorieProgress}
              className="h-3 bg-white/10"
              indicatorClassName="bg-emerald-400"
            />
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Daily menu recommendations</h2>
          <p className="text-sm text-slate-300">
            Suggested meals with macronutrients and calories.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {dietPlan.meals.map((meal) => (
            <Card key={meal.type} className="border-white/10 bg-slate-950/40">
              <CardHeader>
                <CardTitle className="text-white">{meal.type}</CardTitle>
                <CardDescription className="text-slate-300">{meal.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    {meal.calories} kcal
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    Protein {meal.protein}g
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    Carbs {meal.carbs}g
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    Fat {meal.fat}g
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-white/20 text-black hover:bg-white/70">
                        Change Menu
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-950">
                      <DialogHeader>
                        <DialogTitle>Change {meal.type} menu</DialogTitle>
                        <DialogDescription>
                          Enter your preferred menu and nutrition details.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2 text-slate-200">
                          <label className="text-sm">Menu name</label>
                          <Input
                            defaultValue={meal.name}
                            className="border-white/10 bg-slate-950/40 text-white"
                            placeholder="Enter menu name"
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2 text-slate-200">
                            <label className="text-sm">Calories</label>
                            <Input
                              defaultValue={meal.calories}
                              className="border-white/10 bg-slate-950/40 text-white"
                              type="number"
                              min={0}
                            />
                          </div>
                          <div className="space-y-2 text-slate-200">
                            <label className="text-sm">Protein (g)</label>
                            <Input
                              defaultValue={meal.protein}
                              className="border-white/10 bg-slate-950/40 text-white"
                              type="number"
                              min={0}
                            />
                          </div>
                          <div className="space-y-2 text-slate-200">
                            <label className="text-sm">Carbs (g)</label>
                            <Input
                              defaultValue={meal.carbs}
                              className="border-white/10 bg-slate-950/40 text-white"
                              type="number"
                              min={0}
                            />
                          </div>
                          <div className="space-y-2 text-slate-200">
                            <label className="text-sm">Fat (g)</label>
                            <Input
                              defaultValue={meal.fat}
                              className="border-white/10 bg-slate-950/40 text-white"
                              type="number"
                              min={0}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter className="pt-5">
                        <DialogClose asChild>
                          <Button variant="outline" className="border-white/20 bg-red-500 hover:bg-red-500/70">
                            Close
                          </Button>
                        </DialogClose>
                        <Button className="bg-emerald-400 text-emerald-950 hover:bg-emerald-300">
                          Save selection
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button className="bg-emerald-400 text-emerald-950 hover:bg-emerald-300">
                    View Recipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card className="border-white/10 bg-slate-950/40">
        <CardHeader>
          <CardTitle className="text-white">Total nutrient summary</CardTitle>
          <CardDescription className="text-slate-300">
            Macro distribution and total calories for today.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-200">
            <span>Total calories</span>
            <span className="text-lg font-semibold text-emerald-200">
              {dietPlan.totalCalories} kcal
            </span>
          </div>
          <div className="space-y-3">
            {[
              { label: "Protein", value: macroPercentages.protein, tone: "bg-emerald-400" },
              { label: "Carbs", value: macroPercentages.carbs, tone: "bg-amber-400" },
              { label: "Fat", value: macroPercentages.fat, tone: "bg-rose-400" },
            ].map((macro) => (
              <div key={macro.label} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{macro.label}</span>
                  <span>{macro.value}%</span>
                </div>
                <Progress value={macro.value} className="h-2 bg-white/10" indicatorClassName={macro.tone} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button className="rounded-xl bg-emerald-400 text-emerald-950 hover:bg-emerald-300">
          Log Today's Meal
        </Button>
        <Button variant="outline" className="rounded-xl border-white/20 text-black hover:bg-white/70">
          Ask AI About This Menu
        </Button>
      </div>
    </section>
  );
};
