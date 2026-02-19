import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
};

type CartState = {
  items: Record<string, CartItem>;
  add: (item: Omit<CartItem, "qty">) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;

  itemsArray: () => CartItem[];
  count: () => number;
  total: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},

      add: (item) =>
        set((state) => {
          const existing = state.items[item.id];
          const nextQty = (existing?.qty ?? 0) + 1;

          return {
            items: {
              ...state.items,
              [item.id]: { ...item, qty: nextQty },
            },
          };
        }),

      inc: (id) =>
        set((state) => {
          const it = state.items[id];
          if (!it) return state;
          return {
            items: { ...state.items, [id]: { ...it, qty: it.qty + 1 } },
          };
        }),

      dec: (id) =>
        set((state) => {
          const it = state.items[id];
          if (!it) return state;
          const nextQty = it.qty - 1;
          if (nextQty <= 0) {
            const { [id]: _, ...rest } = state.items;
            return { items: rest };
          }
          return { items: { ...state.items, [id]: { ...it, qty: nextQty } } };
        }),

      remove: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.items;
          return { items: rest };
        }),

      clear: () => set({ items: {} }),

      itemsArray: () => Object.values(get().items),
      count: () =>
        Object.values(get().items).reduce((sum, x) => sum + x.qty, 0),
      total: () =>
        Object.values(get().items).reduce((sum, x) => sum + x.price * x.qty, 0),
    }),
    { name: "cart-storage" },
  ),
);
