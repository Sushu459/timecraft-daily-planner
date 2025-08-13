import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  dailyQuote: string | null;
  streak: number;
  lastCompletedDate: string | null;
  totalTimeSpent: Record<string, number>; // category -> minutes
  setDailyQuote: (quote: string) => void;
  updateStreak: (date: string) => void;
  addTimeSpent: (category: string, minutes: number) => void;
  getWeeklyTimeByCategory: () => Record<string, number>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      dailyQuote: null,
      streak: 0,
      lastCompletedDate: null,
      totalTimeSpent: {},

      setDailyQuote: (quote) => set({ dailyQuote: quote }),

      updateStreak: (date) => {
        const { lastCompletedDate, streak } = get();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastCompletedDate === yesterdayStr) {
          set({ streak: streak + 1, lastCompletedDate: date });
        } else if (lastCompletedDate !== date) {
          set({ streak: 1, lastCompletedDate: date });
        }
      },

      addTimeSpent: (category, minutes) => {
        set((state) => ({
          totalTimeSpent: {
            ...state.totalTimeSpent,
            [category]: (state.totalTimeSpent[category] || 0) + minutes,
          },
        }));
      },

      getWeeklyTimeByCategory: () => {
        // For now, return all-time data. In a real app, you'd filter by week
        return get().totalTimeSpent;
      },
    }),
    {
      name: 'timecraft-app',
    }
  )
);