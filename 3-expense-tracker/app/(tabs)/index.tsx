import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { Expense } from "../../types/expense";
import ExpenseItem from "../../components/ExpenseItem";
import Summary from "../../components/Summary";

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const addExpense = () => {
    if (!title || !amount) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      title,
      amount: Number(amount),
      category: "General",
      type: "expense",
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setTitle("");
    setAmount("");
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Tracker</Text>

      <Summary expenses={expenses} />

      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />

      <Pressable style={styles.button} onPress={addExpense}>
        <Text style={styles.buttonText}>Add</Text>
      </Pressable>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseItem item={item} onDelete={deleteExpense} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "white", fontWeight: "bold" },
});