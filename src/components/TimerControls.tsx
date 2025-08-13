import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimerStore } from '@/store/useTimerStore';
import { Progress } from '@/components/ui/progress';
import { formatTime } from '@/lib/utils';

interface TimerControlsProps {
  taskId: string;
  duration: number; // in minutes
  className?: string;
}

export const TimerControls = ({ taskId, duration, className }: TimerControlsProps) => {
  const {
    startTimer,
    pauseTimer,
    resetTimer,
    getTimerProgress,
    getElapsedTime,
    isTimerRunning,
  } = useTimerStore();

  const isRunning = isTimerRunning(taskId);
  const progress = getTimerProgress(taskId);
  const elapsedSeconds = getElapsedTime(taskId);
  const durationSeconds = duration * 60;

  const handleStart = () => {
    startTimer(taskId, durationSeconds);
  };

  const handlePause = () => {
    pauseTimer(taskId);
  };

  const handleReset = () => {
    resetTimer(taskId);
  };

  const remainingSeconds = Math.max(0, durationSeconds - elapsedSeconds);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex gap-1">
        {!isRunning ? (
          <Button
            size="sm"
            variant="outline"
            onClick={handleStart}
            className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground"
          >
            <Play className="h-3 w-3" />
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handlePause}
            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Pause className="h-3 w-3" />
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
          className="h-8 w-8 p-0"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="flex-1 min-w-0">
        <Progress 
          value={progress} 
          className={`h-2 ${isRunning ? 'animate-pulse' : ''}`}
        />
        <div className="text-xs text-muted-foreground mt-1 text-center">
          {formatTime(remainingSeconds)} left
        </div>
      </div>
    </div>
  );
};