import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { register as registerService } from "../services/auth.service";
import { useAuth } from "../hooks/useAuth";

export const Register = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await registerService({ email, password, name });
      setAuth(data.user, data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Unable to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-emerald-950 text-slate-100">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-6 py-14">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
            Join DietCare
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            Start building a healthier daily rhythm.
          </h1>
          <p className="mt-3 text-base text-slate-300">
            Create your account to unlock personalized plans and insights.
          </p>
        </div>
        <Card className="w-full max-w-lg border-white/10 bg-white/5 shadow-2xl backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Create account</CardTitle>
            <CardDescription className="text-slate-300">
              It only takes a minute to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="register-name">Full name</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Alex Morgan"
                  className="border-white/10 bg-slate-950/40 text-white placeholder:text-slate-400"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="register-email">Email address</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  className="border-white/10 bg-slate-950/40 text-white placeholder:text-slate-400"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 text-slate-200">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="********"
                  className="border-white/10 bg-slate-950/40 text-white placeholder:text-slate-400"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              {error && <p className="text-xs text-rose-300">{error}</p>}
              <Button
                className="w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-emerald-950 hover:bg-emerald-300"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            <p className="mt-6 text-center text-xs text-slate-300">
              Already have an account?{" "}
              <Button asChild variant="link" className="h-auto p-0 text-emerald-200">
                <Link to="/login">Sign in</Link>
              </Button>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};
