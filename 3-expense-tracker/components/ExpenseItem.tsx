import { View, Text, Pressable, StyleSheet } from "react-native";
import { Expense } from "../types/expense";

type Props = {
  item: Expense;
  onDelete: (id: string) => void;
};

export default function ExpenseItem({ item, onDelete }: Props) {
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text>${item.amount}</Text>
      </View>

      <Pressable onPress={() => onDelete(item.id)}>
        <Text style={styles.delete}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: { fontWeight: "bold" },
  delete: { color: "red" },
});