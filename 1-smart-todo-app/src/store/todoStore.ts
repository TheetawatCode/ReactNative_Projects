import { create } from "zustand";
import { Priority, Todo } from "../types/todo";

type TodoState = {
  todos: Todo[];
  addTodo: (title: string, priority: Priority) => void;
  toggleTodo: (id: string) => void;
};

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  addTodo: (title, priority) =>
    set((state) => ({
      todos: [
        {
          id: Date.now().toString(),
          title,
          done: false,
          priority,
          createdAt: Date.now(),
        },
        ...state.todos,
      ],
    })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t,
      ),
    })),
}));
