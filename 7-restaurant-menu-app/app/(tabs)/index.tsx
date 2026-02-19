import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import MenuCard from "../../components/MenuCard";
import { CATEGORIES, MENU } from "../../data/menu";

export default function MenuScreen() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number] | "All">("All");

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
    <View style={s.screen}>
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
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <MenuCard
              item={item}
              onPress={() => router.push(`/menu/${item.id}`)}
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
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f8fafc" },

  header: { paddingTop: 14, paddingHorizontal: 16, paddingBottom: 10 },
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

  list: { paddingHorizontal: 16, paddingBottom: 18, gap: 12 },

  empty: { padding: 20, alignItems: "center" },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  emptyText: { marginTop: 6, color: "#64748b" },
});
