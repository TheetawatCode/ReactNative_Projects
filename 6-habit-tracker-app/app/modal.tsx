import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useHabits } from "../src/store/habits";
import { colors } from "../src/theme/colors";
import { spacing } from "../src/theme/spacing";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function AddHabitModal() {
  const addHabit = useHabits((s) => s.addHabit);

  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState(4);

  const disabled = useMemo(() => title.trim().length === 0, [title]);

  const onSave = async () => {
    if (disabled) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addHabit(title.trim(), goal);
    router.back();
  };

  return (
    <View style={s.container}>
      <View style={s.sheet}>
        <View style={s.header}>
          <Text style={s.h1}>New Habit</Text>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Text style={s.close}>Close</Text>
          </Pressable>
        </View>

        <Text style={s.label}>Habit name</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Workout, Read, Meditate"
          placeholderTextColor="rgba(168,180,212,0.6)"
          style={s.input}
          autoFocus
          returnKeyType="done"
        />

        <Text style={[s.label, { marginTop: 14 }]}>Weekly goal</Text>
        <View style={s.goalRow}>
          <Pressable
            onPress={() => setGoal((g) => clamp(g - 1, 1, 7))}
            style={({ pressed }) => [s.goalBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={s.goalBtnText}>−</Text>
          </Pressable>

          <View style={s.goalMid}>
            <Text style={s.goalValue}>{goal}</Text>
            <Text style={s.goalSub}>days / week</Text>
          </View>

          <Pressable
            onPress={() => setGoal((g) => clamp(g + 1, 1, 7))}
            style={({ pressed }) => [s.goalBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={s.goalBtnText}>+</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={onSave}
          disabled={disabled}
          style={({ pressed }) => [
            s.save,
            disabled && { opacity: 0.45 },
            pressed && !disabled && { transform: [{ scale: 0.99 }] },
          ]}
        >
          <Text style={s.saveText}>Save Habit</Text>
        </Pressable>

        <Text style={s.hint}>
          Tip: keep habits small. Consistency beats intensity.
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: "flex-end" },

  sheet: {
    backgroundColor: colors.card2,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.line,
    paddingBottom: Platform.OS === "ios" ? 28 : spacing.xl,
  },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  h1: { color: colors.text, fontSize: 20, fontWeight: "900" },
  close: { color: colors.muted, fontWeight: "800" },

  label: { color: colors.muted, marginTop: 12, fontWeight: "800" },
  input: {
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },

  goalRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 10 },
  goalBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  goalBtnText: { color: colors.text, fontSize: 22, fontWeight: "900" },
  goalMid: { flex: 1, alignItems: "center" },
  goalValue: { color: colors.text, fontSize: 24, fontWeight: "900" },
  goalSub: { color: colors.muted, marginTop: 2, fontWeight: "700" },

  save: {
    marginTop: 16,
    backgroundColor: "rgba(110,168,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(110,168,255,0.35)",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  saveText: { color: colors.primary, fontWeight: "900", fontSize: 16 },
  hint: { color: colors.muted, marginTop: 10, lineHeight: 18 },
});
