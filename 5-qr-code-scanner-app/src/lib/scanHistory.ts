import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ScanItem } from "../types/history";

const KEY = "qr_scan_history_v1";

export async function loadHistory(): Promise<ScanItem[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScanItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveHistory(items: ScanItem[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function addHistory(value: string): Promise<ScanItem[]> {
  const items = await loadHistory();
  const newItem: ScanItem = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    value,
    createdAt: Date.now(),
  };
  const next = [newItem, ...items].slice(0, 50);
  await saveHistory(next);
  return next;
}

export async function clearHistory() {
  await AsyncStorage.removeItem(KEY);
}
