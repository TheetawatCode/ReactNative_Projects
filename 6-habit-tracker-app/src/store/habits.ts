import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Habit = {
  id: string;
  title: string;
  weeklyGoal: number; // 1-7
  createdAt: string; // ISO
  checkins: Record<string, boolean>; // key = yyyy-mm-dd
};

type State = {
  habits: Habit[];
  addHabit: (title: string, weeklyGoal: number) => void;
  toggleCheckin: (habitId: string, dateKey: string) => void;
  removeHabit: (habitId: string) => void;
  seedIfEmpty: () => void;
};

const uid = () => Math.random().toString(36).slice(2, 10);

export const dateKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const useHabits = create<State>()(
  persist(
    (set, get) => ({
      habits: [],

      addHabit: (title, weeklyGoal) =>
        set((s) => ({
          habits: [
            {
              id: uid(),
              title: title.trim() || "New Habit",
              weeklyGoal: Math.min(7, Math.max(1, weeklyGoal)),
              createdAt: new Date().toISOString(),
              checkins: {},
            },
            ...s.habits,
          ],
        })),

      toggleCheckin: (habitId, dKey) =>
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== habitId) return h;
            const current = !!h.checkins[dKey];
            return { ...h, checkins: { ...h.checkins, [dKey]: !current } };
          }),
        })),

      removeHabit: (habitId) =>
        set((s) => ({ habits: s.habits.filter((h) => h.id !== habitId) })),

      seedIfEmpty: () => {
        if (get().habits.length > 0) return;
        set({
          habits: [
            {
              id: uid(),
              title: "Drink Water",
              weeklyGoal: 5,
              createdAt: new Date().toISOString(),
              checkins: {},
            },
            {
              id: uid(),
              title: "Read 10 pages",
              weeklyGoal: 4,
              createdAt: new Date().toISOString(),
              checkins: {},
            },
          ],
        });
      },
    }),
    {
      name: "habit-tracker-v1",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
