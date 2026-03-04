import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type Props = {
  value: number;
  onMinus: () => void;
  onPlus: () => void;
};

export default function QtyStepper({ value, onMinus, onPlus }: Props) {
  return (
    <View style={s.wrap}>
      <Pressable style={s.btnGhost} onPress={onMinus}>
        <Text style={s.btnGhostText}>−</Text>
      </Pressable>

      <Text style={s.value}>{value}</Text>

      <Pressable style={s.btn} onPress={onPlus}>
        <Text style={s.btnText}>+</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  value: { width: 24, textAlign: "center", fontWeight: "900", color: colors.text },
  btn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: "white", fontSize: 18, fontWeight: "900" },
  btnGhost: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  btnGhostText: { color: colors.text, fontSize: 18, fontWeight: "900" },
});