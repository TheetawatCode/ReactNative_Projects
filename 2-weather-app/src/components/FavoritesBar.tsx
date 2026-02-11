import React from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import type { AppTheme } from "../theme/theme";

type Props = {
  theme: AppTheme;
  cities: string[];
  currentCity: string;
  onSelect: (city: string) => void;
  onRemove: (city: string) => void;
};

export default function FavoritesBar({
  theme,
  cities,
  currentCity,
  onSelect,
  onRemove,
}: Props) {
  const s = makeStyles(theme);

  if (!cities.length) {
    return (
      <View style={s.emptyWrap}>
        <Text style={s.emptyText}>No favorites yet. Tap ⭐ to save a city.</Text>
      </View>
    );
  }

  return (
    <View style={s.wrap}>
      <Text style={s.title}>Favorites</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={cities}
        keyExtractor={(c) => c}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => {
          const active = item.toLowerCase() === currentCity.toLowerCase();
          return (
            <View style={[s.pill, active && s.pillActive]}>
              <Pressable onPress={() => onSelect(item)} style={s.pillBtn}>
                <Text style={[s.pillText, active && s.pillTextActive]}>
                  {item}
                </Text>
              </Pressable>

              <Pressable onPress={() => onRemove(item)} style={s.removeBtn}>
                <Text style={s.removeText}>×</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    wrap: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 14,
      marginBottom: 10,
    },
    title: { fontSize: 16, fontWeight: "900", color: theme.text, marginBottom: 10 },

    pill: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.mutedBg,
      borderRadius: 999,
      overflow: "hidden",
    },
    pillActive: {
      borderColor: theme.text,
    },
    pillBtn: { paddingHorizontal: 12, paddingVertical: 8 },
    pillText: { color: theme.text, fontWeight: "800" },
    pillTextActive: { textDecorationLine: "underline" },

    removeBtn: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderLeftWidth: 1,
      borderLeftColor: theme.border,
      backgroundColor: theme.card,
    },
    removeText: { color: theme.subText, fontSize: 18, fontWeight: "900" },

    emptyWrap: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 14,
      marginBottom: 10,
    },
    emptyText: { color: theme.subText, fontWeight: "700" },
  });