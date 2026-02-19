import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MENU } from "../../data/menu";
import { useCart } from "../../store/useCart";
import { formatTHB } from "../../utils/formatTHB";

export default function MenuDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const item = useMemo(() => MENU.find((x) => x.id === id), [id]);
  const add = useCart((s) => s.add);

  if (!item) {
    return (
      <View style={s.center}>
        <Text style={s.title}>Item not found</Text>
        <Pressable onPress={() => router.back()} style={s.btn}>
          <Text style={s.btnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <Image source={{ uri: item.image }} style={s.image} />
      <View style={s.body}>
        <Text style={s.name}>{item.name}</Text>
        <Text style={s.desc}>{item.description}</Text>

        <View style={s.row}>
          <Text style={s.price}>{formatTHB(item.price)}</Text>
          <Pressable
            onPress={() => add({ id: item.id, name: item.name, price: item.price, image: item.image })}
            style={s.addBtn}
          >
            <Text style={s.addText}>+ Add to cart</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>Back</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#ffffff" },
  image: { width: "100%", height: 280, backgroundColor: "#e2e8f0" },
  body: { padding: 16 },
  name: { fontSize: 22, fontWeight: "900", color: "#0f172a" },
  desc: { marginTop: 8, color: "#64748b", lineHeight: 20 },
  row: { marginTop: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  price: { fontSize: 18, fontWeight: "900", color: "#0f172a" },
  addBtn: { backgroundColor: "#0f172a", paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14 },
  addText: { color: "#fff", fontWeight: "900" },
  backBtn: { marginTop: 16, paddingVertical: 10, alignSelf: "flex-start" },
  backText: { color: "#0f172a", fontWeight: "800" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 16 },
  title: { fontSize: 18, fontWeight: "900", color: "#0f172a" },
  btn: { backgroundColor: "#0f172a", paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14 },
  btnText: { color: "#fff", fontWeight: "900" },
});
