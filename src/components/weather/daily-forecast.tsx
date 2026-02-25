"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getWeatherIconUrl } from "@/services/weather";
import {
  useTemperatureUnit,
  formatTemperature,
} from "@/hooks/useTemperatureUnit";
import type { DailyForecast as DailyForecastType } from "@/types/weather";
import { Calendar, Droplets } from "lucide-react";

type DailyForecastProps = {
  data: DailyForecastType[] | undefined;
  isLoading: boolean;
};

export const DailyForecast = ({ data, isLoading }: DailyForecastProps) => {
  const { unit } = useTemperatureUnit();

  if (isLoading) {
    return <DailyForecastSkeleton />;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const dailyData = data.slice(0, 7);

  const formatDay = (timestamp: number, index: number) => {
    if (index === 0) return "오늘";
    if (index === 1) return "내일";

    const date = new Date(timestamp * 1000);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getMonth() + 1}/${date.getDate()} (${days[date.getDay()]})`;
  };

  const maxTemp = Math.max(...dailyData.map((d) => d.temp.max));
  const minTemp = Math.min(...dailyData.map((d) => d.temp.min));
  const tempRange = maxTemp - minTemp;

  const getBarPosition = (min: number, max: number) => {
    const left = ((min - minTemp) / tempRange) * 100;
    const width = ((max - min) / tempRange) * 100;
    return { left: `${left}%`, width: `${Math.max(width, 10)}%` };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          7일 예보
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {dailyData.map((day, index) => {
          const barStyle = getBarPosition(day.temp.min, day.temp.max);

          return (
            <div
              key={day.dt}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="w-24 text-sm font-medium">
                {formatDay(day.dt, index)}
              </span>

              <div className="flex items-center gap-1 w-16">
                <Image
                  src={getWeatherIconUrl(day.weather[0].icon, "2x")}
                  alt={day.weather[0].description}
                  width={40}
                  height={40}
                />
              </div>

              {day.pop > 0 && (
                <div className="flex items-center gap-1 w-12 text-blue-500">
                  <Droplets className="h-3 w-3" />
                  <span className="text-xs">{Math.round(day.pop * 100)}%</span>
                </div>
              )}
              {day.pop === 0 && <div className="w-12" />}

              <span className="w-12 text-sm text-muted-foreground text-right">
                {formatTemperature(day.temp.min, unit)}
              </span>

              <div className="flex-1 h-2 bg-muted rounded-full relative min-w-[100px]">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-500"
                  style={barStyle}
                />
              </div>

              <span className="w-12 text-sm font-medium">
                {formatTemperature(day.temp.max, unit)}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

const DailyForecastSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent className="space-y-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="flex-1 h-2 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
