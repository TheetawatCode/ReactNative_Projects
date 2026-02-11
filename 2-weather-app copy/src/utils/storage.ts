import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_LAST_CITY = "weather:lastCity";

export async function saveLastCity(city: string) {
  await AsyncStorage.setItem(KEY_LAST_CITY, city);
}

export async function loadLastCity(): Promise<string | null> {
  return AsyncStorage.getItem(KEY_LAST_CITY);
} 

const KEY_THEME_MODE = "weather:themeMode";
type ThemeMode = "light" | "dark";

export async function saveThemeMode(mode: ThemeMode) {
  await AsyncStorage.setItem(KEY_THEME_MODE, mode);
}

export async function loadThemeMode(): Promise<ThemeMode | null> {
  const v = await AsyncStorage.getItem(KEY_THEME_MODE);
  return v === "dark" || v === "light" ? v : null;
}