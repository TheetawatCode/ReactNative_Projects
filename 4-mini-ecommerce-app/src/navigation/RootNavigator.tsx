import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import { Text } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Shop" }} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
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
            tabBarIcon: ({ focused }) => (
              <Text>{focused ? "🏠" : "🏚️"}</Text>
            ),
          }}
        />
        <Tab.Screen
          name="CartTab"
          component={CartScreen}
          options={{
            title: "Cart",
            tabBarIcon: ({ focused }) => (
              <Text>{focused ? "🛒" : "🛍️"}</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
