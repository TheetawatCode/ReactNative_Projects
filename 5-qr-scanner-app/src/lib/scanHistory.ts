import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ScanItem } from "../types/history";

const KEY = "qr_scan_history_v1";

export async function getHistory(): Promise<ScanItem[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ScanItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addHistory(value: string): Promise<ScanItem[]> {
  const current = await getHistory();
  const item: ScanItem = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    value,
    createdAt: Date.now(),
  };

  const next = [item, ...current].slice(0, 50); // เก็บสูงสุด 50 รายการ
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function removeHistory(id: string): Promise<ScanItem[]> {
  const current = await getHistory();
  const next = current.filter((x) => x.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
