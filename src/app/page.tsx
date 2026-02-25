"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/weather/header";
import { CurrentWeather } from "@/components/weather/current-weather";
import { WeatherDetails } from "@/components/weather/weather-details";
import { HourlyForecast } from "@/components/weather/hourly-forecast";
import { DailyForecast } from "@/components/weather/daily-forecast";
import { FavoritesList } from "@/components/weather/favorites-list";
import { FavoriteButton } from "@/components/weather/favorite-button";
import {
  ErrorMessage,
  LocationPermissionError,
} from "@/components/weather/error-message";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useCurrentWeather, useForecast } from "@/hooks/useWeather";
import {
  getHourlyFromForecast,
  getDailyFromForecast,
} from "@/services/weather";

type SelectedCity = {
  name: string;
  lat: number;
  lon: number;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

export default function Home() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    lat: geoLat,
    lon: geoLon,
    error: geoError,
    isLoading: geoLoading,
    retry: retryGeo,
  } = useGeolocation();

  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null);

  const lat = selectedCity?.lat ?? geoLat;
  const lon = selectedCity?.lon ?? geoLon;

  const {
    data: currentWeather,
    isLoading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useCurrentWeather(lat, lon);

  const {
    data: forecast,
    isLoading: forecastLoading,
    error: forecastError,
    refetch: refetchForecast,
  } = useForecast(lat, lon);

  const handleCitySelect = (city: SelectedCity) => {
    setSelectedCity(city);
  };

  const handleManualSearch = () => {
    searchInputRef.current?.focus();
  };

  const handleRetry = () => {
    refetchWeather();
    refetchForecast();
  };

  const isLoading = geoLoading || weatherLoading || forecastLoading;
  const hasError = weatherError || forecastError;
  const hasLocationError = geoError && !selectedCity;

  const cityName = selectedCity?.name || currentWeather?.name || "";
  const cityCountry = currentWeather?.sys?.country || "";

  const hourlyData = forecast ? getHourlyFromForecast(forecast) : undefined;
  const dailyData = forecast ? getDailyFromForecast(forecast) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header onCitySelect={handleCitySelect} />

      <main className="container mx-auto px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <FavoritesList onCitySelect={handleCitySelect} />
          </motion.div>

          <AnimatePresence mode="wait">
            {hasLocationError && (
              <motion.div
                key="location-error"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
              >
                <LocationPermissionError
                  onRetry={retryGeo}
                  onManualSearch={handleManualSearch}
                />
              </motion.div>
            )}

            {hasError && !hasLocationError && (
              <motion.div
                key="api-error"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
              >
                <ErrorMessage
                  title="날씨 정보를 불러올 수 없습니다"
                  message="잠시 후 다시 시도해 주세요. 문제가 지속되면 API 키를 확인해 주세요."
                  onRetry={handleRetry}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!hasLocationError && (
            <>
              <motion.div variants={itemVariants} className="relative">
                <CurrentWeather
                  data={currentWeather}
                  cityName={cityName}
                  isLoading={isLoading}
                />
                {currentWeather && lat && lon && (
                  <div className="absolute top-4 right-4">
                    <FavoriteButton
                      city={{
                        name: cityName,
                        lat,
                        lon,
                        country: cityCountry,
                      }}
                    />
                  </div>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <HourlyForecast data={hourlyData} isLoading={isLoading} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <DailyForecast data={dailyData} isLoading={isLoading} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <WeatherDetails data={currentWeather} isLoading={isLoading} />
              </motion.div>
            </>
          )}
        </motion.div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>Weather Dashboard - OpenWeatherMap API 사용</p>
      </footer>
    </div>
  );
}
