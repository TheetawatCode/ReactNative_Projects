import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import ExpenseItem from "../../components/ExpenseItem";
import Summary from "../../components/Summary";
import { Expense } from "../../types/expense";

// =====================
// Constants / Types
// =====================
const STORAGE_KEY = "expense-tracker:v1";

const EXPENSE_CATEGORIES = ["Food", "Travel", "Bills", "Shopping", "Health", "Other"] as const;
const INCOME_CATEGORIES = ["Salary", "Bonus", "Gift", "Investment", "Other"] as const;

type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
type Category = ExpenseCategory | IncomeCategory;

export default function HomeScreen() {
  // =====================
  // Form state
  // =====================
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  // =====================
  // Data state
  // =====================
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [type, setType] = useState<"income" | "expense">("expense");

  // Category state (separate for UX)
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>("Other");
  const [incomeCategory, setIncomeCategory] = useState<IncomeCategory>("Other");

  const category: Category = type === "expense" ? expenseCategory : incomeCategory;

  const setCategory = (value: Category) => {
    if (type === "expense") setExpenseCategory(value as ExpenseCategory);
    else setIncomeCategory(value as IncomeCategory);
  };

  const categories = useMemo(
    () => (type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES),
    [type]
  );

  // =====================
  // Storage
  // =====================
  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        setExpenses(JSON.parse(raw));
      } catch (err) {
        console.log("Failed to load expenses:", err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
      } catch (err) {
        console.log("Failed to save expenses:", err);
      }
    };
    save();
  }, [expenses]);

  // =====================
  // Actions
  // =====================
  const addExpense = () => {
    if (!title || !amount) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      title,
      amount: Number(amount),
      category,
      type,
      createdAt: new Date().toISOString(),
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setTitle("");
    setAmount("");
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => setExpenses([]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Tracker</Text>

      <Summary expenses={expenses} />

      <View style={styles.toggleRow}>
        <Pressable
          onPress={() => setType("expense")}
          style={[styles.toggleBtn, type === "expense" && styles.toggleActiveExpense]}
        >
          <Text style={styles.toggleText}>Expense</Text>
        </Pressable>

        <Pressable
          onPress={() => setType("income")}
          style={[styles.toggleBtn, type === "income" && styles.toggleActiveIncome]}
        >
          <Text style={styles.toggleText}>Income</Text>
        </Pressable>
      </View>

      <View style={styles.catRow}>
        {categories.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCategory(c)}
            style={[styles.catChip, category === c && styles.catChipActive]}
          >
            <Text style={styles.catText}>{c}</Text>
          </Pressable>
        ))}
      </View>

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

      <Pressable style={styles.clearBtn} onPress={clearAll}>
        <Text style={styles.clearText}>Clear All</Text>
      </Pressable>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExpenseItem item={item} onDelete={deleteExpense} />}
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

  toggleRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  toggleActiveExpense: { backgroundColor: "#FEE2E2", borderColor: "#EF4444" },
  toggleActiveIncome: { backgroundColor: "#DCFCE7", borderColor: "#22C55E" },
  toggleText: { fontWeight: "700" },

  catRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  catChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  catChipActive: { backgroundColor: "#E0E7FF", borderColor: "#2563EB" },
  catText: { fontWeight: "700" },

  clearBtn: { alignItems: "center", paddingVertical: 10, marginBottom: 10 },
  clearText: { color: "#DC2626", fontWeight: "800" },
});
