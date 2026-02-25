"use client";

import { Star, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFavorites } from "@/hooks/useFavorites";
import { useEffect, useState } from "react";
import type { FavoriteCity } from "@/types/weather";

type FavoritesListProps = {
  onCitySelect: (city: { name: string; lat: number; lon: number }) => void;
};

export const FavoritesList = ({ onCitySelect }: FavoritesListProps) => {
  const { favorites, removeFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (favorites.length === 0) {
    return null;
  }

  const handleSelect = (city: FavoriteCity) => {
    onCitySelect({
      name: city.name,
      lat: city.lat,
      lon: city.lon,
    });
  };

  const handleRemove = (
    e: React.MouseEvent,
    lat: number,
    lon: number
  ) => {
    e.stopPropagation();
    removeFavorite(lat, lon);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    city: FavoriteCity
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(city);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-yellow-500" />
          즐겨찾기
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {favorites.map((city) => (
            <div
              key={`${city.lat}-${city.lon}`}
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(city)}
              onKeyDown={(e) => handleKeyDown(e, city)}
              className="group flex items-center gap-2 px-3 py-2 rounded-full bg-muted hover:bg-muted/80 cursor-pointer transition-colors"
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{city.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleRemove(e, city.lat, city.lon)}
                aria-label={`${city.name} 즐겨찾기 제거`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
