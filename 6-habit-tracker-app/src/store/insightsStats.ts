import type { Habit } from "./habits";
import { addDays, dateKey, lastNDaysKeys } from "./habitStats";

export const totalCheckins = (habits: Habit[]) => {
  let sum = 0;
  for (const h of habits) {
    for (const k in h.checkins) if (h.checkins[k]) sum++;
  }
  return sum;
};

export const completionLastNDays = (
  habits: Habit[],
  n: number,
  end = new Date(),
) => {
  if (habits.length === 0) return 0;
  const keys = lastNDaysKeys(n, end);
  const total = habits.length * n;
  let done = 0;
  for (const h of habits) for (const k of keys) if (h.checkins[k]) done++;
  return Math.round((done / total) * 100);
};

export const dailyTotalsLast7 = (habits: Habit[], end = new Date()) => {
  const keys = lastNDaysKeys(7, end); // oldest -> newest
  return keys.map((k) => ({
    key: k,
    done: habits.reduce((acc, h) => acc + (h.checkins[k] ? 1 : 0), 0),
    total: habits.length,
  }));
};

export const bestDayLast30 = (habits: Habit[], end = new Date()) => {
  if (habits.length === 0) return null;
  let bestKey = "";
  let bestDone = -1;

  for (let i = 0; i < 30; i++) {
    const k = dateKey(addDays(end, -i));
    const done = habits.reduce((acc, h) => acc + (h.checkins[k] ? 1 : 0), 0);
    if (done > bestDone) {
      bestDone = done;
      bestKey = k;
    }
  }
  return { key: bestKey, done: bestDone, total: habits.length };
};

export const habitConsistencyLast30 = (habit: Habit, end = new Date()) => {
  let done = 0;
  for (let i = 0; i < 30; i++) {
    const k = dateKey(addDays(end, -i));
    if (habit.checkins[k]) done++;
  }
  return Math.round((done / 30) * 100);
};
