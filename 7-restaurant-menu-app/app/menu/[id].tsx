import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useRef } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast, type ToastHandle } from "../../components/Toast";
import { MENU } from "../../data/menu";
import { useCart } from "../../store/useCart";
import { formatTHB } from "../../utils/formatTHB";


export default function MenuDetailScreen() {
  const toastRef = useRef<ToastHandle>(null);

  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();

  // expo-router param อาจเป็น string[] ได้
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const item = useMemo(() => MENU.find((x) => x.id === id), [id]);

  const add = useCart((s) => s.add);

  const onAdd = () => {
    if (!item) return;
    add({ id: item.id, name: item.name, price: item.price, image: item.image });
    toastRef.current?.show("Added ✓");
  };

  const qty = useCart((s) => (id ? s.items[id]?.qty ?? 0 : 0));
  const inc = useCart((s) => s.inc);
  const dec = useCart((s) => s.dec);


  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: item ? item.name : "Menu",
          headerTitleStyle: { fontWeight: "800" },
          headerTitleAlign: "center",

          // ✅ ทำปุ่ม Back เอง (ไม่โชว์ (tabs))
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={({ pressed }) => [
                {
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  backgroundColor: "#f1f5f9",
                  alignItems: "center",
                  justifyContent: "center",
                },
                pressed && { opacity: 0.85 },
              ]}
            >
              <Ionicons name="chevron-back" size={20} color="#0f172a" />
            </Pressable>
          ),

        }}
      />

      {!item ? (
        <View style={s.center}>
          <Text style={s.notFoundTitle}>Item not found</Text>
          <Pressable onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={18} color="#0f172a" />
            <Text style={s.backBtnText}>Back</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <Image source={{ uri: item.image }} style={s.hero} />

          <View style={s.body}>
            <Text style={s.name}>{item.name}</Text>
            <Text style={s.desc}>{item.description}</Text>

            <View style={s.row}>
              <Text style={s.price}>{formatTHB(item.price)}</Text>

              {qty === 0 ? (
                <Pressable
                  onPress={onAdd}
                  hitSlop={10}
                  style={({ pressed }) => [s.addBtn, pressed && { opacity: 0.92 }]}
                >
                  <Text style={s.addBtnText}>+ Add to cart</Text>
                </Pressable>
              ) : (
                <View style={s.qtyControl}>
                  <Pressable
                    onPress={() => dec(item.id)}
                    hitSlop={10}
                    style={({ pressed }) => [s.qtyBtn, pressed && { opacity: 0.85 }]}
                  >
                    <Ionicons name="remove" size={16} color="#0f172a" />
                  </Pressable>

                  <Text style={s.qtyText}>{qty}</Text>

                  <Pressable
                    onPress={() => inc(item.id)}
                    hitSlop={10}
                    style={({ pressed }) => [s.qtyBtn, pressed && { opacity: 0.85 }]}
                  >
                    <Ionicons name="add" size={16} color="#0f172a" />
                  </Pressable>
                </View>
              )}

            </View>

          </View>
        </>
      )}
      <Toast ref={toastRef} top={260} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#ffffff" },

  hero: { width: "100%", height: 320, backgroundColor: "#e2e8f0" },

  body: { paddingHorizontal: 16, paddingTop: 16, gap: 10 },
  name: { fontSize: 28, fontWeight: "900", color: "#0f172a" },
  desc: { color: "#64748b", fontSize: 14.5, lineHeight: 20 },

  row: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  price: { fontSize: 22, fontWeight: "900", color: "#0f172a" },

  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#0f172a",
    minWidth: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { color: "#ffffff", fontWeight: "900" },

  backLink: { marginTop: 10, alignSelf: "flex-start" },
  backLinkText: { color: "#0f172a", fontWeight: "800" },

  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundTitle: { fontSize: 18, fontWeight: "900", color: "#0f172a" },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  backBtnText: { fontWeight: "900", color: "#0f172a" },

  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },

  qtyText: {
    minWidth: 20,
    textAlign: "center",
    fontWeight: "900",
    color: "#0f172a",
    fontSize: 16,
  },

});
