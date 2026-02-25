"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FavoriteCity } from "@/types/weather";

type FavoritesStore = {
  favorites: FavoriteCity[];
  addFavorite: (city: FavoriteCity) => void;
  removeFavorite: (lat: number, lon: number) => void;
  isFavorite: (lat: number, lon: number) => boolean;
};

export const useFavorites = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (city) =>
        set((state) => {
          const exists = state.favorites.some(
            (f) => f.lat === city.lat && f.lon === city.lon
          );
          if (exists) return state;
          return { favorites: [...state.favorites, city] };
        }),
      removeFavorite: (lat, lon) =>
        set((state) => ({
          favorites: state.favorites.filter(
            (f) => !(f.lat === lat && f.lon === lon)
          ),
        })),
      isFavorite: (lat, lon) =>
        get().favorites.some((f) => f.lat === lat && f.lon === lon),
    }),
    {
      name: "weather-favorites",
    }
  )
);
