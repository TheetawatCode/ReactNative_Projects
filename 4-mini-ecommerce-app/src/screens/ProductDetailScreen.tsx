import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Product } from "../types/product";

type RootStackParamList = {
  Home: undefined;
  ProductDetail: { productId: number };
};

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetail">;

export default function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const data: Product = await res.json();
        setProduct(data);
        navigation.setOptions({ title: "Detail" });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [productId, navigation]);

  const priceText = useMemo(() => {
    if (!product) return "";
    return `$${product.price}`;
  }, [product]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{priceText}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.desc}>{product.description}</Text>

        <Pressable style={styles.addBtn} onPress={() => {}}>
          <Text style={styles.addText}>Add to Cart (next step)</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },
  image: { height: 260, resizeMode: "contain", marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  price: { fontSize: 20, fontWeight: "800", color: "#2e7d32", marginBottom: 8 },
  category: { opacity: 0.7, marginBottom: 12 },
  desc: { lineHeight: 20, opacity: 0.85, marginBottom: 16 },
  addBtn: {
    backgroundColor: "#111",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  addText: { color: "#fff", fontWeight: "700" },
});
