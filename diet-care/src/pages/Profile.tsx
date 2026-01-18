import { useMemo, useState } from "react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  type Gender,
  getBmi,
  getBmiCategory,
  getDailyCalories,
  getIdealBodyWeight,
} from "../utils/calculations";

const activityLevels = [
  { label: "Sedentary (little to no exercise)", value: 1.2 },
  { label: "Light (1-3 days/week)", value: 1.375 },
  { label: "Moderate (3-5 days/week)", value: 1.55 },
  { label: "Active (6-7 days/week)", value: 1.725 },
  { label: "Very active (physical job/training)", value: 1.9 },
];


export const Profile = () => {
  const [gender, setGender] = useState<Gender>("female");
  const [age, setAge] = useState(24);
  const [heightCm, setHeightCm] = useState(165);
  const [weightKg, setWeightKg] = useState(62);
  const [activity, setActivity] = useState(activityLevels[1].value);

  const results = useMemo(() => {
    const bmi = getBmi(weightKg, heightCm);
    const dailyCalories = getDailyCalories({
      gender,
      age,
      heightCm,
      weightKg,
      activityMultiplier: activity,
    });
    const ideal = getIdealBodyWeight(heightCm, gender);
    return { bmi, dailyCalories, ideal };
  }, [activity, age, gender, heightCm, weightKg]);

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <Badge className="w-fit border border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
          Profile calculator
        </Badge>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          Calculate your daily calories and BMI.
        </h1>
        <p className="text-sm text-slate-300 md:text-base">
          Update your profile details to get personalized recommendations.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="border-white/10 bg-slate-950/40">
          <CardHeader>
            <CardTitle className="text-white">Your details</CardTitle>
            <CardDescription className="text-slate-300">
              Use accurate values for the best recommendation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-slate-200">Gender</Label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={gender === "female" ? "default" : "outline"}
                  className={
                    gender === "female"
                      ? "bg-emerald-400 text-emerald-950 hover:bg-emerald-300"
                      : "border-white/20 text-black hover:bg-white/70"
                  }
                  onClick={() => setGender("female")}
                >
                  Female
                </Button>
                <Button
                  type="button"
                  variant={gender === "male" ? "default" : "outline"}
                  className={
                    gender === "male"
                      ? "bg-emerald-400 text-emerald-950 hover:bg-emerald-300"
                      : "border-white/20 text-black hover:bg-white/70"
                  }
                  onClick={() => setGender("male")}
                >
                  Male
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="profile-age">Age</Label>
                <Input
                  id="profile-age"
                  type="number"
                  min={10}
                  max={100}
                  value={age}
                  onChange={(event) => setAge(Number(event.target.value))}
                  className="border-white/10 bg-slate-950/40 text-white"
                />
              </div>
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="profile-height">Height (cm)</Label>
                <Input
                  id="profile-height"
                  type="number"
                  min={120}
                  max={220}
                  value={heightCm}
                  onChange={(event) => setHeightCm(Number(event.target.value))}
                  className="border-white/10 bg-slate-950/40 text-white"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="profile-weight">Weight (kg)</Label>
                <Input
                  id="profile-weight"
                  type="number"
                  min={35}
                  max={200}
                  value={weightKg}
                  onChange={(event) => setWeightKg(Number(event.target.value))}
                  className="border-white/10 bg-slate-950/40 text-white"
                />
              </div>
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="profile-activity">Activity level</Label>
                <select
                  id="profile-activity"
                  value={activity}
                  onChange={(event) => setActivity(Number(event.target.value))}
                  className="h-11 w-full rounded-md border border-white/10 bg-slate-950/40 px-3 text-sm text-white"
                >
                  {activityLevels.map((level) => (
                    <option key={level.label} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-950/40">
          <CardHeader>
            <CardTitle className="text-white">Your results</CardTitle>
            <CardDescription className="text-slate-300">
              Estimated needs and healthy targets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-200">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Daily calories
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-200">
                {Math.round(results.dailyCalories)} kcal
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Body mass index
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-200">
                {results.bmi.toFixed(1)}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Category: {getBmiCategory(results.bmi)}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Ideal body weight
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-200">
                {results.ideal.toFixed(1)} kg
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Based on your height and gender.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
