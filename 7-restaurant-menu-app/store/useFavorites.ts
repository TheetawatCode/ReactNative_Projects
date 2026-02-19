import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FavoriteItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

type FavoritesState = {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (item) =>
        set((state) => {
          // กันซ้ำ
          if (state.favorites.some((x) => x.id === item.id)) return state;
          return { favorites: [item, ...state.favorites] };
        }),

      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((x) => x.id !== id),
        })),

      isFavorite: (id) => get().favorites.some((x) => x.id === id),

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => AsyncStorage), // ⭐ สำคัญมาก
    },
  ),
);
