import { useState } from "react";
import TimeCraftHeader from "@/components/TimeCraftHeader";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ScheduleGrid from "@/components/Schedule/ScheduleGrid";
import TaskDialog from "@/components/Schedule/TaskDialog";
import QuickAddButton from "@/components/QuickAddButton";
import { useScheduleStore } from "@/store/useScheduleStore";
import { format } from "date-fns";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const progress = useScheduleStore(s => s.progressForDate(dateStr));

  return (
    <div className="min-h-screen bg-background">
      <Seo title="TimeCraft — Daily Schedule Tracker" description="Plan, time-block, and optimize your day with TimeCraft." path="" />
      <TimeCraftHeader />
      <main className="container mx-auto p-6 space-y-6 animate-enter">
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Today&apos;s Schedule</h1>
            <p className="text-muted-foreground">Time-block your day effectively</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              aria-label="Select date"
              type="date"
              className="px-3 py-2 rounded-md border bg-background"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
            <Button variant="outline" onClick={() => setSelectedDate(new Date())}>Today</Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardContent className="p-4">
              <ScheduleGrid dateStr={dateStr} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm">{progress.percent}%</span>
                </div>
                <Progress value={progress.percent} />
                <div className="text-xs text-muted-foreground mt-2">
                  {progress.completed} of {progress.total} tasks completed
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Tip: Drag tasks to different hours to reschedule.
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <TaskDialog open={open} onOpenChange={setOpen} date={selectedDate} />
      <QuickAddButton onClick={() => setOpen(true)} />
    </div>
  );
};

export default Index;
