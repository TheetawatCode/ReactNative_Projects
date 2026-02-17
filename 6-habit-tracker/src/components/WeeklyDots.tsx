import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  keys: string[]; // last 7 keys
  isDone: (key: string) => boolean;
};

const dayLabel = (key: string) => {
  // key: yyyy-mm-dd
  const d = new Date(key + "T00:00:00");
  return ["S", "M", "T", "W", "T", "F", "S"][d.getDay()];
};

export default function WeeklyDots({ keys, isDone }: Props) {
  return (
    <View style={s.row}>
      {keys.map((k) => {
        const done = isDone(k);
        return (
          <View key={k} style={s.col}>
            <View style={[s.dot, done ? s.dotOn : s.dotOff]} />
            <Text style={s.label}>{dayLabel(k)}</Text>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  col: { alignItems: "center", width: 34 },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  dotOn: {
    backgroundColor: "rgba(53,208,127,0.25)",
    borderColor: "rgba(53,208,127,0.55)",
  },
  dotOff: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.10)",
  },
  label: { color: colors.muted, marginTop: 6, fontWeight: "800", fontSize: 12 },
});
