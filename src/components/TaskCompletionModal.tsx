import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Flame, Target } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useScheduleStore } from '@/store/useScheduleStore';
import confetti from 'canvas-confetti';

interface TaskCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  taskCategory: string;
  taskDuration: number; // in minutes
}

export const TaskCompletionModal = ({ 
  isOpen, 
  onClose, 
  taskTitle, 
  taskCategory, 
  taskDuration 
}: TaskCompletionModalProps) => {
  const streak = useAppStore(state => state.streak);
  const today = new Date().toISOString().split('T')[0];
  const { progressForDate } = useScheduleStore();
  const todayProgress = progressForDate(today);

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti when modal opens
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('✅ Task Completed!', {
          body: `${taskTitle} (${taskDuration} min) - Keep up the great work!`,
          icon: '/favicon.ico'
        });
      }
    }
  }, [isOpen, taskTitle, taskDuration]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-enter">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            🎉 Task Completed!
          </DialogTitle>
          <DialogDescription className="text-lg">
            Great job finishing <span className="font-semibold">{taskTitle}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="text-sm">
              <Target className="w-4 h-4 mr-1" />
              {taskCategory}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {taskDuration} minutes
            </Badge>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Daily Progress</span>
              <span className="font-semibold">{todayProgress.completed}/{todayProgress.total} tasks</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Flame className="w-4 h-4" />
                Current Streak
              </span>
              <span className="font-semibold">{streak} days</span>
            </div>

            {todayProgress.percent === 100 && (
              <div className="text-center p-2 bg-gradient-primary rounded-md text-primary-foreground">
                <div className="font-semibold">🔥 Perfect Day!</div>
                <div className="text-sm opacity-90">All tasks completed!</div>
              </div>
            )}
          </div>
        </div>

        <Button onClick={onClose} className="w-full">
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
};