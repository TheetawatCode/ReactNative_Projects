import { create } from "zustand";
import { persist } from "zustand/middleware";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

type FavoritesState = {
  favorites: MenuItem[];
  addFavorite: (item: MenuItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (item) =>
        set((state) => ({
          favorites: [...state.favorites, item],
        })),

      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((item) => item.id !== id),
        })),

      isFavorite: (id) => get().favorites.some((item) => item.id === id),
    }),
    {
      name: "favorites-storage",
    },
  ),
);
