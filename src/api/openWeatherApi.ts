import axios from "axios";
import { ForecastData, WeatherData } from "../types/weather";

const openWeatherApi = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  params: {
    appid: "050345ecfc42ba02da9811fb717d8539",
    units: "metric",
    // Makati City
    lat: 14.5547,
    lon: 121.0244,
  },
});

export const endpoints = {
  weather: "/weather",
  forecast: "/forecast",
};

export const getCurrentWeather = async () => {
  const response = await openWeatherApi.get<WeatherData>(endpoints.weather);
  return response.data;
};

export const getForecast = async () => {
  const response = await openWeatherApi.get<ForecastData>(endpoints.forecast);
  return response.data;
};
