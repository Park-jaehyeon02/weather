"use client";

import Image from "next/image";
import { MapPin, Thermometer, Droplets, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getWeatherIconUrl, getWeatherBackground } from "@/services/weather";
import {
  useTemperatureUnit,
  formatTemperature,
} from "@/hooks/useTemperatureUnit";
import type { CurrentWeather as CurrentWeatherType } from "@/types/weather";

type CurrentWeatherProps = {
  data: CurrentWeatherType | undefined;
  cityName: string;
  isLoading: boolean;
};

export const CurrentWeather = ({
  data,
  cityName,
  isLoading,
}: CurrentWeatherProps) => {
  const { unit } = useTemperatureUnit();

  if (isLoading) {
    return <CurrentWeatherSkeleton />;
  }

  if (!data) {
    return null;
  }

  const weather = data.weather[0];
  const currentTime = Date.now() / 1000;
  const isDay = currentTime > data.sys.sunrise && currentTime < data.sys.sunset;
  const backgroundGradient = getWeatherBackground(weather.main, isDay);

  return (
    <Card
      className={`overflow-hidden bg-gradient-to-br ${backgroundGradient} text-white border-0 shadow-xl`}
    >
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="h-5 w-5" />
              <span className="text-lg font-medium">
                {cityName || data.name}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-7xl md:text-8xl font-light tracking-tighter">
                {formatTemperature(data.main.temp, unit)}
              </span>
            </div>

            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-1">
                <Thermometer className="h-4 w-4" />
                <span className="text-sm">
                  체감 {formatTemperature(data.main.feels_like, unit)}
                </span>
              </div>
              <div className="text-sm">
                최고 {formatTemperature(data.main.temp_max, unit)} / 최저{" "}
                {formatTemperature(data.main.temp_min, unit)}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <Image
              src={getWeatherIconUrl(weather.icon, "4x")}
              alt={weather.description}
              width={120}
              height={120}
              className="drop-shadow-lg"
              priority
            />
            <span className="text-xl font-medium capitalize">
              {weather.description}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-white/70" />
            <div>
              <p className="text-sm text-white/70">습도</p>
              <p className="font-medium">{data.main.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-white/70" />
            <div>
              <p className="text-sm text-white/70">풍속</p>
              <p className="font-medium">{data.wind.speed} m/s</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 flex items-center justify-center text-white/70">
              👁
            </div>
            <div>
              <p className="text-sm text-white/70">가시거리</p>
              <p className="font-medium">{(data.visibility / 1000).toFixed(1)} km</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 flex items-center justify-center text-white/70">
              🌡
            </div>
            <div>
              <p className="text-sm text-white/70">기압</p>
              <p className="font-medium">{data.main.pressure} hPa</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CurrentWeatherSkeleton = () => {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-slate-400 to-slate-500 border-0">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 bg-white/20" />
            <Skeleton className="h-20 w-48 bg-white/20" />
            <Skeleton className="h-4 w-40 bg-white/20" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-28 w-28 rounded-full bg-white/20" />
            <Skeleton className="h-6 w-24 bg-white/20" />
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-white/20" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
