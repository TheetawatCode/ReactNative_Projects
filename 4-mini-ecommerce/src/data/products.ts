export type Product = {
    id: string;
    title: string;
    brand: string;
    price: number;
    rating: number; // 0-5
    image: string; // uri
    tags: string[];
  };
  
  export const PRODUCTS: Product[] = [
    {
      id: "p1",
      title: "Wireless Headphones Pro",
      brand: "Auralux",
      price: 3290,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1518441319071-5a7c1b1c1c5b?auto=format&fit=crop&w=1200&q=80",
      tags: ["Noise Cancel", "48h Battery"],
    },
    {
      id: "p2",
      title: "Smart Watch Series 9",
      brand: "Novawear",
      price: 4990,
      rating: 4.4,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      tags: ["Health", "AMOLED"],
    },
    {
      id: "p3",
      title: "Minimal Backpack 18L",
      brand: "UrbanForm",
      price: 1590,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
      tags: ["Water Repellent", "Laptop"],
    },
    {
      id: "p4",
      title: "Desk Lamp Studio",
      brand: "LumenCo",
      price: 890,
      rating: 4.2,
      image:
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
      tags: ["Warm Light", "Modern"],
    },
    {
      id: "p5",
      title: "Mechanical Keyboard TKL",
      brand: "KeyForge",
      price: 2790,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      tags: ["Hot-swap", "PBT Keycaps"],
    },
    {
      id: "p6",
      title: "Coffee Grinder Compact",
      brand: "BrewLab",
      price: 2190,
      rating: 4.3,
      image:
        "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
      tags: ["Stainless", "Quiet"],
    },
  ];