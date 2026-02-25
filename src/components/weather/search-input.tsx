"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useCitySearch } from "@/hooks/useCitySearch";
import type { City } from "@/types/weather";

type SearchInputProps = {
  onCitySelect: (city: { name: string; lat: number; lon: number }) => void;
};

export const SearchInput = ({ onCitySelect }: SearchInputProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { data: cities, isLoading } = useCitySearch(debouncedQuery);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city: City) => {
    onCitySelect({
      name: city.local_names?.ko || city.name,
      lat: city.lat,
      lon: city.lon,
    });
    setQuery("");
    setIsOpen(false);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLLIElement>,
    city: City
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect(city);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="도시 검색..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
          aria-label="도시 검색"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && cities && cities.length > 0 && (
        <ul
          role="listbox"
          className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md"
        >
          {cities.map((city, index) => (
            <li
              key={`${city.lat}-${city.lon}-${index}`}
              role="option"
              tabIndex={0}
              onClick={() => handleSelect(city)}
              onKeyDown={(e) => handleKeyDown(e, city)}
              className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent focus:bg-accent focus:outline-none"
              aria-selected={false}
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium">
                  {city.local_names?.ko || city.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {city.state ? `${city.state}, ` : ""}
                  {city.country}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOpen && debouncedQuery && cities?.length === 0 && !isLoading && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-3 text-center text-sm text-muted-foreground shadow-md">
          검색 결과가 없습니다
        </div>
      )}
    </div>
  );
};
