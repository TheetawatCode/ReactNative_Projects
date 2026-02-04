import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTodoStore } from "../src/store/todoStore";

export default function AddTodoModal() {
  const [title, setTitle] = useState("");
  const addTodo = useTodoStore((s) => s.addTodo);
  const router = useRouter();

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

      <Pressable
        disabled={!title.trim()}
        style={[s.btn, !title && { opacity: 0.4 }]}
        onPress={() => {
          addTodo(title, "MEDIUM");
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
  input: {
    backgroundColor: "#0F172A",
    borderRadius: 14,
    padding: 14,
    color: "white",
    fontWeight: "700",
  },
  btn: {
    marginTop: 16,
    backgroundColor: "#22C55E",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: { fontWeight: "900", color: "#052E16" },
});
