import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { Product } from "../types/product";
import { fetchProducts } from "../api/products"; 

import { Pressable } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Home: undefined;
  ProductDetail: { productId: number };
};

type NavProp = NativeStackNavigationProp<RootStackParamList, "Home">;



export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NavProp>();


  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
          style={styles.card}
        >
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          <Text style={styles.price}>${item.price}</Text>
        </Pressable>
      )}      
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  image: {
    height: 120,
    resizeMode: "contain",
    marginBottom: 8,
  },
  title: {
    fontWeight: "600",
    marginBottom: 4,
  },
  price: {
    fontWeight: "700",
    color: "#2e7d32",
  },
});
