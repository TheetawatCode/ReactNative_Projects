import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { type } from "../theme/typography";
import { useCart } from "../store/cart";
import { formatTHB } from "../utils/formatTHB";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type CartStackParamList = {
  CartMain: undefined;
  Checkout: undefined;
};
type Props = NativeStackScreenProps<CartStackParamList, "Checkout">;

export default function CheckoutScreen({ navigation }: Props) {
  const items = useCart((s) => s.itemsArray());
  const total = useCart((s) => s.total());
  const clear = useCart((s) => s.clear);

  const placeOrder = () => {
    Alert.alert("Order placed!", "This is a mock checkout. Thank you!", [
      {
        text: "OK",
        onPress: () => {
          clear();
          navigation.popToTop(); // กลับ CartMain
        },
      },
    ]);
  };

  return (
    <View style={s.screen}>
      <View style={s.card}>
        <Text style={s.title}>Order Summary</Text>

        <View style={s.row}>
          <Text style={s.label}>Items</Text>
          <Text style={s.value}>{items.length}</Text>
        </View>

        <View style={s.row}>
          <Text style={s.label}>Shipping</Text>
          <Text style={s.value}>Free</Text>
        </View>

        <View style={s.divider} />

        <View style={s.row}>
          <Text style={s.totalLabel}>Total</Text>
          <Text style={s.totalValue}>{formatTHB(total)}</Text>
        </View>

        <Pressable style={s.cta} onPress={placeOrder}>
          <Text style={s.ctaText}>Place Order</Text>
        </Pressable>

        <Text style={s.note}>
          Portfolio note: mock checkout demonstrates complete e-commerce flow & clean UI.
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, justifyContent: "center" },
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  title: { ...type.h1, color: colors.text, marginBottom: spacing.lg },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  label: { ...type.body, color: colors.muted, fontWeight: "700" },
  value: { ...type.body, color: colors.text, fontWeight: "800" },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  totalLabel: { fontSize: 16, fontWeight: "900", color: colors.text },
  totalValue: { fontSize: 18, fontWeight: "900", color: colors.text },

  cta: {
    marginTop: spacing.lg,
    height: 52,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: "white", fontSize: 16, fontWeight: "900" },
  note: { marginTop: 12, ...type.small, color: colors.muted, lineHeight: 18 },
});