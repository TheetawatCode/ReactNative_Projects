import { useCart } from "../store/cart";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";

import type { HomeStackParamList, RootTabParamList } from "./types";
import CheckoutScreen from "../screens/CheckoutScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";



const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<HomeStackParamList>();


function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Shop" }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: "Detail" }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Checkout" }} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { count } = useCart();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: { fontSize: 12 },
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => <Text>{focused ? "🏠" : "🏚️"}</Text>,
          }}
        />

        <Tab.Screen
          name="CartTab"
          component={CartScreen}
          options={{
            title: "Cart",
            tabBarIcon: ({ focused }) => <Text>{focused ? "🛒" : "🛍️"}</Text>,
            tabBarBadge: count > 0 ? count : undefined,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

