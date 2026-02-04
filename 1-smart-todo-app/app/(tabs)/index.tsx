import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useTodoStore } from "../../src/store/todoStore";

export default function TodoScreen() {
  const { todos, toggleTodo } = useTodoStore();

  return (
    <View style={s.container}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={s.empty}>No tasks yet</Text>}
        contentContainerStyle={todos.length === 0 ? { flex: 1, justifyContent: "center" } : undefined}
        renderItem={({ item }) => (
          <Pressable onPress={() => toggleTodo(item.id)} style={s.card}>
            <Text style={[s.todoText, item.done && s.done]}>{item.title}</Text>
            <Text>{item.done ? "✅" : "⬜️"}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0B1220" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "#0F172A",
    borderRadius: 14,
    marginBottom: 10,
  },
  todoText: { color: "white", fontSize: 16, fontWeight: "700" },
  done: { textDecorationLine: "line-through", color: "#64748B" },
  empty: { color: "#94A3B8", textAlign: "center", fontWeight: "600" },
});
