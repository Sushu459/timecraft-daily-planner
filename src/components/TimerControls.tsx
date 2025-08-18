import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimerStore } from '@/store/useTimerStore';
import { Progress } from '@/components/ui/progress';
import { formatTime } from '@/lib/utils';
import { useEffect, useState } from 'react';

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

  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentElapsed, setCurrentElapsed] = useState(0);

  const isRunning = isTimerRunning(taskId);
  const durationSeconds = duration * 60;

  // Real-time updates every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        setCurrentProgress(getTimerProgress(taskId));
        setCurrentElapsed(getElapsedTime(taskId));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, taskId, getTimerProgress, getElapsedTime]);

  // Update immediately when timer state changes
  useEffect(() => {
    setCurrentProgress(getTimerProgress(taskId));
    setCurrentElapsed(getElapsedTime(taskId));
  }, [isRunning, taskId, getTimerProgress, getElapsedTime]);

  const handleStart = () => {
    startTimer(taskId, durationSeconds);
  };

  const handlePause = () => {
    pauseTimer(taskId);
  };

  const handleReset = () => {
    resetTimer(taskId);
  };

  const remainingSeconds = Math.max(0, durationSeconds - currentElapsed);

  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      {/* Progress ring animation */}
      <div className="relative">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="stroke-secondary"
            strokeWidth="3"
            fill="transparent"
            d="M18 3 a 15 15 0 0 1 0 30 a 15 15 0 0 1 0 -30"
          />
          <path
            className="stroke-primary transition-all duration-300"
            strokeWidth="3"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={`${currentProgress * 0.942} 94.2`}
            d="M18 3 a 15 15 0 0 1 0 30 a 15 15 0 0 1 0 -30"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
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
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Progress 
            value={currentProgress} 
            className={`h-2 flex-1 ${isRunning ? 'animate-pulse' : ''}`}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="h-6 w-6 p-0"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-1 text-center">
          {formatTime(remainingSeconds)} left
        </div>
      </div>
    </div>
  );
};