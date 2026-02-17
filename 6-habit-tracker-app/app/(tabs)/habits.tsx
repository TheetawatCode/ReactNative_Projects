import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import GlassCard from "../../src/components/GlassCard";
import PrimaryButton from "../../src/components/PrimaryButton";
import { useHabits } from "../../src/store/habits";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";

export default function HabitsScreen() {
  const habits = useHabits((s) => s.habits);
  const removeHabit = useHabits((s) => s.removeHabit);

  const confirmDelete = (id: string, title: string) => {
    Alert.alert("Delete habit?", title, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          removeHabit(id);
        },
      },
    ]);
  };

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View>
            <Text style={s.kicker}>Manage</Text>
            <Text style={s.h1}>Habits</Text>
          </View>

          <Pressable
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/modal");
            }}
            style={({ pressed }) => [s.fab, pressed && { opacity: 0.92 }]}
          >
            <Text style={s.fabText}>＋</Text>
          </Pressable>
        </View>

        {habits.length === 0 ? (
          <GlassCard>
            <Text style={s.emptyTitle}>No habits yet</Text>
            <Text style={s.emptySub}>
              Add your first habit and set a weekly goal.
            </Text>
            <PrimaryButton title="+ Add Habit" onPress={() => router.push("/modal")} style={{ marginTop: 14 }} />
          </GlassCard>
        ) : (
          <View style={{ gap: 12 }}>
            {habits.map((h) => (
              <Pressable
                key={h.id}
                onLongPress={() => confirmDelete(h.id, h.title)}
                style={({ pressed }) => [s.item, pressed && { opacity: 0.95 }]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={s.itemTitle}>{h.title}</Text>
                  <Text style={s.itemSub}>Weekly goal: {h.weeklyGoal} days</Text>
                </View>

                <View style={s.badge}>
                  <Text style={s.badgeText}>{h.weeklyGoal}/7</Text>
                </View>
              </Pressable>
            ))}

            <Text style={s.tip}>
              Pro tip: Long-press a habit to delete. (Next step: edit + reorder)
            </Text>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, paddingTop: 18 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  kicker: { color: colors.muted, fontWeight: "800", letterSpacing: 0.5 },
  h1: { color: colors.text, fontSize: 28, fontWeight: "900", marginTop: 6 },

  fab: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(110,168,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(110,168,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  fabText: { color: colors.primary, fontSize: 22, fontWeight: "900" },

  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card2,
    borderRadius: spacing.r,
    padding: spacing.l,
    borderWidth: 1,
    borderColor: colors.line,
  },
  itemTitle: { color: colors.text, fontSize: 16, fontWeight: "900" },
  itemSub: { color: colors.muted, marginTop: 4, fontWeight: "700" },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(110,168,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(110,168,255,0.35)",
  },
  badgeText: { color: colors.primary, fontWeight: "900" },

  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: "900" },
  emptySub: { color: colors.muted, marginTop: 8, lineHeight: 18 },

  tip: { color: colors.muted, marginTop: 8, lineHeight: 18 },
});
