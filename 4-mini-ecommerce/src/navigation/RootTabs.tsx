import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

import type { HomeStackParamList, RootTabParamList } from "./types";
import HomeScreen from "../screens/HomeScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import { useCart } from "../store/cart";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<HomeStackParamList>();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { fontWeight: "800" },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Shop" }} />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: "Product" }}
      />
    </Stack.Navigator>
  );
}

function CartBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View style={s.badge}>
      <Text style={s.badgeText}>{count}</Text>
    </View>
  );
}

export default function RootTabs() {
  const count = useCart((s) => s.count());

  return (
    <Tab.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { fontWeight: "800" },
        tabBarStyle: {
          height: 62,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopColor: colors.border,
          backgroundColor: colors.card,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen
        name="Shop"
        component={HomeStack}
        options={{
          title: "Shop",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="bag-outline" color={color} size={size} />
              <CartBadge count={count} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

type CartStackParamList = {
  CartMain: undefined;
  Checkout: undefined;
};

const CartStackNav = createNativeStackNavigator<CartStackParamList>();

function CartStack() {
  return (
    <CartStackNav.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { fontWeight: "800" },
      }}
    >
      <CartStackNav.Screen name="CartMain" component={CartScreen} options={{ title: "Cart" }} />
      <CartStackNav.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Checkout" }} />
    </CartStackNav.Navigator>
  );
}

const s = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -8,
    top: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "white", fontSize: 11, fontWeight: "800" },
});