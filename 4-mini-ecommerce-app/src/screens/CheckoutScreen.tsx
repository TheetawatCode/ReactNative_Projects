import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useCart } from "../store/cart";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { HomeStackParamList, RootTabParamList } from "../navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "Checkout">;

export default function CheckoutScreen({ navigation }: Props) {
  const { itemsArray, total, clear } = useCart();

  const shipping = itemsArray.length > 0 ? 9.99 : 0;
  const grandTotal = total + shipping;

  const placeOrder = () => {
    Alert.alert("Order placed!", "This is a mock checkout. Thank you!", [
      {
        text: "OK",
        onPress: () => {
          // 1️⃣ ล้างตะกร้า (badge จะหายเอง)
          clear();

          // 2️⃣ เด้งกลับ HomeTab → Home
          const tabNav =
            navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();

          tabNav?.navigate("HomeTab", {
            screen: "Home",
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <View style={styles.card}>
        <Text style={styles.h2}>Order Summary</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Items</Text>
          <Text style={styles.value}>{itemsArray.length} products</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>${total.toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Shipping</Text>
          <Text style={styles.value}>${shipping.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ${grandTotal.toFixed(2)}
          </Text>
        </View>

        <Pressable
          style={[
            styles.btn,
            itemsArray.length === 0 && styles.btnDisabled,
          ]}
          onPress={placeOrder}
          disabled={itemsArray.length === 0}
        >
          <Text style={styles.btnText}>Place Order</Text>
        </Pressable>

        <Text style={styles.note}>
          Payment is not real — this is a demo checkout for portfolio.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f6f6f6",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },
  h2: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    opacity: 0.7,
  },
  value: {
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "900",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "900",
  },
  btn: {
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },
  btnDisabled: {
    backgroundColor: "#aaa",
  },
  btnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
  note: {
    marginTop: 10,
    opacity: 0.6,
    fontSize: 12,
  },
});
