import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../store/useCart";
import { formatTHB } from "../../utils/formatTHB";


export default function CartScreen() {
    const itemsObj = useCart((s) => s.items);
    const inc = useCart((s) => s.inc);
    const dec = useCart((s) => s.dec);
    const remove = useCart((s) => s.remove);
    const clear = useCart((s) => s.clear);

    const items = useMemo(() => Object.values(itemsObj), [itemsObj]);

    const itemCount = useMemo(
        () => items.reduce((sum, x) => sum + x.qty, 0),
        [items]
    );

    const subtotal = useMemo(
        () => items.reduce((sum, x) => sum + x.price * x.qty, 0),
        [items]
    );

    const clearAll = async () => {
        await useCart.persist.clearStorage(); // ล้าง storage ก่อน
        clear(); // แล้วล้าง state
    };

    const onCheckout = () => {
        if (itemCount === 0) return;
        Alert.alert("Order placed!", "This is a mock checkout. Thank you!", [
            { text: "OK", onPress: () => void clearAll() },
        ]);
    };


    return (
        <SafeAreaView style={s.screen} edges={["top"]}>
            <View style={s.header}>
                <View>
                    <Text style={s.title}>Cart</Text>
                    <Text style={s.subtitle}>
                        {itemCount === 0 ? "No items yet" : `${itemCount} item(s) in your cart`}
                    </Text>
                </View>

                <Pressable
                    hitSlop={14}
                    onPress={() => {
                        if (itemCount === 0) return;

                        Alert.alert(
                            "Clear cart?",
                            "This will remove all items from your cart.",
                            [
                                { text: "Cancel", style: "cancel" },
                                { text: "Clear", style: "destructive", onPress: () => void clearAll() },
                            ]
                        );
                    }}
                    style={({ pressed }) => [s.clearBtn, pressed && { opacity: 0.9 }]}
                >
                    <Ionicons name="trash-outline" size={18} color="#0f172a" />
                    <Text style={s.clearText}>Clear</Text>
                </Pressable>

            </View>

            <FlatList
                data={items}
                keyExtractor={(x) => x.id}
                contentContainerStyle={s.list}
                renderItem={({ item }) => (
                    <View style={s.row}>
                        <Image source={{ uri: item.image }} style={s.thumb} />

                        <View style={s.mid}>
                            <Text numberOfLines={1} style={s.name}>
                                {item.name}
                            </Text>
                            <Text style={s.price}>{formatTHB(item.price)}</Text>

                            <View style={s.qtyRow}>
                                <Pressable
                                    onPress={() => dec(item.id)}
                                    style={({ pressed }) => [s.qtyBtn, pressed && { opacity: 0.85 }]}
                                    hitSlop={10}
                                >
                                    <Ionicons name="remove" size={16} color="#0f172a" />
                                </Pressable>

                                <Text style={s.qtyText}>{item.qty}</Text>

                                <Pressable
                                    onPress={() => inc(item.id)}
                                    style={({ pressed }) => [s.qtyBtn, pressed && { opacity: 0.85 }]}
                                    hitSlop={10}
                                >
                                    <Ionicons name="add" size={16} color="#0f172a" />
                                </Pressable>
                            </View>
                        </View>

                        <View style={s.right}>
                            <Pressable
                                onPress={() => remove(item.id)}
                                style={({ pressed }) => [s.removeBtn, pressed && { opacity: 0.85 }]}
                                hitSlop={10}
                            >
                                <Ionicons name="close" size={18} color="#334155" />
                            </Pressable>

                            <Text style={s.lineTotal}>{formatTHB(item.price * item.qty)}</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={s.empty}>
                        <Ionicons name="cart-outline" size={44} color="#94a3b8" />
                        <Text style={s.emptyTitle}>Your cart is empty</Text>
                        <Text style={s.emptyText}>Tap “+ Add” on any menu item to put it here.</Text>
                    </View>
                }
            />

            <View style={s.footer}>
                <View style={s.totalBox}>
                    <View style={{ gap: 4 }}>
                        <Text style={s.totalLabel}>Total</Text>
                        <Text style={s.totalValue}>{formatTHB(subtotal)}</Text>
                    </View>

                    <Pressable
                        onPress={onCheckout}
                        disabled={itemCount === 0}
                        style={({ pressed }) => [
                            s.checkoutBtn,
                            itemCount === 0 && s.checkoutDisabled,
                            pressed && itemCount > 0 && { opacity: 0.92 },
                        ]}
                    >
                        <Text style={s.checkoutText}>Checkout</Text>
                    </Pressable>
                </View>

                <Text style={s.footerHint}>
                    * Mock checkout for portfolio demo.
                </Text>
            </View>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#f8fafc" },

    header: {
        paddingTop: 14,
        paddingHorizontal: 16,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        zIndex: 10,
    },
    title: { fontSize: 26, fontWeight: "800", color: "#0f172a" },
    subtitle: { marginTop: 4, color: "#64748b" },

    clearBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    clearText: { color: "#0f172a", fontWeight: "800" },

    list: { paddingHorizontal: 16, paddingBottom: 18, gap: 12 },

    row: {
        flexDirection: "row",
        gap: 12,
        padding: 12,
        borderRadius: 18,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    thumb: { width: 72, height: 72, borderRadius: 14, backgroundColor: "#e2e8f0" },

    mid: { flex: 1, justifyContent: "space-between" },
    name: { fontSize: 15, fontWeight: "800", color: "#0f172a" },
    price: { marginTop: 6, color: "#64748b", fontWeight: "700" },

    qtyRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
    qtyBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: "#f1f5f9",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        alignItems: "center",
        justifyContent: "center",
    },
    qtyText: { minWidth: 18, textAlign: "center", fontWeight: "900", color: "#0f172a" },

    right: { alignItems: "flex-end", justifyContent: "space-between" },
    removeBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        alignItems: "center",
        justifyContent: "center",
    },
    lineTotal: { fontWeight: "900", color: "#0f172a" },

    empty: { padding: 28, alignItems: "center" },
    emptyTitle: { marginTop: 10, fontSize: 16, fontWeight: "900", color: "#0f172a" },
    emptyText: { marginTop: 6, color: "#64748b", textAlign: "center", lineHeight: 18 },

    footer: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 14,
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
        backgroundColor: "#ffffff",
    },
    totalBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    totalLabel: { color: "#64748b", fontWeight: "800" },
    totalValue: { fontSize: 18, fontWeight: "900", color: "#0f172a" },

    checkoutBtn: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: "#0f172a",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 120,
    },
    checkoutDisabled: { backgroundColor: "#94a3b8" },
    checkoutText: { color: "#ffffff", fontWeight: "900" },

    footerHint: { marginTop: 10, fontSize: 12, color: "#94a3b8" },
});
