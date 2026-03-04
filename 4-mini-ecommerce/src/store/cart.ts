import { create } from "zustand";
import type { Product } from "../data/products";

export type CartItem = {
  product: Product;
  qty: number;
};

type CartState = {
  items: Record<string, CartItem>;
  add: (product: Product) => void;
  decrease: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;

  itemsArray: () => CartItem[];
  count: () => number;
  total: () => number;
};

export const useCart = create<CartState>((set, get) => ({
  items: {},

  add: (product) =>
    set((state) => {
      const existing = state.items[product.id];
      const nextQty = existing ? existing.qty + 1 : 1;
      return {
        items: {
          ...state.items,
          [product.id]: { product, qty: nextQty },
        },
      };
    }),

  decrease: (productId) =>
    set((state) => {
      const existing = state.items[productId];
      if (!existing) return state;

      const nextQty = existing.qty - 1;
      if (nextQty <= 0) {
        const { [productId]: _, ...rest } = state.items;
        return { items: rest };
      }
      return {
        items: {
          ...state.items,
          [productId]: { ...existing, qty: nextQty },
        },
      };
    }),

  remove: (productId) =>
    set((state) => {
      const { [productId]: _, ...rest } = state.items;
      return { items: rest };
    }),

  clear: () => set({ items: {} }),

  itemsArray: () => Object.values(get().items),

  count: () =>
    Object.values(get().items).reduce((sum, x) => sum + x.qty, 0),

  total: () =>
    Object.values(get().items).reduce((sum, x) => sum + x.qty * x.product.price, 0),
}));