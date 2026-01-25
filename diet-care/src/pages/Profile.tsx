import { useEffect, useMemo, useState } from "react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import type { UserProfile } from "../types";
import { createProfile, getProfile, updateProfile } from "../services/user.service";

const activityOptions = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
];

const goalOptions = [
  { label: "Lose", value: "LOSE" },
  { label: "Maintain", value: "MAINTAIN" },
  { label: "Gain", value: "GAIN" },
];

const emptyProfile: UserProfile = {
  gender: "",
  birthDate: "",
  heightCm: null,
  currentWeightKg: null,
  activityLevel: null,
  dietGoal: null,
  profileCompleted: false,
};

export const Profile = () => {
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProfile();
        if (mounted) {
          setProfile({
            ...emptyProfile,
            ...data,
            birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
          });
          setExists(true);
        }
      } catch (err) {
        if (mounted) {
          setExists(false);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const completionStatus = useMemo(() => {
    if (!profile.profileCompleted) return "Incomplete";
    return "Completed";
  }, [profile.profileCompleted]);

  const handleChange = (field: keyof UserProfile, value: string | number | boolean | null) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const payload: Partial<UserProfile> = {
      gender: profile.gender || null,
      birthDate: profile.birthDate || null,
      heightCm: profile.heightCm ?? null,
      currentWeightKg: profile.currentWeightKg ?? null,
      activityLevel: profile.activityLevel ?? null,
      dietGoal: profile.dietGoal ?? null,
      profileCompleted: Boolean(profile.profileCompleted),
    };

    try {
      const data = exists ? await updateProfile(payload) : await createProfile(payload);
      setProfile({
        ...emptyProfile,
        ...data,
        birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
      });
      setExists(true);
    } catch (err) {
      setError("Unable to save profile. Please check your inputs.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="space-y-4">
        <Badge className="w-fit border border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
          Profile
        </Badge>
        <p className="text-sm text-slate-300">Loading profile...</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <Badge className="w-fit border border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
          Profile
        </Badge>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          Your health profile
        </h1>
        <p className="text-sm text-slate-300 md:text-base">
          Keep this information up to date for better recommendations.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="border-white/10 bg-slate-950/40">
          <CardHeader>
            <CardTitle className="text-white">Profile details</CardTitle>
            <CardDescription className="text-slate-300">
              {exists ? "Update your info" : "Create your profile"} · Status: {completionStatus}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-slate-200" htmlFor="profile-gender">
                Gender
              </Label>
              <Input
                id="profile-gender"
                value={profile.gender ?? ""}
                onChange={(event) => handleChange("gender", event.target.value)}
                className="border-white/10 bg-slate-950/40 text-white"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="profile-birthDate">Birth date</Label>
                <Input
                  id="profile-birthDate"
                  type="date"
                  value={profile.birthDate ?? ""}
                  onChange={(event) => handleChange("birthDate", event.target.value)}
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
                  value={profile.heightCm ?? ""}
                  onChange={(event) =>
                    handleChange(
                      "heightCm",
                      event.target.value === "" ? null : Number(event.target.value)
                    )
                  }
                  className="border-white/10 bg-slate-950/40 text-white"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="profile-activity">Activity level</Label>
                <select
                  id="profile-activity"
                  value={profile.activityLevel ?? ""}
                  onChange={(event) => handleChange("activityLevel", event.target.value)}
                  className="h-11 w-full rounded-md border border-white/10 bg-slate-950/40 px-3 text-sm text-white"
                >
                  <option value="">Select activity</option>
                  {activityOptions.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="profile-goal">Diet goal</Label>
                <select
                  id="profile-goal"
                  value={profile.dietGoal ?? ""}
                  onChange={(event) => handleChange("dietGoal", event.target.value)}
                  className="h-11 w-full rounded-md border border-white/10 bg-slate-950/40 px-3 text-sm text-white"
                >
                  <option value="">Select goal</option>
                  {goalOptions.map((goal) => (
                    <option key={goal.value} value={goal.value}>
                      {goal.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="profile-weight">Current weight (kg)</Label>
                <Input
                  id="profile-weight"
                  type="number"
                  min={35}
                  max={200}
                  value={profile.currentWeightKg ?? ""}
                  onChange={(event) =>
                    handleChange(
                      "currentWeightKg",
                      event.target.value === "" ? null : Number(event.target.value)
                    )
                  }
                  className="border-white/10 bg-slate-950/40 text-white"
                />
              </div>
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="profile-completed">Profile completed</Label>
                <select
                  id="profile-completed"
                  value={profile.profileCompleted ? "yes" : "no"}
                  onChange={(event) => handleChange("profileCompleted", event.target.value === "yes")}
                  className="h-11 w-full rounded-md border border-white/10 bg-slate-950/40 px-3 text-sm text-white"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-rose-300">{error}</p>}

            <Button
              className="w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-emerald-950 hover:bg-emerald-300"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : exists ? "Update profile" : "Create profile"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
