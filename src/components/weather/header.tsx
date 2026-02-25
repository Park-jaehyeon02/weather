"use client";

import { CloudSun } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { SearchInput } from "./search-input";
import { UnitToggle } from "./unit-toggle";

type HeaderProps = {
  onCitySelect: (city: { name: string; lat: number; lon: number }) => void;
};

export const Header = ({ onCitySelect }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2">
          <CloudSun className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold hidden sm:inline">
            Weather Dashboard
          </span>
        </div>

        <div className="flex-1 max-w-md">
          <SearchInput onCitySelect={onCitySelect} />
        </div>

        <div className="flex items-center gap-2">
          <UnitToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
