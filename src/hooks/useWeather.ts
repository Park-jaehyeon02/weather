"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather, getForecast } from "@/services/weather";

export const useCurrentWeather = (lat: number | null, lon: number | null) => {
  return useQuery({
    queryKey: ["currentWeather", lat, lon],
    queryFn: () => getCurrentWeather(lat!, lon!),
    enabled: lat !== null && lon !== null,
  });
};

export const useForecast = (lat: number | null, lon: number | null) => {
  return useQuery({
    queryKey: ["forecast", lat, lon],
    queryFn: () => getForecast(lat!, lon!),
    enabled: lat !== null && lon !== null,
  });
};
