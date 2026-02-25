"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useEffect, useState } from "react";
import type { FavoriteCity } from "@/types/weather";

type FavoriteButtonProps = {
  city: FavoriteCity;
};

export const FavoriteButton = ({ city }: FavoriteButtonProps) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLiked(isFavorite(city.lat, city.lon));
  }, [city.lat, city.lon, isFavorite]);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="즐겨찾기 추가">
        <Heart className="h-5 w-5" />
      </Button>
    );
  }

  const handleToggle = () => {
    if (isLiked) {
      removeFavorite(city.lat, city.lon);
      setIsLiked(false);
    } else {
      addFavorite(city);
      setIsLiked(true);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={isLiked ? "즐겨찾기 제거" : "즐겨찾기 추가"}
      tabIndex={0}
      className="hover:bg-white/20"
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          isLiked ? "fill-red-500 text-red-500" : "text-current"
        }`}
      />
    </Button>
  );
};
