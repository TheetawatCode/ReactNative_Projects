import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";

export default function InsightsScreen() {
  return (
    <View style={s.container}>
      <View style={s.card}>
        <Text style={s.title}>Insights</Text>
        <Text style={s.sub}>
          Summary metrics + charts will live here. (Next step: weekly consistency, best streak, trend)
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.xl },
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.r,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.line,
  },
  title: { color: colors.text, fontSize: 22, fontWeight: "900" },
  sub: { color: colors.muted, marginTop: 8, lineHeight: 18 },
});
