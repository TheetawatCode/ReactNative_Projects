import { Pressable, StyleSheet, Text, View } from "react-native";
import { Expense } from "../types/expense";
import { formatTHB } from "../utils/format";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

type Props = {
  item: Expense;
  onDelete: (id: string) => void;
};

export default function ExpenseItem({ item, onDelete }: Props) {
  const isIncome = item.type === "income";

  return (
    <View style={[styles.item, isIncome ? styles.incomeBorder : styles.expenseBorder]}>
      <View style={styles.left}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.category}</Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, isIncome ? styles.incomeText : styles.expenseText]}>
        {formatTHB(isIncome ? item.amount : -item.amount)}
        </Text>

        <Pressable onPress={() => onDelete(item.id)} hitSlop={10}>
          <Text style={styles.delete}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
  },
  left: { flex: 1, paddingRight: 10 },
  right: { alignItems: "flex-end", gap: 6 },

  title: { fontWeight: "800", fontSize: 16 },
  meta: { marginTop: 4, opacity: 0.6 },

  amount: { fontWeight: "900", fontSize: 16 },
  incomeText: { color: "#16A34A" },
  expenseText: { color: "#DC2626" },

  incomeBorder: { borderColor: "rgba(22,163,74,0.35)" },
  expenseBorder: { borderColor: "rgba(220,38,38,0.35)" },

  delete: { color: "#DC2626", fontWeight: "700" },
});
