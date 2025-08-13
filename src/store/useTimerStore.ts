import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TimerState {
  taskId: string;
  startTime: number; // timestamp
  elapsedTime: number; // seconds
  isRunning: boolean;
  totalDuration: number; // seconds
}

interface TimerStore {
  timers: Record<string, TimerState>;
  startTimer: (taskId: string, duration: number) => void;
  pauseTimer: (taskId: string) => void;
  resetTimer: (taskId: string) => void;
  updateTimer: (taskId: string) => void;
  getTimerProgress: (taskId: string) => number;
  getElapsedTime: (taskId: string) => number;
  isTimerRunning: (taskId: string) => boolean;
  getActiveTimers: () => TimerState[];
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      timers: {},
      
      startTimer: (taskId, duration) => {
        const now = Date.now();
        set((state) => ({
          timers: {
            ...state.timers,
            [taskId]: {
              taskId,
              startTime: now,
              elapsedTime: state.timers[taskId]?.elapsedTime || 0,
              isRunning: true,
              totalDuration: duration,
            },
          },
        }));
      },

      pauseTimer: (taskId) => {
        const timer = get().timers[taskId];
        if (!timer || !timer.isRunning) return;

        const now = Date.now();
        const additionalTime = (now - timer.startTime) / 1000;

        set((state) => ({
          timers: {
            ...state.timers,
            [taskId]: {
              ...timer,
              elapsedTime: timer.elapsedTime + additionalTime,
              isRunning: false,
            },
          },
        }));
      },

      resetTimer: (taskId) => {
        set((state) => {
          const { [taskId]: _, ...remainingTimers } = state.timers;
          return { timers: remainingTimers };
        });
      },

      updateTimer: (taskId) => {
        const timer = get().timers[taskId];
        if (!timer || !timer.isRunning) return;

        const now = Date.now();
        const currentElapsed = timer.elapsedTime + (now - timer.startTime) / 1000;
        
        if (currentElapsed >= timer.totalDuration) {
          // Timer completed
          set((state) => ({
            timers: {
              ...state.timers,
              [taskId]: {
                ...timer,
                elapsedTime: timer.totalDuration,
                isRunning: false,
              },
            },
          }));
        }
      },

      getTimerProgress: (taskId) => {
        const timer = get().timers[taskId];
        if (!timer) return 0;

        let currentElapsed = timer.elapsedTime;
        if (timer.isRunning) {
          currentElapsed += (Date.now() - timer.startTime) / 1000;
        }

        return Math.min((currentElapsed / timer.totalDuration) * 100, 100);
      },

      getElapsedTime: (taskId) => {
        const timer = get().timers[taskId];
        if (!timer) return 0;

        let currentElapsed = timer.elapsedTime;
        if (timer.isRunning) {
          currentElapsed += (Date.now() - timer.startTime) / 1000;
        }

        return currentElapsed;
      },

      isTimerRunning: (taskId) => {
        return get().timers[taskId]?.isRunning || false;
      },

      getActiveTimers: () => {
        const timers = get().timers;
        return Object.values(timers).filter(timer => timer.isRunning);
      },
    }),
    {
      name: 'timecraft-timers',
    }
  )
);