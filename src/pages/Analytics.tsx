import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScheduleStore } from "@/store/useScheduleStore";
import { endOfMonth, endOfWeek, isWithinInterval, startOfMonth, startOfWeek } from "date-fns";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";

export default function Analytics() {
  const tasks = useScheduleStore(s => s.tasks);

  const { week, month } = useMemo(() => buildData(tasks), [tasks]);

  return (
    <main className="container mx-auto p-6 animate-enter">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Time Usage Analytics</h1>
        <p className="text-muted-foreground">Track time spent by category</p>
      </header>
      <section className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={week}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="minutes" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={month}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="minutes" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function buildData(tasks: ReturnType<typeof useScheduleStore.getState>['tasks']) {
  const now = new Date();
  const weekRange = { start: startOfWeek(now), end: endOfWeek(now) };
  const monthRange = { start: startOfMonth(now), end: endOfMonth(now) };

  const sumBy = (range: { start: Date; end: Date }) => {
    const map = new Map<string, number>();
    for (const t of tasks) {
      const d = new Date(t.date + 'T00:00:00');
      if (!isWithinInterval(d, range)) continue;
      map.set(t.category, (map.get(t.category) ?? 0) + t.duration);
    }
    return Array.from(map.entries()).map(([category, minutes]) => ({ category, minutes }));
  };

  return { week: sumBy(weekRange), month: sumBy(monthRange) };
}
