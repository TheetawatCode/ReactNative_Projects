import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_THEME_MODE = "weather:themeMode";

export type ThemeMode = "light" | "dark";

export async function saveThemeMode(mode: ThemeMode) {
  await AsyncStorage.setItem(KEY_THEME_MODE, mode);
}

export async function loadThemeMode(): Promise<ThemeMode | null> {
  const v = await AsyncStorage.getItem(KEY_THEME_MODE);
  if (v === "light" || v === "dark") return v;
  return null;
}