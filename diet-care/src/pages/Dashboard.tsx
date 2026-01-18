import { Link, NavLink, Outlet } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const navItems = [
  { label: "Overview", path: "/dashboard" },
  { label: "Chatbot", path: "/dashboard/chatbot" },
  { label: "Profile", path: "/dashboard/profile" },
  { label: "Diet plan", path: "/dashboard/diet-plan" },
  { label: "Monitoring", path: "/dashboard/monitoring" },
];

export const Dashboard = () => {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-emerald-950 text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] lg:gap-8 lg:px-8">
        <aside className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400 text-lg font-semibold text-emerald-950">
              D
            </div>
            <div>
              <p className="text-sm font-semibold text-white">DietCare</p>
              <p className="text-xs text-slate-300"> Dashboard</p>
            </div>
          </div>
          <div className="mt-8 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end
                className={({ isActive }) =>
                  [
                    "flex w-full items-center rounded-xl px-3 py-3 text-sm transition",
                    isActive
                      ? "bg-emerald-400/15 text-emerald-100"
                      : "text-slate-200 hover:bg-white/10",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-auto space-y-4 pt-6">
            <Badge className="w-fit border border-emerald-400/30 bg-emerald-500/10 text-emerald-200">
              Plan active
            </Badge>
            <Card className="border-white/10 bg-slate-950/40">
              <CardHeader>
                <CardTitle className="text-white">Today</CardTitle>
                <CardDescription className="text-slate-300">
                  620 kcal remaining
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </aside>

        <div className="flex flex-col gap-6">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-4">
            <div>
              <h1 className="text-2xl font-semibold text-white flex" >Dashboard</h1>
              <p className="text-sm text-slate-300">
                Plan your day with clarity and confidence.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/100?img=32" alt="User avatar" />
                <AvatarFallback className="text-slate-900">DC</AvatarFallback>
              </Avatar>
              <Button asChild variant="outline" className="border-white/20 text-black hover:bg-white/70">
                <Link to="/login">Logout</Link>

              </Button>
            </div>
          </header>

          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
};
