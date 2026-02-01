import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import type { UserProfile } from "../types";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "../services/user.service";

const activityOptions = [
  { label: "Sedentary (little or no exercise)", value: "SEDENTARY" },
  { label: "Light (1-3 days/week)", value: "LIGHT" },
  { label: "Moderate (3-5 days/week)", value: "MODERATE" },
  { label: "Active (6-7 days/week)", value: "ACTIVE" },
  { label: "Very active (hard exercise)", value: "VERY_ACTIVE" },
  { label: "Extra active (physical job + training)", value: "EXTRA_ACTIVE" },
];

const goalOptions = [
  { label: "Lose", value: "LOSE" },
  { label: "Maintain", value: "MAINTAIN" },
  { label: "Gain", value: "GAIN" },
];

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const completedOptions = [
  { label: "No", value: false },
  { label: "Yes", value: true },
];

const emptyProfile: UserProfile = {
  gender: "",
  birthDate: "",
  heightCm: null,
  currentWeightKg: null,
  bmiCurrent: null,
  activityLevel: null,
  dietGoal: null,
  profileCompleted: false,
};

const parseBirthDate = (value: string | null | undefined) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
};

export const Profile = () => {
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exists, setExists] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

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

  const handleChange = (
    field: keyof UserProfile,
    value: string | number | boolean | null,
  ) => {
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
      const data = exists
        ? await updateProfile(payload)
        : await createProfile(payload);
      setProfile({
        ...emptyProfile,
        ...data,
        birthDate: data.birthDate ? data.birthDate.split("T")[0] : "",
      });
      setExists(true);
      setDialogContent({
        type: "success",
        title: exists ? "Profile updated" : "Profile created",
        message: "Your profile has been saved successfully.",
      });
      setDialogOpen(true);
    } catch (err) {
      setError("Unable to save profile. Please check your inputs.");
      setDialogContent({
        type: "error",
        title: "Save failed",
        message: "Unable to save profile. Please check your inputs.",
      });
      setDialogOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const selectedGender =
    genderOptions.find((option) => option.value === profile.gender)?.label ??
    "Select";
  const selectedActivity =
    activityOptions.find((option) => option.value === profile.activityLevel)
      ?.label ?? "Select activity";
  const selectedGoal =
    goalOptions.find((option) => option.value === profile.dietGoal)?.label ??
    "Select goal";
  const selectedCompleted =
    completedOptions.find((option) => option.value === Boolean(profile.profileCompleted))
      ?.label ?? "No";
  const selectedBirthDate = parseBirthDate(profile.birthDate);

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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-white/10 bg-slate-950 text-white">
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
              className="border-white/20 text-black hover:bg-white/70"
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="rounded-3xl border border-white/10 bg-linear-to-br from-emerald-400/10 via-slate-950/80 to-slate-950/70 p-6 shadow-2xl">
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
      </div>

      <div className="flex flex-col gap-6">
        <Card className="border-white/10 bg-slate-950/40">
          <CardHeader>
            <CardTitle className="text-white">Profile details</CardTitle>
            <CardDescription className="text-slate-300">
              {exists ? "Update your info" : "Create your profile"} · Status:{" "}
              {completionStatus}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-slate-200" htmlFor="profile-gender">
                Gender
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-white/10 bg-slate-950/40 text-white"
                  >
                    {selectedGender}
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                  {genderOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleChange("gender", option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="profile-birthDate">Birth date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-white/10 bg-slate-950/40 text-left text-white"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                      {selectedBirthDate
                        ? format(selectedBirthDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Calendar
                      className="bg-slate-950 rounded-lg"
                      mode="single"
                      selected={selectedBirthDate}
                      captionLayout="dropdown"
                      onSelect={(date) =>
                        handleChange(
                          "birthDate",
                          date ? format(date, "yyyy-MM-dd") : "",
                        )
                      }
                    />
                  </PopoverContent>
                </Popover>
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
                      event.target.value === ""
                        ? null
                        : Number(event.target.value),
                    )
                  }
                  className="border-white/10 bg-slate-950/40 text-white"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="profile-activity">Activity level</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between border-white/10 bg-slate-950/40 text-white"
                    >
                      {selectedActivity}
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                    {activityOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleChange("activityLevel", option.value)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="profile-goal">Diet goal</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between border-white/10 bg-slate-950/40 text-white"
                    >
                      {selectedGoal}
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                    {goalOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleChange("dietGoal", option.value)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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
                      event.target.value === ""
                        ? null
                        : Number(event.target.value),
                    )
                  }
                  className="border-white/10 bg-slate-950/40 text-white"
                />
              </div>
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="profile-bmi">Current BMI</Label>
                <Input
                  id="profile-bmi"
                  type="text"
                  value={profile.bmiCurrent ?? "--"}
                  readOnly
                  className="border-white/10 bg-slate-950/40 text-white"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="profile-completed">Profile completed</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between border-white/10 bg-slate-950/40 text-white"
                    >
                      {selectedCompleted}
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                    {completedOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.label}
                        onClick={() => handleChange("profileCompleted", option.value)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {error && <p className="text-sm text-rose-300">{error}</p>}

            <Button
              className="w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-emerald-950 hover:bg-emerald-300"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : exists
                  ? "Update profile"
                  : "Create profile"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
