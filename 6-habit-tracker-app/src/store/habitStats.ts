import type { Habit } from "./habits";

export const dateKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const addDays = (d: Date, diff: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + diff);
  return x;
};

export const lastNDaysKeys = (n: number, end = new Date()) => {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(dateKey(addDays(end, -i)));
  return out;
};

export const streakFrom = (habit: Habit, end = new Date()) => {
  // count consecutive days completed ending today
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const k = dateKey(addDays(end, -i));
    if (habit.checkins[k]) streak++;
    else break;
  }
  return streak;
};

export const bestStreakFrom = (habit: Habit) => {
  // compute best streak from checkin keys
  const keys = Object.keys(habit.checkins)
    .filter((k) => habit.checkins[k])
    .sort();
  if (keys.length === 0) return 0;

  let best = 1;
  let cur = 1;

  const toDate = (k: string) => new Date(k + "T00:00:00");
  for (let i = 1; i < keys.length; i++) {
    const prev = toDate(keys[i - 1]);
    const now = toDate(keys[i]);
    const diffDays = Math.round((now.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      cur++;
      best = Math.max(best, cur);
    } else {
      cur = 1;
    }
  }
  return best;
};

export const completionRateLast7 = (habit: Habit, end = new Date()) => {
  const keys = lastNDaysKeys(7, end);
  let done = 0;
  for (const k of keys) if (habit.checkins[k]) done++;
  return Math.round((done / 7) * 100);
};

export const overallCompletionLast7 = (habits: Habit[], end = new Date()) => {
  if (habits.length === 0) return 0;
  const keys = lastNDaysKeys(7, end);
  const total = habits.length * 7;
  let done = 0;
  for (const h of habits) for (const k of keys) if (h.checkins[k]) done++;
  return Math.round((done / total) * 100);
};
