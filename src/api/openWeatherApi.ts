import axios from "axios";
import { ForecastData, WeatherData } from "@/types/weather";

const openWeatherApi = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  params: {
    appid: "050345ecfc42ba02da9811fb717d8539",
    units: "metric",
  },
});

export const endpoints = {
  weather: "/weather",
  forecast: "/forecast",
};

export const getCurrentWeather = async (
  latitude: number,
  longitude: number
) => {
  const response = await openWeatherApi.get<WeatherData>(endpoints.weather, {
    params: { lat: latitude, lon: longitude },
  });
  return response.data;
};

export const getForecast = async (latitude: number, longitude: number) => {
  const response = await openWeatherApi.get<ForecastData>(endpoints.forecast, {
    params: { lat: latitude, lon: longitude },
  });
  return response.data;
};
