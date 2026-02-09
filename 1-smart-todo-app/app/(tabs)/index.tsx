import { useTodoStore } from "@src/store/todoStore";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "DONE" | "HIGH">("ALL");

export default function TodoScreen() {
  const { todos, toggleTodo, removeTodo, clearAll } = useTodoStore();
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "DONE" | "HIGH">("ALL");

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case "ACTIVE":
        return todos.filter((t) => !t.done);
      case "DONE":
        return todos.filter((t) => t.done);
      case "HIGH":
        return todos.filter((t) => t.priority === "HIGH");
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <View style={s.container}>
      {/* FILTER BAR */}
      <View style={s.filters}>
        {(["ALL", "ACTIVE", "DONE", "HIGH"] as const).map((f) => {
          const active = f === filter;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[s.filterPill, active && s.filterPillActive]}
            >
              <Text style={[s.filterText, active && s.filterTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={s.actions}>
        <Pressable onPress={clearAll} style={s.clearBtn}>
          <Text style={s.clearText}>Clear All</Text>
        </Pressable>
      </View>

      <FlatList
        data={visibleTodos}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={s.empty}>No tasks yet</Text>}
        contentContainerStyle={
          visibleTodos.length === 0
            ? { flex: 1, justifyContent: "center" }
            : undefined
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <Pressable
              onPress={() => toggleTodo(item.id)}
              style={{ flex: 1 }}
            >
              <Text style={[s.todoText, item.done && s.done]}>{item.title}</Text>

              <View style={s.metaRow}>
                <View
                  style={[
                    s.badge,
                    item.priority === "HIGH" && s.badgeHigh,
                    item.priority === "MEDIUM" && s.badgeMedium,
                    item.priority === "LOW" && s.badgeLow,
                  ]}
                >
                  <Text style={s.badgeText}>{item.priority}</Text>
                </View>

                <Text style={s.checkbox}>{item.done ? "✅" : "⬜️"}</Text>
              </View>
            </Pressable>

            <Pressable onPress={() => removeTodo(item.id)} hitSlop={10} style={s.trash}>
              <Text style={{ fontSize: 18 }}>🗑️</Text>
            </Pressable>
          </View>
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
  meta: { color: "#94A3B8", marginTop: 6, fontWeight: "600" },

  filters: { flexDirection: "row", gap: 8, marginBottom: 10 },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  filterPillActive: { backgroundColor: "#E5E7EB" },
  filterText: { color: "#E5E7EB", fontWeight: "800" },
  filterTextActive: { color: "#111827" },

  actions: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 8 },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  clearText: { color: "#E5E7EB", fontWeight: "800" },

  metaRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  badgeHigh: { backgroundColor: "#3B0A0A" },
  badgeMedium: { backgroundColor: "#3B2A0A" },
  badgeLow: { backgroundColor: "#0B2A12" },
  badgeText: { color: "#E5E7EB", fontWeight: "900", fontSize: 12 },
  checkbox: { color: "white", fontWeight: "800" },

  trash: {
    marginLeft: 10,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});