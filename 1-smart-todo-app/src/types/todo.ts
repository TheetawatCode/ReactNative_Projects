export type Priority = "HIGH" | "MEDIUM" | "LOW";

export type Todo = {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  createdAt: number;
};
