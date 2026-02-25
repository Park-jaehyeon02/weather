import type {
  City,
  CurrentWeather,
  ForecastResponse,
  DailyForecast,
} from "@/types/weather";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org";

export class WeatherApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "WeatherApiError";
  }
}

export const searchCities = async (query: string): Promise<City[]> => {
  if (!query || query.length < 2) return [];

  const response = await fetch(
    `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new WeatherApiError("도시 검색에 실패했습니다", response.status);
  }

  return response.json();
};

export const getCurrentWeather = async (
  lat: number,
  lon: number
): Promise<CurrentWeather> => {
  const response = await fetch(
    `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new WeatherApiError(
      "현재 날씨 정보를 가져오는데 실패했습니다",
      response.status
    );
  }

  return response.json();
};

export const getForecast = async (
  lat: number,
  lon: number
): Promise<ForecastResponse> => {
  const response = await fetch(
    `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new WeatherApiError(
      "예보 정보를 가져오는데 실패했습니다",
      response.status
    );
  }

  return response.json();
};

export const getHourlyFromForecast = (forecast: ForecastResponse) => {
  return forecast.list.slice(0, 8);
};

export const getDailyFromForecast = (
  forecast: ForecastResponse
): DailyForecast[] => {
  const dailyMap = new Map<
    string,
    {
      dt: number;
      temps: number[];
      weather: ForecastResponse["list"][0]["weather"];
      pops: number[];
      humidities: number[];
      windSpeeds: number[];
    }
  >();

  forecast.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];

    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        dt: item.dt,
        temps: [],
        weather: item.weather,
        pops: [],
        humidities: [],
        windSpeeds: [],
      });
    }

    const day = dailyMap.get(date)!;
    day.temps.push(item.main.temp_min, item.main.temp_max);
    day.pops.push(item.pop);
    day.humidities.push(item.main.humidity);
    day.windSpeeds.push(item.wind.speed);

    const hour = parseInt(item.dt_txt.split(" ")[1].split(":")[0]);
    if (hour >= 12 && hour <= 15) {
      day.weather = item.weather;
    }
  });

  return Array.from(dailyMap.values())
    .slice(0, 7)
    .map((day) => ({
      dt: day.dt,
      temp_min: Math.min(...day.temps),
      temp_max: Math.max(...day.temps),
      weather: day.weather,
      pop: Math.max(...day.pops),
      humidity: Math.round(
        day.humidities.reduce((a, b) => a + b, 0) / day.humidities.length
      ),
      wind_speed: Math.max(...day.windSpeeds),
    }));
};

export const getWeatherIconUrl = (
  iconCode: string,
  size: "1x" | "2x" | "4x" = "2x"
): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};

export const getWeatherBackground = (
  weatherMain: string,
  isDay: boolean
): string => {
  const backgrounds: Record<string, { day: string; night: string }> = {
    Clear: {
      day: "from-sky-400 via-blue-500 to-blue-600",
      night: "from-indigo-900 via-purple-900 to-slate-900",
    },
    Clouds: {
      day: "from-slate-300 via-slate-400 to-slate-500",
      night: "from-slate-700 via-slate-800 to-slate-900",
    },
    Rain: {
      day: "from-slate-400 via-slate-500 to-slate-600",
      night: "from-slate-800 via-slate-900 to-gray-900",
    },
    Drizzle: {
      day: "from-slate-300 via-slate-400 to-slate-500",
      night: "from-slate-700 via-slate-800 to-slate-900",
    },
    Thunderstorm: {
      day: "from-slate-500 via-slate-600 to-slate-700",
      night: "from-slate-900 via-gray-900 to-black",
    },
    Snow: {
      day: "from-slate-100 via-slate-200 to-slate-300",
      night: "from-slate-600 via-slate-700 to-slate-800",
    },
    Mist: {
      day: "from-slate-200 via-slate-300 to-slate-400",
      night: "from-slate-600 via-slate-700 to-slate-800",
    },
    Fog: {
      day: "from-slate-200 via-slate-300 to-slate-400",
      night: "from-slate-600 via-slate-700 to-slate-800",
    },
    Haze: {
      day: "from-amber-200 via-amber-300 to-amber-400",
      night: "from-amber-800 via-amber-900 to-slate-900",
    },
  };

  const bg = backgrounds[weatherMain] || backgrounds.Clear;
  return isDay ? bg.day : bg.night;
};
