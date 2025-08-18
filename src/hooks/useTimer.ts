import { useEffect, useRef, useState } from 'react';
import { useTimerStore } from '@/store/useTimerStore';
import { useScheduleStore } from '@/store/useScheduleStore';
import { useAppStore } from '@/store/useAppStore';
import { useNotifications } from './useNotifications';
import confetti from 'canvas-confetti';

export const useTimer = () => {
  const intervalRef = useRef<NodeJS.Timeout>();
  const [completedTask, setCompletedTask] = useState<{
    title: string;
    category: string;
    duration: number;
  } | null>(null);
  
  const { updateTimer, getTimerProgress, pauseTimer, resetTimer } = useTimerStore();
  const { updateTask, tasksForDate } = useScheduleStore();
  const { updateStreak, addTimeSpent } = useAppStore();
  const { showNotification } = useNotifications();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const activeTimers = useTimerStore.getState().getActiveTimers();
      
      activeTimers.forEach((timer) => {
        updateTimer(timer.taskId);
        const progress = getTimerProgress(timer.taskId);
        
        if (progress >= 100) {
          // Timer completed - mark task as complete
          pauseTimer(timer.taskId);
          updateTask(timer.taskId, { completed: true });
          
          // Find the task to get category and duration
          const today = new Date().toISOString().split('T')[0];
          const tasks = tasksForDate(today);
          const completedTask = tasks.find(t => t.id === timer.taskId);
          
          if (completedTask) {
            addTimeSpent(completedTask.category, completedTask.duration);
            
            // Show browser notification
            showNotification('✅ Task Completed!', {
              body: `${completedTask.title} (${completedTask.duration} min) - Great work!`,
              tag: 'task-completion'
            });
            
            // Set completed task for modal
            setCompletedTask({
              title: completedTask.title,
              category: completedTask.category,
              duration: completedTask.duration
            });
            
            // Check if all tasks for today are completed
            const allTasksCompleted = tasks.every(t => t.completed);
            if (allTasksCompleted && tasks.length > 0) {
              updateStreak(today);
              // Trigger confetti
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
              });
            }
          }
          
          resetTimer(timer.taskId);
        }
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateTimer, getTimerProgress, pauseTimer, resetTimer, updateTask, tasksForDate, updateStreak, addTimeSpent]);

  return {
    completedTask,
    clearCompletedTask: () => setCompletedTask(null)
  };
};