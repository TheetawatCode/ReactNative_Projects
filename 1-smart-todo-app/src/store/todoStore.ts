import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import type { Priority, Todo } from "../types/todo";

const STORAGE_KEY = "smart_todo_v1";

type TodoState = {
  todos: Todo[];
  hydrate: () => Promise<void>;
  addTodo: (title: string, priority: Priority) => void;
  toggleTodo: (id: string) => void;
  clearAll: () => void;
  removeTodo: (id: string) => void;
};

async function saveTodos(todos: Todo[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {}
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Todo[];
        set({ todos: parsed });
      }
    } catch {}
  },

  addTodo: (title, priority) => {
    const next = [
      {
        id: Date.now().toString(),
        title,
        done: false,
        priority,
        createdAt: Date.now(),
      },
      ...get().todos,
    ];
    set({ todos: next });
    void saveTodos(next);
  },

  toggleTodo: (id) => {
    const next = get().todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t,
    );
    set({ todos: next });
    void saveTodos(next);
  },

  removeTodo: (id) => {
    const next = get().todos.filter((t) => t.id !== id);
    set({ todos: next });
    void saveTodos(next);
  },

  clearAll: () => {
    set({ todos: [] });
    void saveTodos([]);
  },
}));
