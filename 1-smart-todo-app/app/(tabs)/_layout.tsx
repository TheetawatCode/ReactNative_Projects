import { Tabs, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "left",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Smart Todo",
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/modal")}
              hitSlop={12}
              style={{
                marginRight: 12,
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#2563EB",
              }}
            >
              <Text style={{ color: "white", fontSize: 26, marginTop: -2 }}>
                ＋
              </Text>
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
