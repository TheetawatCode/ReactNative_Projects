import { StyleSheet, Text, View } from "react-native";
import { Expense } from "../types/expense";
import { formatTHB } from "../utils/format";

type Props = {
  expenses: Expense[];
};

export default function Summary({ expenses }: Props) {
  const income = expenses
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);

  const expense = expenses
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = income - expense;

  return (
    <View style={styles.box}>
      <View style={styles.row}>
        <Text style={styles.label}>Income</Text>
        <Text style={styles.value}>{formatTHB(income)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Expense</Text>
        <Text style={styles.value}>{formatTHB(expense)}</Text>
      </View>

      <View style={[styles.row, styles.rowLast]}>
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text style={styles.balanceValue}>{formatTHB(balance)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 14,
    backgroundColor: "#E0E7FF",
    borderRadius: 12,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  rowLast: {
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    marginTop: 6,
    paddingTop: 10,
  },
  label: { fontSize: 16, fontWeight: "600" },
  value: { fontSize: 16, fontWeight: "700" },
  balanceLabel: { fontSize: 18, fontWeight: "800" },
  balanceValue: { fontSize: 18, fontWeight: "800" },
});
