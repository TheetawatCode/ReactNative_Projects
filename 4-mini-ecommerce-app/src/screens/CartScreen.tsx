import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Image } from "react-native";
import { useCart } from "../store/cart";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { RootTabParamList } from "../navigation/types";

type CartTabNavProp = BottomTabNavigationProp<RootTabParamList, "CartTab">;

export default function CartScreen() {
  const navigation = useNavigation<CartTabNavProp>();
  const { itemsArray, total, inc, dec, remove, clear } = useCart();

  if (itemsArray.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Cart</Text>
        <Text style={styles.sub}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={itemsArray}
        keyExtractor={(it) => it.product.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.product.image }} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.name}>
                {item.product.title}
              </Text>
              <Text style={styles.price}>${item.product.price}</Text>

              <View style={styles.qtyRow}>
                <Pressable style={styles.qtyBtn} onPress={() => dec(item.product.id)}>
                  <Text style={styles.qtyText}>-</Text>
                </Pressable>
                <Text style={styles.qty}>{item.qty}</Text>
                <Pressable style={styles.qtyBtn} onPress={() => inc(item.product.id)}>
                  <Text style={styles.qtyText}>+</Text>
                </Pressable>

                <Pressable style={styles.removeBtn} onPress={() => remove(item.product.id)}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        <Pressable style={styles.clearBtn} onPress={clear}>
          <Text style={styles.clearText}>Clear Cart</Text>
        </Pressable>
        <Pressable
          style={styles.checkoutBtn}
          onPress={() => {
            navigation.navigate("HomeTab", {
              screen: "Checkout",
            });
          }}
        >
          <Text style={styles.checkoutText}>Go to Checkout</Text>
        </Pressable>
      </View>
    </View>


  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  container: { flex: 1 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 6 },
  sub: { opacity: 0.7 },

  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    gap: 12,
  },
  thumb: { width: 56, height: 56, resizeMode: "contain" },
  name: { fontWeight: "700", marginBottom: 4 },
  price: { fontWeight: "800", color: "#2e7d32" },

  qtyRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  qty: { width: 24, textAlign: "center", fontWeight: "700" },

  removeBtn: { marginLeft: "auto" },
  removeText: { color: "#b00020", fontWeight: "700" },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  total: { fontSize: 18, fontWeight: "900", marginBottom: 10 },
  clearBtn: {
    backgroundColor: "#111",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  clearText: { color: "#fff", fontWeight: "800" },

  checkoutBtn: {
    backgroundColor: "#2e7d32",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  checkoutText: { color: "#fff", fontWeight: "900" },
});
