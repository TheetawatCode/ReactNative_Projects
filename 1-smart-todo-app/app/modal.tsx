import { useTodoStore } from "@src/store/todoStore";
import type { Priority } from "@src/types/todo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const PRIORITIES: Priority[] = ["HIGH", "MEDIUM", "LOW"];

export default function AddTodoModal() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");

  const addTodo = useTodoStore((s) => s.addTodo);
  const router = useRouter();

  const canSave = title.trim().length > 0;

  return (
    <View style={s.container}>
      <Text style={s.label}>New Todo</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="What do you need to do?"
        placeholderTextColor="#64748B"
        style={s.input}
      />

      <Text style={s.subLabel}>Priority</Text>
      <View style={s.row}>
        {PRIORITIES.map((p) => {
          const active = p === priority;
          return (
            <Pressable
              key={p}
              onPress={() => setPriority(p)}
              style={[s.pill, active && s.pillActive]}
            >
              <Text style={[s.pillText, active && s.pillTextActive]}>{p}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        disabled={!canSave}
        style={[s.btn, !canSave && { opacity: 0.4 }]}
        onPress={() => {
          addTodo(title.trim(), priority);
          router.back();
        }}
      >
        <Text style={s.btnText}>Save</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0B1220" },
  label: { color: "white", fontSize: 18, fontWeight: "800", marginBottom: 12 },
  subLabel: { color: "#E5E7EB", fontWeight: "800", marginTop: 14, marginBottom: 10 },
  input: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 14,
    padding: 14,
    color: "white",
    fontWeight: "700",
  },
  row: { flexDirection: "row", gap: 8, marginBottom: 14 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  pillActive: { backgroundColor: "#E5E7EB" },
  pillText: { color: "#E5E7EB", fontWeight: "800" },
  pillTextActive: { color: "#111827" },
  btn: {
    marginTop: 6,
    backgroundColor: "#22C55E",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: { fontWeight: "900", color: "#052E16" },
});