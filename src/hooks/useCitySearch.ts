"use client";

import { useQuery } from "@tanstack/react-query";
import { searchCities } from "@/services/weather";

export const useCitySearch = (query: string) => {
  return useQuery({
    queryKey: ["citySearch", query],
    queryFn: () => searchCities(query),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
};
