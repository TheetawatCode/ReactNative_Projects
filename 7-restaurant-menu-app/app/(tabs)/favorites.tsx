import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuCard from "../../components/MenuCard";
import { MENU } from "../../data/menu";
import { useFavorites } from "../../store/useFavorites";

export default function FavoritesScreen() {
  const router = useRouter();

  // ✅ ใช้ selector เพื่อ subscribe เฉพาะ favorites (นิ่งกว่า destructure)
  const favorites = useFavorites((s) => s.favorites);

  const items = useMemo(() => {
    const set = new Set(favorites.map((f) => f.id));
    return MENU.filter((m) => set.has(m.id));
  }, [favorites]);

  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <View style={s.header}>
        <Text style={s.title}>Favorites</Text>
        <Text style={s.subtitle}>Your saved picks</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        numColumns={2}
        columnWrapperStyle={s.row}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <MenuCard
              item={item}
              onPress={() =>
                router.push({ pathname: "/menu/[id]", params: { id: item.id } })
              }
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyTitle}>No favorites yet</Text>
            <Text style={s.emptyText}>Tap the heart on any menu item.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f8fafc" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 10, // ✅ SafeAreaView จัด top ให้แล้ว เลยลดลงนิดนึง
    paddingBottom: 10,
  },
  title: { fontSize: 26, fontWeight: "800", color: "#0f172a" },
  subtitle: { marginTop: 4, color: "#64748b" },

  row: { gap: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 18, gap: 12 },

  empty: { padding: 20, alignItems: "center" },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  emptyText: { marginTop: 6, color: "#64748b" },
});
