import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import GlassCard from "../../src/components/GlassCard";
import WeekBars from "../../src/components/WeekBars";
import { useHabits } from "../../src/store/habits";
import {
  bestDayLast30,
  completionLastNDays,
  dailyTotalsLast7,
  habitConsistencyLast30,
  totalCheckins,
} from "../../src/store/insightsStats";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";

export default function InsightsScreen() {
  const habits = useHabits((s) => s.habits);

  const kpi30 = useMemo(() => completionLastNDays(habits, 30), [habits]);
  const checkins = useMemo(() => totalCheckins(habits), [habits]);
  const bestDay = useMemo(() => bestDayLast30(habits), [habits]);
  const week = useMemo(() => dailyTotalsLast7(habits), [habits]);

  const topHabits = useMemo(() => {
    return [...habits]
      .map((h) => ({
        id: h.id,
        title: h.title,
        goal: h.weeklyGoal,
        consistency: habitConsistencyLast30(h),
      }))
      .sort((a, b) => b.consistency - a.consistency)
      .slice(0, 5);
  }, [habits]);

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.kicker}>Analytics</Text>
        <Text style={s.h1}>Insights</Text>

        {/* KPI */}
        <View style={s.grid}>
          <View style={s.kpiCard}>
            <Text style={s.kpiLabel}>Consistency (30d)</Text>
            <Text style={s.kpiValue}>
              {kpi30}
              <Text style={s.kpiUnit}>%</Text>
            </Text>
            <Text style={s.kpiHint}>Overall completion rate.</Text>
          </View>

          <View style={s.kpiCard}>
            <Text style={s.kpiLabel}>Total Check-ins</Text>
            <Text style={s.kpiValue}>{checkins}</Text>
            <Text style={s.kpiHint}>All-time completed actions.</Text>
          </View>
        </View>

        {/* Best Day */}
        <GlassCard style={{ marginTop: 12, padding: spacing.l }}>
          <Text style={s.sectionTitle}>Best Day (last 30)</Text>

          {bestDay ? (
            <View style={s.bestRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.bestKey}>{bestDay.key}</Text>
                <Text style={s.bestSub}>Highest daily completion</Text>
              </View>

              <View style={s.pill}>
                <Text style={s.pillText}>
                  {bestDay.done}/{bestDay.total}
                </Text>
                <Text style={s.pillSub}>done</Text>
              </View>
            </View>
          ) : (
            <Text style={s.muted}>Create habits to generate insights.</Text>
          )}
        </GlassCard>

        {/* Week Chart */}
        <GlassCard style={{ marginTop: 12, padding: spacing.l }}>
          <Text style={s.sectionTitle}>Last 7 Days</Text>
          <Text style={s.sectionSub}>Daily check-ins across all habits</Text>
          <WeekBars data={week} />
        </GlassCard>

        {/* Top Habits */}
        <GlassCard style={{ marginTop: 12, padding: spacing.l }}>
          <Text style={s.sectionTitle}>Top Habits (30d)</Text>
          <Text style={s.sectionSub}>Sorted by consistency</Text>

          {topHabits.length === 0 ? (
            <Text style={[s.muted, { marginTop: 10 }]}>No data yet.</Text>
          ) : (
            <View style={{ marginTop: 12, gap: 10 }}>
              {topHabits.map((h, idx) => (
                <View key={h.id} style={s.rankRow}>
                  <Text style={s.rank}>{idx + 1}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.rankTitle}>{h.title}</Text>
                    <Text style={s.rankSub}>Goal {h.goal}/7 · Consistency {h.consistency}%</Text>
                  </View>
                  <View style={s.badge}>
                    <Text style={s.badgeText}>{h.consistency}%</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </GlassCard>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, paddingTop: 18 },

  kicker: { color: colors.muted, fontWeight: "900", letterSpacing: 0.6 },
  h1: { color: colors.text, fontSize: 28, fontWeight: "900", marginTop: 6 },

  grid: { flexDirection: "row", gap: 12, marginTop: 16 },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: spacing.r,
    padding: spacing.l,
    borderWidth: 1,
    borderColor: colors.line,
  },
  kpiLabel: { color: colors.muted, fontWeight: "900" },
  kpiValue: { color: colors.text, fontSize: 30, fontWeight: "900", marginTop: 8 },
  kpiUnit: { color: colors.muted, fontSize: 18, fontWeight: "900" },
  kpiHint: { color: colors.muted, marginTop: 6, lineHeight: 18 },

  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: "900" },
  sectionSub: { color: colors.muted, marginTop: 6, fontWeight: "800" },

  bestRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 10 },
  bestKey: { color: colors.text, fontSize: 16, fontWeight: "900" },
  bestSub: { color: colors.muted, marginTop: 4, lineHeight: 18 },

  pill: {
    width: 72,
    height: 58,
    borderRadius: 16,
    backgroundColor: "rgba(110,168,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(110,168,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: { color: colors.primary, fontWeight: "900", fontSize: 14 },
  pillSub: { color: colors.muted, fontWeight: "900", marginTop: 2, fontSize: 12 },

  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: spacing.m,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.line,
  },
  rank: {
    width: 26,
    textAlign: "center",
    color: colors.muted,
    fontWeight: "900",
  },
  rankTitle: { color: colors.text, fontWeight: "900" },
  rankSub: { color: colors.muted, marginTop: 4, fontWeight: "800" },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(110,168,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(110,168,255,0.35)",
  },
  badgeText: { color: colors.primary, fontWeight: "900" },

  muted: { color: colors.muted, fontWeight: "800" },
});
