import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useMemo } from "react";
import { useCart } from "../../store/useCart";

export default function TabLayout() {
  const itemsObj = useCart((s) => s.items);
  const cartCount = useMemo(
    () => Object.values(itemsObj).reduce((sum, x) => sum + x.qty, 0),
    [itemsObj]
  );

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: "#0f172a",
    }),
    []
  );

  const menuOptions = useMemo(
    () => ({
      title: "Menu",
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="restaurant-outline" size={size} color={color} />
      ),
    }),
    []
  );

  const favoritesOptions = useMemo(
    () => ({
      title: "Favorites",
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="heart-outline" size={size} color={color} />
      ),
    }),
    []
  );

  const cartOptions = useMemo(
    () => ({
      title: "Cart",
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="cart-outline" size={size} color={color} />
      ),
      tabBarBadge: cartCount > 0 ? cartCount : undefined,
    }),
    [cartCount]
  );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={menuOptions} />
      <Tabs.Screen name="favorites" options={favoritesOptions} />
      <Tabs.Screen name="cart" options={cartOptions} />
    </Tabs>
  );
}
