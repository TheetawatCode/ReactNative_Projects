export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Recommended" | "Main" | "Dessert" | "Drink";
  image: string; // ใช้รูป remote
  badge?: "Best seller" | "New";
};

export const CATEGORIES: MenuItem["category"][] = [
  "Recommended",
  "Main",
  "Dessert",
  "Drink",
];

export const MENU: MenuItem[] = [
  {
    id: "1",
    name: "Truffle Cream Pasta",
    description: "Creamy pasta with truffle aroma and parmesan.",
    price: 289,
    category: "Recommended",
    badge: "Best seller",
    image:
      "https://images.unsplash.com/photo-1521389508051-d7ffb5dc8bb1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    name: "Grilled Salmon Bowl",
    description: "Fresh salmon with rice, veggies, and house sauce.",
    price: 329,
    category: "Main",
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    name: "Classic Cheeseburger",
    description: "Juicy beef patty, cheddar, pickles, and brioche bun.",
    price: 259,
    category: "Main",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "4",
    name: "Tiramisu",
    description: "Espresso-soaked layers with mascarpone cream.",
    price: 149,
    category: "Dessert",
    image:
      "https://images.unsplash.com/photo-1542326237-94b1c5a538d4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "5",
    name: "Matcha Latte",
    description: "Smooth matcha with milk, lightly sweetened.",
    price: 119,
    category: "Drink",
    image:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "6",
    name: "Lemon Sparkling",
    description: "Citrus soda with fresh lemon and ice.",
    price: 99,
    category: "Drink",
    image:
      "https://images.unsplash.com/photo-1626810309605-1d6a85e7375d?auto=format&fit=crop&w=1200&q=80",
  },
];
