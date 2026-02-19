import { Ionicons } from "@expo/vector-icons";
import React, { useImperativeHandle, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type ToastHandle = {
  show: (message: string) => void;
};

type Props = {
  top?: number; // เผื่ออยากขยับตำแหน่ง
};

export const Toast = React.forwardRef<ToastHandle, Props>(function Toast(
  { top = 10 },
  ref
) {
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  const show = (message: string) => {
    setMsg(message);

    if (timer.current) clearTimeout(timer.current);

    // reset
    opacity.setValue(0);
    translateY.setValue(-10);

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 140, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 6 }),
    ]).start();

    timer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -10, duration: 160, useNativeDriver: true }),
      ]).start(() => setMsg(""));
    }, 1200);
  };

  useImperativeHandle(ref, () => ({ show }), [show]);

  const visible = useMemo(() => msg.length > 0, [msg]);

  if (!visible) return null;

  return (
    <SafeAreaView pointerEvents="none" style={[s.wrap, { top }]}>
      <Animated.View style={[s.toast, { opacity, transform: [{ translateY }] }]}>
        <View style={s.icon}>
          <Ionicons name="checkmark" size={16} color="#0f172a" />
        </View>
        <Text style={s.text} numberOfLines={1}>
          {msg}
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
});

const s = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.12)",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  icon: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: "#0f172a", fontWeight: "800" },
});
