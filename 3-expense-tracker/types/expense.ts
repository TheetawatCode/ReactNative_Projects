export type Expense = {
    id: string;
    title: string;
    amount: number;
    category: string;
    type: "income" | "expense";
  };