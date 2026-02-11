import React, { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import type { AppTheme } from "../theme/theme";

type Props = {
    theme: AppTheme;
    initialValue?: string;
    onSubmit: (city: string) => void;
    loading?: boolean;
};

export default function SearchBar({ theme, initialValue = "", onSubmit, loading }: Props) {
    const [city, setCity] = useState(initialValue);
    const s = makeStyles(theme);

    return (
        <View style={s.row}>
            <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="Search city (e.g. Bangkok)"
                autoCapitalize="words"
                style={s.input}
                editable={!loading}
                returnKeyType="search"
                onSubmitEditing={() => onSubmit(city.trim())}
            />
            <Pressable
                style={[s.btn, loading && s.btnDisabled]}
                disabled={loading}
                onPress={() => onSubmit(city.trim())}
            >
                <Text style={s.btnText}>{loading ? "..." : "Go"}</Text>
            </Pressable>
        </View>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
      row: { flexDirection: "row", gap: 10, marginBottom: 14 },
      input: {
        flex: 1,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: theme.inputBg,
        color: theme.text,
      },
      btn: {
        paddingHorizontal: 14,
        justifyContent: "center",
        borderRadius: 12,
        backgroundColor: theme.btnBg,
      },
      btnDisabled: { opacity: 0.5 },
      btnText: { color: theme.btnText, fontWeight: "700" },
    });