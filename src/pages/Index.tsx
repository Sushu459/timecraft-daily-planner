import { useState } from "react";
import TimeCraftHeader from "@/components/TimeCraftHeader";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ScheduleGrid from "@/components/Schedule/ScheduleGrid";
import TaskDialog from "@/components/Schedule/TaskDialog";
import QuickAddButton from "@/components/QuickAddButton";
import { DailyQuote } from "@/components/DailyQuote";
import { StreakCounter } from "@/components/StreakCounter";
import { StartAllButton } from "@/components/StartAllButton";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useTimerStore } from "@/store/useTimerStore";
import { useTimer } from "@/hooks/useTimer";
import { format } from "date-fns";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const progress = useScheduleStore(s => s.progressForDate(dateStr));
  const getActiveTimers = useTimerStore(s => s.getActiveTimers);
  const activeTimers = getActiveTimers();
  
  // Initialize timer hook
  useTimer();

  return (
    <div className="min-h-screen bg-background">
      <Seo title="TimeCraft — Daily Schedule Tracker" description="Plan, time-block, and optimize your day with TimeCraft." path="" />
      <TimeCraftHeader />
      <main className="container mx-auto p-6 space-y-6 animate-enter">
        <DailyQuote />
        
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
            <StartAllButton dateStr={dateStr} />
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-6">
          <Card className="md:col-span-3">
            <CardContent className="p-4">
              <ScheduleGrid dateStr={dateStr} />
            </CardContent>
          </Card>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm">{progress.percent}%</span>
                  </div>
                  <Progress value={progress.percent} className={activeTimers.length > 0 ? 'animate-pulse' : ''} />
                  <div className="text-xs text-muted-foreground mt-2">
                    {progress.completed} of {progress.total} tasks completed
                  </div>
                </div>
                {activeTimers.length > 0 && (
                  <div className="text-xs text-primary font-medium">
                    {activeTimers.length} timer{activeTimers.length === 1 ? '' : 's'} running
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Tip: Use timer controls to track your progress.
                </div>
              </CardContent>
            </Card>
            <StreakCounter />
          </div>
        </section>
      </main>

      <TaskDialog open={open} onOpenChange={setOpen} date={selectedDate} />
      <QuickAddButton onClick={() => setOpen(true)} />
    </div>
  );
};

export default Index;
