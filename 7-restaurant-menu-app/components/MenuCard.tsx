import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { MenuItem } from "../data/menu";
import { useCart } from "../store/useCart";
import { useFavorites } from "../store/useFavorites";
import { formatTHB } from "../utils/formatTHB";

type Props = {
  item: MenuItem;
  onPress: () => void;
};

export default function MenuCard({ item, onPress }: Props) {

  const fav = useFavorites((s) => s.favorites.some((x) => x.id === item.id));
  const addFavorite = useFavorites((s) => s.addFavorite);
  const removeFavorite = useFavorites((s) => s.removeFavorite);

  const add = useCart((s) => s.add);


  const toggleFav = () => {
    if (fav) removeFavorite(item.id);
    else
      addFavorite({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      });
  };

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, pressed && s.pressed]}>
      <View style={s.mediaWrap}>
        <Image source={{ uri: item.image }} style={s.image} />
        <View style={s.overlay} />

        <Pressable
          onPress={(e: any) => {
            e?.stopPropagation?.();   // ⭐ ป้องกัน event ทะลุไปการ์ด
            toggleFav();
          }}
          hitSlop={10}
          style={s.heartBtn}
        >
          <Ionicons
            name={fav ? "heart" : "heart-outline"}
            size={18}
            color={fav ? "#ef4444" : "#e2e8f0"}
          />
        </Pressable>


        {item.badge ? (
          <View style={s.badge}>
            <Text style={s.badgeText}>{item.badge}</Text>
          </View>
        ) : null}
      </View>

      <View style={s.body}>
        <Text numberOfLines={1} style={s.name}>
          {item.name}
        </Text>
        <Text numberOfLines={2} style={s.desc}>
          {item.description}
        </Text>

        <View style={s.row}>
          <Text style={s.price}>{formatTHB(item.price)}</Text>

          <View style={s.rowRight}>
            <View style={s.pill}>
              <Text style={s.pillText}>{item.category}</Text>
            </View>

            <Pressable
              onPress={() =>
                add({ id: item.id, name: item.name, price: item.price, image: item.image })
              }
              style={({ pressed }) => [s.addBtn, pressed && { opacity: 0.9 }]}
              hitSlop={10}
            >
              <Text style={s.addBtnText}>+ Add</Text>
            </Pressable>
          </View>
        </View>

      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },

  mediaWrap: { height: 140, position: "relative" },
  image: { width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2,6,23,0.22)",
  },

  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.55)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.35)",
  },

  badge: {
    position: "absolute",
    left: 10,
    top: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.78)",
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.25)",
  },
  badgeText: { color: "#e2e8f0", fontSize: 12, fontWeight: "600" },

  body: { padding: 12 },
  name: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  desc: { marginTop: 6, fontSize: 12.5, color: "#64748b", lineHeight: 18 },

  row: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { fontSize: 14, fontWeight: "800", color: "#0f172a" },

  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  pillText: { fontSize: 12, color: "#334155", fontWeight: "600" },

  rowRight: { flexDirection: "row", alignItems: "center", gap: 8 },

  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#0f172a",
  },
  addBtnText: { color: "#ffffff", fontWeight: "800", fontSize: 12.5 },

});
