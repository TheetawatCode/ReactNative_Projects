import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import ForecastList from "../components/ForecastList";
import { getCurrentByCity, getForecastByCity } from "../api/weather";
import type { CurrentWeather, ForecastItem } from "../types/weather";
import { loadLastCity, saveLastCity } from "../utils/storage";

import { darkTheme, lightTheme } from "../theme/theme";
import type { AppTheme } from "../theme/theme";

import ThemeToggle from "../components/ThemeToggle"; 
import { loadThemeMode, saveThemeMode, type ThemeMode } from "../utils/themeStorage";

export default function HomeScreen() {

    const [themeMode, setThemeMode] = useState<ThemeMode>("light");
    const theme = themeMode === "dark" ? darkTheme : lightTheme;
    const s = makeStyles(theme); 

    useEffect(() => {
        (async () => {
            const saved = await loadThemeMode();
            if (saved) setThemeMode(saved);
        })();
    }, []);

    async function changeTheme(next: ThemeMode) {
        setThemeMode(next);
        await saveThemeMode(next);
    }

    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState<string>("Bangkok");
    const [current, setCurrent] = useState<CurrentWeather | null>(null);
    const [forecast, setForecast] = useState<ForecastItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    async function fetchAll(nextCity: string) {
        const trimmed = nextCity.trim();
        if (!trimmed) return;

        setLoading(true);
        setError(null);

        try {
            const [c, f] = await Promise.all([
                getCurrentByCity(trimmed),
                getForecastByCity(trimmed),
            ]);
            setCity(trimmed);
            setCurrent(c);
            setForecast(f);
            await saveLastCity(trimmed);
        } catch (e: any) {
            const msg =
                e?.response?.data?.message ||
                e?.message ||
                "Something went wrong. Please try again.";
            setError(String(msg));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            const last = await loadLastCity();
            const startCity = last || "Bangkok";
            setCity(startCity);
            fetchAll(startCity);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ScrollView style={{ backgroundColor: theme.bg }} contentContainerStyle={s.container}>
            <Text style={s.h1}>Weather App</Text>
            <ThemeToggle theme={theme} mode={themeMode} onChange={changeTheme} />

            <SearchBar
                theme={theme}
                initialValue={city}
                loading={loading}
                onSubmit={(c) => fetchAll(c)}
            />

            <View style={s.actionsRow}>
                <Pressable
                    style={[s.smallBtn, loading && s.btnDisabled]}
                    disabled={loading}
                    onPress={() => fetchAll(city)}
                >
                    <Text style={s.smallBtnText}>Refresh</Text>
                </Pressable>
            </View>

            {error ? (
                <View style={s.errorBox}>
                    <Text style={s.errorTitle}>Error</Text>
                    <Text style={s.errorText}>{error}</Text>
                </View>
            ) : null}

            {current ? <WeatherCard theme={theme} data={current} /> : null}
            <ForecastList theme={theme} items={forecast} />
        </ScrollView>
    );
}

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            padding: 16,
            paddingTop: 60,
            gap: 10,
            backgroundColor: theme.bg,
            flexGrow: 1,
        },
        h1: { fontSize: 28, fontWeight: "900", marginBottom: 6, color: theme.text },

        actionsRow: { flexDirection: "row", justifyContent: "flex-end" },
        smallBtn: {
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 12,
        },
        btnDisabled: { opacity: 0.5 },
        smallBtnText: { fontWeight: "800", color: theme.text },

        errorBox: {
            borderWidth: 1,
            borderColor: "#ff6b6b55",
            backgroundColor: theme.bg === "#0b0b0f" ? "#2a1416" : "#fff5f5",
            padding: 12,
            borderRadius: 14,
        },
        errorTitle: { fontWeight: "900", marginBottom: 4, color: theme.text },
        errorText: { color: "#ff8a8a" },
    });

// helper เล็กๆ ให้ error box ดูเข้ากับ dark
function schemeBg(theme: any) {
    return theme.bg === "#0b0b0f" ? "#2a1416" : "#fff5f5";
}

