import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import MenuCard from "../../components/MenuCard";
import { CATEGORIES, MENU } from "../../data/menu";
import { useCart } from "../../store/useCart";
import { formatTHB } from "../../utils/formatTHB";

export default function MenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number] | "All">("All");

  // ✅ subscribe แบบนิ่ง (primitive + memo)
  const itemsObj = useCart((s) => s.items);
  const items = useMemo(() => Object.values(itemsObj), [itemsObj]);

  const itemCount = useMemo(
    () => items.reduce((sum, x) => sum + x.qty, 0),
    [items]
  );

  const cartTotal = useMemo(
    () => items.reduce((sum, x) => sum + x.price * x.qty, 0),
    [items]
  );

  const data = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return MENU.filter((x) => {
      const okCat = cat === "All" ? true : x.category === cat;
      const okQ =
        qq.length === 0
          ? true
          : (x.name + " " + x.description).toLowerCase().includes(qq);
      return okCat && okQ;
    });
  }, [q, cat]);

  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <View style={s.header}>
        <Text style={s.title}>Bistro Menu</Text>
        <Text style={s.subtitle}>Modern dining • curated picks</Text>

        <View style={s.searchWrap}>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search dishes, drinks..."
            placeholderTextColor="#94a3b8"
            style={s.search}
          />
        </View>

        <FlatList
          data={["All", ...CATEGORIES]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(x) => x}
          contentContainerStyle={s.chips}
          renderItem={({ item }) => {
            const active = item === cat;
            return (
              <Pressable
                onPress={() => setCat(item as any)}
                style={[s.chip, active && s.chipActive]}
                hitSlop={6}
              >
                <Text style={[s.chipText, active && s.chipTextActive]}>{item}</Text>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={(x) => x.id}
        numColumns={2}
        columnWrapperStyle={s.row}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <MenuCard
              item={item}
              onPress={() => router.push({ pathname: "/menu/[id]", params: { id: item.id } })}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyTitle}>No results</Text>
            <Text style={s.emptyText}>Try another keyword or category.</Text>
          </View>
        }
      />

      {itemCount > 0 && (
        <Pressable
          onPress={() => router.push("/(tabs)/cart")}
          style={({ pressed }) => [
            s.cartPreview,
            { bottom: Math.max(14, insets.bottom + 10) }, // ✅ กันทับ tab bar / home indicator
            pressed && { opacity: 0.95 },
          ]}
          hitSlop={10}
        >
          <Text style={s.cartPreviewText}>
            {itemCount} item(s) • {formatTHB(cartTotal)}
          </Text>
          <Text style={s.cartPreviewBtn}>View Cart</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f8fafc" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 10, // ✅ SafeAreaView จัด top แล้ว
    paddingBottom: 10,
    zIndex: 10,
  },
  title: { fontSize: 26, fontWeight: "800", color: "#0f172a" },
  subtitle: { marginTop: 4, color: "#64748b" },

  searchWrap: { marginTop: 14 },
  search: {
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    color: "#0f172a",
  },

  chips: { paddingVertical: 12, gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chipActive: { backgroundColor: "#0f172a", borderColor: "#0f172a" },
  chipText: { color: "#334155", fontWeight: "700", fontSize: 12.5 },
  chipTextActive: { color: "#ffffff" },

  row: { gap: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 120, gap: 12 }, // ✅ เผื่อที่ให้ cartPreview

  empty: { padding: 20, alignItems: "center" },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  emptyText: { marginTop: 6, color: "#64748b" },

  cartPreview: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "#0f172a",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },

  cartPreviewText: { color: "#ffffff", fontWeight: "800", fontSize: 14 },
  cartPreviewBtn: { color: "#ffffff", fontWeight: "900" },
});
