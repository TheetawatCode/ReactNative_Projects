import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_FAVORITES = "weather:favorites";

export async function loadFavorites(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY_FAVORITES);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.filter((x) => typeof x === "string");
    return [];
  } catch {
    return [];
  }
}

export async function saveFavorites(cities: string[]) {
  // unique + trim
  const cleaned = Array.from(
    new Set(cities.map((c) => c.trim()).filter(Boolean))
  );
  await AsyncStorage.setItem(KEY_FAVORITES, JSON.stringify(cleaned));
}