import { View, Text, StyleSheet } from "react-native";
import { Expense } from "../types/expense";

type Props = {
  expenses: Expense[];
};

export default function Summary({ expenses }: Props) {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <View style={styles.box}>
      <Text style={styles.total}>Total: ${total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 12,
    backgroundColor: "#E0E7FF",
    borderRadius: 8,
    marginBottom: 20,
  },
  total: { fontWeight: "bold", fontSize: 18 },
});