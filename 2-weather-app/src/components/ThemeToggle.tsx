import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import type { AppTheme } from "../theme/theme";
import type { ThemeMode } from "../utils/themeStorage";

type Props = {
  theme: AppTheme;
  mode: ThemeMode;
  onChange: (next: ThemeMode) => void;
};

export default function ThemeToggle({ theme, mode, onChange }: Props) {
  const isDark = mode === "dark";
  const s = makeStyles(theme);

  return (
    <View style={s.row}>
      <Text style={s.label}>Theme</Text>
      <View style={s.right}>
        <Text style={s.modeText}>{isDark ? "Dark" : "Light"}</Text>
        <Switch
          value={isDark}
          onValueChange={(v) => onChange(v ? "dark" : "light")}
        />
      </View>
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
      marginBottom: 6,
    },
    label: { fontWeight: "800", fontSize: 16, color: theme.text },
    right: { flexDirection: "row", alignItems: "center", gap: 10 },
    modeText: { color: theme.subText, fontWeight: "700" },
  });