import { colors } from "@/src/theme/colors";
import { spacing } from "@/src/theme/spacing";
import React, { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { dateKey, useHabits } from "../../src/store/habits";

function getLast7Keys() {
  const out: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(dateKey(d));
  }
  return out;
}

export default function DashboardScreen() {
  const habits = useHabits((s) => s.habits);
  const toggle = useHabits((s) => s.toggleCheckin);
  const seedIfEmpty = useHabits((s) => s.seedIfEmpty);

  useEffect(() => {
    seedIfEmpty();
  }, [seedIfEmpty]);

  const todayKey = dateKey();
  const last7 = useMemo(() => getLast7Keys(), []);

  const todayDone = habits.filter((h) => !!h.checkins[todayKey]).length;
  const todayTotal = habits.length;

  const completion7 = useMemo(() => {
    const total = habits.length * 7;
    if (total === 0) return 0;
    let done = 0;
    for (const h of habits) {
      for (const k of last7) if (h.checkins[k]) done++;
    }
    return Math.round((done / total) * 100);
  }, [habits, last7]);

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.kicker}>Today</Text>
        <Text style={s.h1}>Consistency Dashboard</Text>

        <View style={s.grid}>
          <View style={s.card}>
            <Text style={s.cardLabel}>Completed Today</Text>
            <Text style={s.big}>
              {todayDone}
              <Text style={s.bigMuted}> / {todayTotal || 0}</Text>
            </Text>
            <Text style={s.cardHint}>Keep it simple. Small wins daily.</Text>
          </View>

          <View style={s.card}>
            <Text style={s.cardLabel}>Last 7 Days</Text>
            <Text style={s.big}>
              {completion7}
              <Text style={s.bigMuted}>%</Text>
            </Text>
            <Text style={s.cardHint}>Overall completion rate.</Text>
          </View>
        </View>

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
          <View style={{ gap: 10 }}>
            {habits.map((h) => {
              const done = !!h.checkins[todayKey];
              return (
                <View key={h.id} style={s.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.rowTitle}>{h.title}</Text>
                    <Text style={s.rowSub}>Weekly goal: {h.weeklyGoal} days</Text>
                  </View>
                  <Text
                    onPress={() => toggle(h.id, todayKey)}
                    style={[s.pill, done ? s.pillOn : s.pillOff]}
                  >
                    {done ? "Done" : "Mark"}
                  </Text>
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
  kicker: { color: colors.muted, fontWeight: "700", letterSpacing: 0.6 },
  h1: { color: colors.text, fontSize: 28, fontWeight: "800", marginTop: 6 },

  grid: { flexDirection: "row", gap: 12, marginTop: 16 },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: spacing.r,
    padding: spacing.l,
    borderWidth: 1,
    borderColor: colors.line,
  },
  cardLabel: { color: colors.muted, fontWeight: "700" },
  big: { color: colors.text, fontSize: 30, fontWeight: "900", marginTop: 8 },
  bigMuted: { color: colors.muted, fontSize: 18, fontWeight: "800" },
  cardHint: { color: colors.muted, marginTop: 6, lineHeight: 18 },

  sectionHeader: { marginTop: 22, flexDirection: "row", justifyContent: "space-between" },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: "800" },
  sectionSub: { color: colors.muted, fontWeight: "700" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.l,
    backgroundColor: colors.card2,
    borderRadius: spacing.r,
    borderWidth: 1,
    borderColor: colors.line,
  },
  rowTitle: { color: colors.text, fontSize: 16, fontWeight: "800" },
  rowSub: { color: colors.muted, marginTop: 4 },

  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    overflow: "hidden",
    fontWeight: "900",
  },
  pillOn: { backgroundColor: "rgba(53,208,127,0.18)", color: colors.success },
  pillOff: { backgroundColor: "rgba(110,168,255,0.16)", color: colors.primary },

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
});
