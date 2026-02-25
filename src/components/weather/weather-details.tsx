"use client";

import {
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  CloudRain,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ForecastResponse } from "@/types/weather";

type WeatherDetailsProps = {
  data: ForecastResponse | undefined;
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

  const { current } = data;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUvDescription = (uvi: number) => {
    if (uvi <= 2) return "낮음";
    if (uvi <= 5) return "보통";
    if (uvi <= 7) return "높음";
    if (uvi <= 10) return "매우 높음";
    return "위험";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <DetailCard
        icon={<Droplets className="h-4 w-4" />}
        title="습도"
        value={`${current.humidity}%`}
        description={
          current.humidity > 70
            ? "습함"
            : current.humidity < 30
              ? "건조함"
              : "적정"
        }
      />
      <DetailCard
        icon={<Wind className="h-4 w-4" />}
        title="풍속"
        value={`${current.wind_speed} m/s`}
        description={`${current.wind_deg}° 방향`}
      />
      <DetailCard
        icon={<Sun className="h-4 w-4" />}
        title="자외선 지수"
        value={current.uvi.toFixed(1)}
        description={getUvDescription(current.uvi)}
      />
      <DetailCard
        icon={<Eye className="h-4 w-4" />}
        title="가시거리"
        value={`${(current.visibility / 1000).toFixed(1)} km`}
        description={current.visibility >= 10000 ? "맑음" : "흐림"}
      />
      <DetailCard
        icon={<Gauge className="h-4 w-4" />}
        title="기압"
        value={`${current.pressure} hPa`}
        description={
          current.pressure > 1013 ? "고기압" : "저기압"
        }
      />
      <DetailCard
        icon={<CloudRain className="h-4 w-4" />}
        title="구름"
        value={`${current.clouds}%`}
        description={
          current.clouds > 80
            ? "흐림"
            : current.clouds > 40
              ? "구름 많음"
              : "맑음"
        }
      />
      <DetailCard
        icon={<Sunrise className="h-4 w-4" />}
        title="일출"
        value={formatTime(current.sunrise)}
      />
      <DetailCard
        icon={<Sunset className="h-4 w-4" />}
        title="일몰"
        value={formatTime(current.sunset)}
      />
    </div>
  );
};
