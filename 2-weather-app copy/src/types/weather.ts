export type CurrentWeather = {
    name: string;
    country: string;
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
  };
  
  export type ForecastItem = {
    dt: number; // unix seconds
    temp: number;
    description: string;
    icon: string;
  };