import React, { useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { PRODUCTS } from "../data/products";
import ProductCard from "../components/ProductCard";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { type } from "../theme/typography";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const data = useMemo(() => PRODUCTS, []);

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.title}>Discover</Text>
        <Text style={s.subtitle}>Modern essentials for work & life</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(x) => x.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <ProductCard
              item={item}
              onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { ...type.h1, color: colors.text },
  subtitle: { marginTop: 6, ...type.body, color: colors.muted },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: 12 },
});