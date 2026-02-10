import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import type { CurrentWeather } from "../types/weather";
import { iconUrl } from "../api/weather";
import type { AppTheme } from "../theme/theme";

export default function WeatherCard({ theme, data }: { theme: AppTheme; data: CurrentWeather }) {
    const s = makeStyles(theme);
    
    return (
        <View style={s.card}>
            <View style={s.topRow}>
                <View style={{ flex: 1 }}>
                    <Text style={s.city}>{data.name}{data.country ? `, ${data.country}` : ""}</Text>
                    <Text style={s.desc}>{data.description}</Text>
                </View>
                <Image source={{ uri: iconUrl(data.icon) }} style={s.icon} />
            </View>

            <Text style={s.temp}>{Math.round(data.temp)}°C</Text>
            <Text style={s.sub}>Feels like {Math.round(data.feelsLike)}°C</Text>

            <View style={s.metaRow}>
                <Text style={s.meta}>Humidity: {data.humidity}%</Text>
                <Text style={s.meta}>Wind: {data.windSpeed} m/s</Text>
            </View>
        </View>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
      card: {
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.card,
        borderRadius: 16,
        padding: 14,
        marginBottom: 14,
      },
      topRow: { flexDirection: "row", alignItems: "center", gap: 10 },
      city: { fontSize: 18, fontWeight: "800", color: theme.text },
      desc: { marginTop: 4, color: theme.subText, textTransform: "capitalize" },
      icon: { width: 64, height: 64 },
      temp: { fontSize: 42, fontWeight: "900", marginTop: 6, color: theme.text },
      sub: { color: theme.subText, marginTop: 2 },
      metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
      meta: { color: theme.text, fontWeight: "600" },
    });