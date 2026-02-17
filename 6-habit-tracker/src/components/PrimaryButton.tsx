import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
};

export default function PrimaryButton({ title, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.btn, pressed && { opacity: 0.9 }, style]}
    >
      <Text style={s.text}>{title}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    backgroundColor: "rgba(110,168,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(110,168,255,0.35)",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  text: { color: colors.primary, fontWeight: "900", fontSize: 16 },
});
