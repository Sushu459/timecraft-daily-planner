import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { useTimerStore } from '@/store/useTimerStore';
import { toast } from '@/hooks/use-toast';

interface StartAllButtonProps {
  dateStr: string;
}

export const StartAllButton = ({ dateStr }: StartAllButtonProps) => {
  const tasksForDate = useScheduleStore(state => state.tasksForDate);
  const { startTimer, pauseTimer, getActiveTimers } = useTimerStore();

  const handleStartAll = () => {
    const tasks = tasksForDate(dateStr).filter(task => !task.completed);
    const activeTimers = getActiveTimers();

    if (tasks.length === 0) {
      toast({
        title: "No tasks to start",
        description: "All tasks are already completed or no tasks for today.",
      });
      return;
    }

    // Pause all currently running timers
    activeTimers.forEach(timer => pauseTimer(timer.taskId));

    // Start the first incomplete task
    const firstTask = tasks[0];
    startTimer(firstTask.id, firstTask.duration * 60);

    toast({
      title: "Sequential mode started",
      description: `Starting with "${firstTask.title}". Tasks will auto-advance when completed.`,
    });
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleStartAll}
      className="gap-2"
    >
      <PlayCircle className="h-4 w-4" />
      Start All
    </Button>
  );
};