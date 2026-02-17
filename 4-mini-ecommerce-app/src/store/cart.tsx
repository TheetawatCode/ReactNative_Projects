import React, { createContext, useContext, useMemo, useReducer } from "react";
import type { Product } from "../types/product";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


export type CartItem = {
  product: Product;
  qty: number;
};

type CartState = {
  items: Record<number, CartItem>; // key = product.id
};

type Action =
  | { type: "ADD"; product: Product; qty?: number }
  | { type: "REMOVE"; productId: number }
  | { type: "INC"; productId: number }
  | { type: "DEC"; productId: number }
  | { type: "CLEAR" };

const initialState: CartState = { items: {} };
const STORAGE_KEY = "mini-ecommerce-cart-v1";


function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD": {
      const id = action.product.id;
      const current = state.items[id];
      const addQty = action.qty ?? 1;
      return {
        items: {
          ...state.items,
          [id]: {
            product: action.product,
            qty: (current?.qty ?? 0) + addQty,
          },
        },
      };
    }
    case "REMOVE": {
      const copy = { ...state.items };
      delete copy[action.productId];
      return { items: copy };
    }
    case "INC": {
      const current = state.items[action.productId];
      if (!current) return state;
      return {
        items: {
          ...state.items,
          [action.productId]: { ...current, qty: current.qty + 1 },
        },
      };
    }
    case "DEC": {
      const current = state.items[action.productId];
      if (!current) return state;
      const nextQty = current.qty - 1;
      if (nextQty <= 0) {
        const copy = { ...state.items };
        delete copy[action.productId];
        return { items: copy };
      }
      return {
        items: {
          ...state.items,
          [action.productId]: { ...current, qty: nextQty },
        },
      };
    }
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

type CartContextValue = {
  itemsArray: CartItem[];
  count: number;
  total: number;

  add: (p: Product, qty?: number) => void;
  remove: (productId: number) => void;
  inc: (productId: number) => void;
  dec: (productId: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ✅ 1) โหลดข้อมูลตอนเปิดแอพ
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as CartState;
        // set state ผ่าน dispatch แบบง่าย: replace state
        dispatch({ type: "CLEAR" });
        for (const item of Object.values(parsed.items)) {
          dispatch({ type: "ADD", product: item.product, qty: item.qty });
        }
      } catch (e) {
        console.error("Failed to hydrate cart", e);
      }
    })();
  }, []);

  // ✅ 2) เซฟทุกครั้งที่ cart เปลี่ยน
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error("Failed to persist cart", e);
      }
    })();
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const itemsArray = Object.values(state.items);
    const count = itemsArray.reduce((sum, it) => sum + it.qty, 0);
    const total = itemsArray.reduce((sum, it) => sum + it.qty * it.product.price, 0);

    return {
      itemsArray,
      count,
      total,
      add: (p, qty) => dispatch({ type: "ADD", product: p, qty }),
      remove: (productId) => dispatch({ type: "REMOVE", productId }),
      inc: (productId) => dispatch({ type: "INC", productId }),
      dec: (productId) => dispatch({ type: "DEC", productId }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
