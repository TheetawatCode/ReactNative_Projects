import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../navigation/types";
import { PRODUCTS } from "../data/products";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { type } from "../theme/typography";
import { formatTHB } from "../utils/formatTHB";
import { useCart } from "../store/cart";

type Props = NativeStackScreenProps<HomeStackParamList, "ProductDetail">;

export default function ProductDetailScreen({ route }: Props) {
  const { productId } = route.params;
  const product = useMemo(() => PRODUCTS.find((x) => x.id === productId), [productId]);
  const add = useCart((s) => s.add);

  if (!product) {
    return (
      <View style={s.center}>
        <Text style={{ color: colors.muted }}>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <Image source={{ uri: product.image }} style={s.hero} />

      <View style={s.content}>
        <Text style={s.brand}>{product.brand}</Text>
        <Text style={s.title}>{product.title}</Text>

        <View style={s.row}>
          <Text style={s.price}>{formatTHB(product.price)}</Text>
          <View style={s.pill}>
            <Text style={s.pillText}>★ {product.rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={s.divider} />

        <Text style={s.sectionTitle}>Highlights</Text>
        <View style={s.tags}>
          {product.tags.map((t) => (
            <View key={t} style={s.tag}>
              <Text style={s.tagText}>{t}</Text>
            </View>
          ))}
        </View>

        <Text style={s.sectionTitle}>Description</Text>
        <Text style={s.desc}>
          Clean design, premium materials, and practical features—built for daily use. This is a mock
          product detail designed to showcase UI/UX and cart flow for your portfolio.
        </Text>

        <Pressable style={s.cta} onPress={() => add(product)}>
          <Text style={s.ctaText}>Add to Cart</Text>
        </Pressable>

        <Text style={s.note}>Tip: HR likes clear flows—Shop → Detail → Cart → Checkout</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  hero: { width: "100%", height: 260 },
  content: { padding: spacing.lg },
  brand: { ...type.small, color: colors.muted, marginBottom: 6 },
  title: { ...type.h1, color: colors.text, marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { fontSize: 20, fontWeight: "900", color: colors.text },
  pill: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pillText: { fontSize: 12, fontWeight: "800", color: colors.primary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  sectionTitle: { ...type.h2, color: colors.text, marginTop: 4, marginBottom: 10 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: spacing.lg },
  tag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  tagText: { fontSize: 12, fontWeight: "700", color: colors.muted },
  desc: { ...type.body, color: colors.muted, lineHeight: 20, marginBottom: spacing.lg },
  cta: {
    height: 52,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  ctaText: { color: "white", fontSize: 16, fontWeight: "900" },
  note: { marginTop: 12, ...type.small, color: colors.muted },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
});