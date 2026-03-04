import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { type } from "../theme/typography";
import { useCart } from "../store/cart";
import QtyStepper from "../components/QtyStepper";
import { formatTHB } from "../utils/formatTHB";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type CartStackParamList = {
  CartMain: undefined;
  Checkout: undefined;
};
type Props = NativeStackScreenProps<CartStackParamList, "CartMain">;

export default function CartScreen({ navigation }: Props) {
  const itemsArray = useCart((s) => s.itemsArray());
  const total = useCart((s) => s.total());
  const add = useCart((s) => s.add);
  const decrease = useCart((s) => s.decrease);
  const remove = useCart((s) => s.remove);

  if (itemsArray.length === 0) {
    return (
      <View style={s.empty}>
        <Text style={s.emptyTitle}>Your cart is empty</Text>
        <Text style={s.emptySub}>Add items from the Shop tab.</Text>
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <FlatList
        data={itemsArray}
        keyExtractor={(x) => x.product.id}
        contentContainerStyle={{ padding: spacing.lg, gap: 12, paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={{ flex: 1 }}>
              <Text style={s.brand}>{item.product.brand}</Text>
              <Text style={s.title} numberOfLines={2}>
                {item.product.title}
              </Text>
              <Text style={s.price}>{formatTHB(item.product.price)}</Text>
            </View>

            <View style={{ alignItems: "flex-end", gap: 10 }}>
              <QtyStepper
                value={item.qty}
                onMinus={() => decrease(item.product.id)}
                onPlus={() => add(item.product)}
              />
              <Pressable
                onPress={() =>
                  Alert.alert("Remove item?", "This will remove it from your cart.", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Remove", style: "destructive", onPress: () => remove(item.product.id) },
                  ])
                }
              >
                <Text style={s.remove}>Remove</Text>
              </Pressable>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      <View style={s.footer}>
        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Total</Text>
          <Text style={s.totalValue}>{formatTHB(total)}</Text>
        </View>

        <Pressable style={s.cta} onPress={() => navigation.navigate("Checkout")}>
          <Text style={s.ctaText}>Proceed to Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    flexDirection: "row",
    gap: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  brand: { ...type.small, color: colors.muted, marginBottom: 4 },
  title: { ...type.body, color: colors.text, fontWeight: "800", marginBottom: 8 },
  price: { fontSize: 14, fontWeight: "900", color: colors.text },

  remove: { color: colors.danger, fontWeight: "800" },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { ...type.body, color: colors.muted, fontWeight: "700" },
  totalValue: { fontSize: 18, fontWeight: "900", color: colors.text },

  cta: {
    marginTop: 12,
    height: 52,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: "white", fontSize: 16, fontWeight: "900" },

  empty: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg, padding: spacing.xl },
  emptyTitle: { ...type.h2, color: colors.text },
  emptySub: { marginTop: 8, ...type.body, color: colors.muted, textAlign: "center" },
});