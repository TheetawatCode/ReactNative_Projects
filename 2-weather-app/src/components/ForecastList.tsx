import React from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import type { ForecastItem } from "../types/weather";
import { iconUrl } from "../api/weather";
import type { AppTheme } from "../theme/theme";

function formatThaiDayTime(dt: number) {
    const d = new Date(dt * 1000);

    const day = d.toLocaleDateString("th-TH", { weekday: "short" }); // จ., อ., พ. ...
    const time = d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }); // 19:00

    return `${day} ${time} น.`; // ตัวอย่าง: "จ. 19:00 น."
}

export default function ForecastList({ theme, items }: { theme: AppTheme; items: ForecastItem[] }) {
    const s = makeStyles(theme); 

    if (!items.length) return null;

    return (
        <View style={s.wrap}>
            <Text style={s.title}>Next 24 hours</Text>

            <FlatList
                data={items}
                keyExtractor={(it) => String(it.dt)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }) => (
                    <View style={s.item}>
                        <Text style={s.time}>{formatThaiDayTime(item.dt)}</Text>
                        <Image source={{ uri: iconUrl(item.icon) }} style={s.icon} />
                        <Text style={s.t}>{Math.round(item.temp)}°</Text>
                        <Text numberOfLines={1} style={s.d}>
                            {item.description}
                        </Text>
                    </View>
                )}
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
      },
      title: { fontSize: 16, fontWeight: "800", marginBottom: 10, color: theme.text },
      item: {
        width: 110,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 14,
        padding: 10,
        backgroundColor: theme.mutedBg,
      },
      time: { fontWeight: "700", color: theme.text },
      icon: { width: 44, height: 44, marginTop: 6 },
      t: { fontSize: 20, fontWeight: "900", marginTop: 2, color: theme.text },
      d: { color: theme.subText, marginTop: 2, textTransform: "capitalize" },
    });