import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly';
export type Category = 'Work' | 'Health' | 'Learning' | 'Personal' | 'Deep Work';

export interface TaskItem {
  id: string;
  title: string;
  category: Category;
  description?: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string; // HH:mm
  duration: number; // minutes
  completed: boolean;
  recurrence: Recurrence;
  createdAt: number;
  updatedAt: number;
}

interface ScheduleState {
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id' | 'createdAt' | 'updatedAt'>) => TaskItem;
  updateTask: (id: string, patch: Partial<TaskItem>) => void;
  removeTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  tasksForDate: (date: string) => TaskItem[];
  progressForDate: (date: string) => { completed: number; total: number; percent: number };
}

function toMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export const useScheduleStore = create<ScheduleState>()(persist((set, get) => ({
  tasks: [],
  addTask: (task) => {
    const id = crypto.randomUUID();
    const now = Date.now();
    const item: TaskItem = { id, createdAt: now, updatedAt: now, ...task };
    set((s) => ({ tasks: [item, ...s.tasks] }));
    return item;
  },
  updateTask: (id, patch) => set((s) => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t) })),
  removeTask: (id) => set((s) => ({ tasks: s.tasks.filter(t => t.id !== id) })),
  toggleComplete: (id) => set((s) => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t) })),
  tasksForDate: (date) => get().tasks.filter(t => t.date === date).sort((a,b) => toMinutes(a.start) - toMinutes(b.start)),
  progressForDate: (date) => {
    const list = get().tasksForDate(date);
    const total = list.length;
    const completed = list.filter(t => t.completed).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percent };
  }
}), { name: 'timecraft-schedule' }));
