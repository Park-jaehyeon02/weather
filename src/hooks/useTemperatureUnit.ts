"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TemperatureUnit } from "@/types/weather";

type TemperatureUnitStore = {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  toggleUnit: () => void;
};

export const useTemperatureUnit = create<TemperatureUnitStore>()(
  persist(
    (set) => ({
      unit: "celsius",
      setUnit: (unit) => set({ unit }),
      toggleUnit: () =>
        set((state) => ({
          unit: state.unit === "celsius" ? "fahrenheit" : "celsius",
        })),
    }),
    {
      name: "temperature-unit",
    }
  )
);

export const convertTemperature = (
  temp: number,
  unit: TemperatureUnit
): number => {
  if (unit === "fahrenheit") {
    return Math.round((temp * 9) / 5 + 32);
  }
  return Math.round(temp);
};

export const formatTemperature = (
  temp: number,
  unit: TemperatureUnit
): string => {
  const converted = convertTemperature(temp, unit);
  return `${converted}°${unit === "celsius" ? "C" : "F"}`;
};
