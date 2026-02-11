import axios from "axios";
import type { CurrentWeather, ForecastItem } from "../types/weather";

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_KEY;

if (!API_KEY) {
  throw new Error("Missing OpenWeather API Key (EXPO_PUBLIC_OPENWEATHER_KEY)");
}

const http = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  timeout: 15000,
});

function pick<T>(v: T | undefined | null, fallback: T): T {
  return v ?? fallback;
}

export async function getCurrentByCity(city: string): Promise<CurrentWeather> {
  const { data } = await http.get("/weather", {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
      lang: "th",
    },
  });

  return {
    name: pick(data?.name, "Unknown"),
    country: pick(data?.sys?.country, ""),
    temp: pick(data?.main?.temp, 0),
    feelsLike: pick(data?.main?.feels_like, 0),
    humidity: pick(data?.main?.humidity, 0),
    windSpeed: pick(data?.wind?.speed, 0),
    description: pick(data?.weather?.[0]?.description, ""),
    icon: pick(data?.weather?.[0]?.icon, "01d"),
  };
}

export async function getForecastByCity(city: string): Promise<ForecastItem[]> {
  const { data } = await http.get("/forecast", {
    params: {
      q: city,
      appid: API_KEY,
      units: "metric",
      lang: "th",
    },
  });

  const list = Array.isArray(data?.list) ? data.list : [];

  // เอา 8 ช่วงเวลาแรก = ประมาณ 24 ชั่วโมง (3 ชม./ช่วง)
  return list.slice(0, 8).map((it: any) => ({
    dt: pick(it?.dt, 0),
    temp: pick(it?.main?.temp, 0),
    description: pick(it?.weather?.[0]?.description, ""),
    icon: pick(it?.weather?.[0]?.icon, "01d"),
  }));
}

export function iconUrl(icon: string) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}