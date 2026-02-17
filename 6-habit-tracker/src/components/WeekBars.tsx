import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type DayStat = { key: string; done: number; total: number };

const dayLabel = (key: string) => {
  const d = new Date(key + "T00:00:00");
  return ["S", "M", "T", "W", "T", "F", "S"][d.getDay()];
};

export default function WeekBars({ data }: { data: DayStat[] }) {
  return (
    <View style={{ marginTop: 10, gap: 10 }}>
      {data.map((d) => {
        const pct = d.total === 0 ? 0 : Math.round((d.done / d.total) * 100);
        return (
          <View key={d.key} style={s.row}>
            <Text style={s.day}>{dayLabel(d.key)}</Text>

            <View style={s.barTrack}>
              <View style={[s.barFill, { width: `${pct}%` }]} />
            </View>

            <Text style={s.value}>
              {d.done}/{d.total}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  day: { width: 18, color: colors.muted, fontWeight: "900" },

  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "rgba(110,168,255,0.55)", // business blue
  },
  value: { width: 46, textAlign: "right", color: colors.muted, fontWeight: "900" },
});
