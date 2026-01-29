import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
import { login as loginService } from "../services/auth.service";
import { useAuth } from "../hooks/useAuth";

export const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginService({ email, password });
      setAuth(data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-950 via-slate-900 to-emerald-950 text-slate-100">
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="order-2 space-y-6 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200 sm:text-sm">
            DietCare
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            Take control of your nutrition with a calmer, smarter routine.
          </h1>
          <p className="text-sm text-slate-300 sm:text-base lg:text-lg">
            Log in to access your personalized plan, track your progress, and
            chat with your diet assistant whenever you need guidance.
          </p>
          <div className="flex place-content-center gap-3">
            <Badge className="border border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
              Smart Plans
            </Badge>
            <Badge className="border border-slate-400/30 bg-slate-500/10 text-slate-200">
              Daily Tracking
            </Badge>
            <Badge className="border border-amber-300/30 bg-amber-400/10 text-amber-200">
              Chat Support
            </Badge>
          </div>
          <div className="hidden items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 sm:flex">
            <span className="font-semibold text-emerald-200">92%</span>
            <span>
              Users stay on track after their first personalized plan.
            </span>
          </div>
        </div>
        <Card className="order-1 w-full border-white/10 bg-white/5 shadow-2xl backdrop-blur sm:max-w-md sm:justify-self-end lg:order-2">
          <CardHeader>
            <CardTitle className="text-white">Welcome back</CardTitle>
            <CardDescription className="text-slate-300">
              Use your DietCare credentials to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="login-email" className="flex pl-1">
                  Email address
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  className="border-white/10 bg-slate-950/40 text-white placeholder:text-slate-400"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="login-password" className="flex pl-1">
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="********"
                  className="border-white/10 bg-slate-950/40 text-white placeholder:text-slate-400"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-3 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                <span>Secure sign-in with encrypted storage.</span>
                <Button variant="link" className="h-auto p-0 text-emerald-200">
                  Forgot password?
                </Button>
              </div>
              {error && <p className="text-xs text-rose-300">{error}</p>}
              <Button
                className="w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-emerald-950 hover:bg-emerald-300"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-xl border-white/20 text-black hover:bg-white/70"
              >
                <Link to="/home">Continue as Guest</Link>
              </Button>
            </form>
            <p className="mt-6 text-center text-xs text-slate-300">
              New here?{" "}
              <Button
                asChild
                variant="link"
                className="h-auto p-0 text-emerald-200"
              >
                <Link to="/register">Create an account</Link>
              </Button>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};
