"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getWeatherIconUrl } from "@/services/weather";
import {
  useTemperatureUnit,
  formatTemperature,
} from "@/hooks/useTemperatureUnit";
import type { ForecastItem } from "@/types/weather";
import { Clock } from "lucide-react";

type HourlyForecastProps = {
  data: ForecastItem[] | undefined;
  isLoading: boolean;
};

export const HourlyForecast = ({ data, isLoading }: HourlyForecastProps) => {
  const { unit } = useTemperatureUnit();

  if (isLoading) {
    return <HourlyForecastSkeleton />;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const formatHour = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();

    if (Math.abs(date.getTime() - now.getTime()) < 3600000) {
      return "지금";
    }

    return `${date.getHours()}시`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5" />
          시간별 예보
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {data.map((item) => (
            <div
              key={item.dt}
              className="flex flex-col items-center gap-2 min-w-[72px] p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="text-sm font-medium text-muted-foreground">
                {formatHour(item.dt)}
              </span>
              <Image
                src={getWeatherIconUrl(item.weather[0].icon, "2x")}
                alt={item.weather[0].description}
                width={48}
                height={48}
              />
              <span className="text-base font-semibold">
                {formatTemperature(item.main.temp, unit)}
              </span>
              {item.pop > 0 && (
                <span className="text-xs text-blue-500">
                  {Math.round(item.pop * 100)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const HourlyForecastSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 min-w-[72px] p-3"
            >
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-5 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
