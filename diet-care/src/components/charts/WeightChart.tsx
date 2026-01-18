import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export const WeightChart = () => {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-white">Weight progress</CardTitle>
        <CardDescription className="text-slate-300">
          Weekly check-ins to keep you on track.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-6 text-center text-sm text-slate-200">
          Chart placeholder
        </div>
      </CardContent>
    </Card>
  );
};
