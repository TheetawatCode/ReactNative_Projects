import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { type } from "../theme/typography";
import { formatTHB } from "../utils/formatTHB";
import type { Product } from "../data/products";

type Props = {
  item: Product;
  onPress: () => void;
};

export default function ProductCard({ item, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, pressed && s.pressed]}>
      <Image source={{ uri: item.image }} style={s.image} />
      <View style={s.content}>
        <Text style={s.brand}>{item.brand}</Text>
        <Text style={s.title} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={s.row}>
          <Text style={s.price}>{formatTHB(item.price)}</Text>
          <View style={s.pill}>
            <Text style={s.pillText}>★ {item.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={s.tagRow}>
          {item.tags.slice(0, 2).map((t) => (
            <View key={t} style={s.tag}>
              <Text style={s.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusMd,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  pressed: { transform: [{ scale: 0.99 }], opacity: 0.95 },
  image: { width: "100%", height: 120 },
  content: { padding: spacing.md },
  brand: { ...type.small, color: colors.muted, marginBottom: 4 },
  title: { ...type.body, color: colors.text, fontWeight: "800", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: 16, fontWeight: "900", color: colors.text },
  pill: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: { fontSize: 12, fontWeight: "800", color: colors.primary },
  tagRow: { flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" },
  tag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: { fontSize: 11, fontWeight: "700", color: colors.muted },
});