"use client";

import { Button } from "@/components/ui/button";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { useEffect, useState } from "react";

export const UnitToggle = () => {
  const { unit, toggleUnit } = useTemperatureUnit();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-16 font-mono text-sm"
        aria-label="온도 단위 변경"
      >
        °C
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleUnit}
      className="w-16 font-mono text-sm"
      aria-label={
        unit === "celsius" ? "화씨로 변경" : "섭씨로 변경"
      }
      tabIndex={0}
    >
      {unit === "celsius" ? "°C" : "°F"}
    </Button>
  );
};
