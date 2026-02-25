"use client";

import {
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  CloudRain,
  Thermometer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CurrentWeather } from "@/types/weather";
import {
  useTemperatureUnit,
  formatTemperature,
} from "@/hooks/useTemperatureUnit";

type WeatherDetailsProps = {
  data: CurrentWeather | undefined;
  isLoading: boolean;
};

type DetailCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  description?: string;
};

const DetailCard = ({ icon, title, value, description }: DetailCardProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

const DetailCardSkeleton = () => {
  return (
    <Card className="bg-card/50">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-24 mt-2" />
      </CardContent>
    </Card>
  );
};

export const WeatherDetails = ({ data, isLoading }: WeatherDetailsProps) => {
  const { unit } = useTemperatureUnit();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <DetailCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <DetailCard
        icon={<Thermometer className="h-4 w-4" />}
        title="체감 온도"
        value={formatTemperature(data.main.feels_like, unit)}
        description={
          data.main.feels_like < data.main.temp
            ? "실제보다 춥게 느껴짐"
            : data.main.feels_like > data.main.temp
              ? "실제보다 덥게 느껴짐"
              : "실제 온도와 비슷"
        }
      />
      <DetailCard
        icon={<Droplets className="h-4 w-4" />}
        title="습도"
        value={`${data.main.humidity}%`}
        description={
          data.main.humidity > 70
            ? "습함"
            : data.main.humidity < 30
              ? "건조함"
              : "적정"
        }
      />
      <DetailCard
        icon={<Wind className="h-4 w-4" />}
        title="풍속"
        value={`${data.wind.speed} m/s`}
        description={`${data.wind.deg}° 방향`}
      />
      <DetailCard
        icon={<Eye className="h-4 w-4" />}
        title="가시거리"
        value={`${(data.visibility / 1000).toFixed(1)} km`}
        description={data.visibility >= 10000 ? "맑음" : "흐림"}
      />
      <DetailCard
        icon={<Gauge className="h-4 w-4" />}
        title="기압"
        value={`${data.main.pressure} hPa`}
        description={data.main.pressure > 1013 ? "고기압" : "저기압"}
      />
      <DetailCard
        icon={<CloudRain className="h-4 w-4" />}
        title="구름"
        value={`${data.clouds.all}%`}
        description={
          data.clouds.all > 80
            ? "흐림"
            : data.clouds.all > 40
              ? "구름 많음"
              : "맑음"
        }
      />
      <DetailCard
        icon={<Sunrise className="h-4 w-4" />}
        title="일출"
        value={formatTime(data.sys.sunrise)}
      />
      <DetailCard
        icon={<Sunset className="h-4 w-4" />}
        title="일몰"
        value={formatTime(data.sys.sunset)}
      />
    </div>
  );
};
