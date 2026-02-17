import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import WeeklyDots from "../../src/components/WeeklyDots";
import { useHabits } from "../../src/store/habits";
import {
  bestStreakFrom,
  completionRateLast7,
  dateKey,
  lastNDaysKeys,
  overallCompletionLast7,
  streakFrom,
} from "../../src/store/habitStats";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";

export default function DashboardScreen() {
  const habits = useHabits((s) => s.habits);
  const toggle = useHabits((s) => s.toggleCheckin);
  const seedIfEmpty = useHabits((s) => s.seedIfEmpty);

  useEffect(() => {
    seedIfEmpty();
  }, [seedIfEmpty]);

  const todayKey = dateKey();
  const last7 = useMemo(() => lastNDaysKeys(7), []);

  const todayDone = habits.filter((h) => !!h.checkins[todayKey]).length;
  const todayTotal = habits.length;

  const overall7 = overallCompletionLast7(habits);

  const topHabit = useMemo(() => {
    if (habits.length === 0) return null;
    // pick habit with best current streak
    return [...habits].sort((a, b) => streakFrom(b) - streakFrom(a))[0];
  }, [habits]);

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.kicker}>Today</Text>
        <Text style={s.h1}>Consistency Dashboard</Text>

        {/* KPI Row */}
        <View style={s.grid}>
          <View style={s.card}>
            <Text style={s.cardLabel}>Completed Today</Text>
            <Text style={s.big}>
              {todayDone}
              <Text style={s.bigMuted}> / {todayTotal || 0}</Text>
            </Text>
            <Text style={s.cardHint}>Small wins daily.</Text>
          </View>

          <View style={s.card}>
            <Text style={s.cardLabel}>Overall (7d)</Text>
            <Text style={s.big}>
              {overall7}
              <Text style={s.bigMuted}>%</Text>
            </Text>
            <Text style={s.cardHint}>Completion rate last 7 days.</Text>
          </View>
        </View>

        {/* Spotlight */}
        <View style={s.spotlight}>
          <Text style={s.sectionTitle}>Spotlight</Text>

          {topHabit ? (
            <View style={s.spotRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.spotTitle}>{topHabit.title}</Text>
                <Text style={s.spotSub}>
                  Current streak: <Text style={s.strong}>{streakFrom(topHabit)}</Text> days · Best:{" "}
                  <Text style={s.strong}>{bestStreakFrom(topHabit)}</Text>
                </Text>
              </View>

              <View style={s.pill}>
                <Text style={s.pillText}>{completionRateLast7(topHabit)}%</Text>
                <Text style={s.pillSub}>7d</Text>
              </View>
            </View>
          ) : (
            <Text style={s.muted}>Create a habit to start tracking.</Text>
          )}
        </View>

        {/* Quick Check-in */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Quick Check-in</Text>
          <Text style={s.sectionSub}>{todayKey}</Text>
        </View>

        {habits.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyTitle}>No habits yet</Text>
            <Text style={s.emptySub}>Create your first habit in the Habits tab.</Text>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {habits.map((h) => {
              const doneToday = !!h.checkins[todayKey];
              const streak = streakFrom(h);
              return (
                <View key={h.id} style={s.habitCard}>
                  <View style={s.habitTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.habitTitle}>{h.title}</Text>
                      <Text style={s.habitMeta}>
                        Streak: <Text style={s.strong}>{streak}</Text> · Goal:{" "}
                        <Text style={s.strong}>{h.weeklyGoal}/7</Text>
                      </Text>
                    </View>

                    <Text
                      onPress={async () => {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        toggle(h.id, todayKey);
                      }}
                      style={[s.action, doneToday ? s.actionOn : s.actionOff]}
                    >
                      {doneToday ? "Done" : "Mark"}
                    </Text>
                  </View>

                  <WeeklyDots
                    keys={last7}
                    isDone={(k) => !!h.checkins[k]}
                  />
                </View>
              );
            })}
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

  kicker: { color: colors.muted, fontWeight: "800", letterSpacing: 0.6 },
  h1: { color: colors.text, fontSize: 28, fontWeight: "900", marginTop: 6 },

  grid: { flexDirection: "row", gap: 12, marginTop: 16 },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: spacing.r,
    padding: spacing.l,
    borderWidth: 1,
    borderColor: colors.line,
  },
  cardLabel: { color: colors.muted, fontWeight: "800" },
  big: { color: colors.text, fontSize: 30, fontWeight: "900", marginTop: 8 },
  bigMuted: { color: colors.muted, fontSize: 18, fontWeight: "900" },
  cardHint: { color: colors.muted, marginTop: 6, lineHeight: 18 },

  sectionHeader: { marginTop: 20, flexDirection: "row", justifyContent: "space-between" },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: "900" },
  sectionSub: { color: colors.muted, fontWeight: "800" },

  spotlight: {
    marginTop: 14,
    backgroundColor: colors.card2,
    borderRadius: spacing.r,
    padding: spacing.l,
    borderWidth: 1,
    borderColor: colors.line,
  },
  spotRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 10 },
  spotTitle: { color: colors.text, fontSize: 16, fontWeight: "900" },
  spotSub: { color: colors.muted, marginTop: 4, lineHeight: 18 },
  pill: {
    width: 64,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(110,168,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(110,168,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: { color: colors.primary, fontWeight: "900", fontSize: 16 },
  pillSub: { color: colors.muted, fontWeight: "900", marginTop: 2, fontSize: 12 },

  habitCard: {
    backgroundColor: colors.card2,
    borderRadius: spacing.r,
    padding: spacing.l,
    borderWidth: 1,
    borderColor: colors.line,
  },
  habitTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  habitTitle: { color: colors.text, fontSize: 16, fontWeight: "900" },
  habitMeta: { color: colors.muted, marginTop: 4, fontWeight: "800" },

  action: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    overflow: "hidden",
    fontWeight: "900",
  },
  actionOn: { backgroundColor: "rgba(53,208,127,0.18)", color: colors.success },
  actionOff: { backgroundColor: "rgba(110,168,255,0.16)", color: colors.primary },

  empty: {
    marginTop: 14,
    padding: spacing.xl,
    borderRadius: spacing.r,
    backgroundColor: colors.card2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  emptyTitle: { color: colors.text, fontSize: 16, fontWeight: "900" },
  emptySub: { color: colors.muted, marginTop: 6, lineHeight: 18 },

  strong: { color: colors.text, fontWeight: "900" },
  muted: { color: colors.muted, fontWeight: "800" },
});
