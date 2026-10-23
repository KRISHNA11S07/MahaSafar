import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Snowflake,
  Sun,
  type LucideIcon,
} from 'lucide-react';

export interface WeatherCurrent {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
}

export interface WeatherDay {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
}

export interface WeatherData {
  current: WeatherCurrent;
  daily: WeatherDay[];
}

export interface WeatherCondition {
  label: string;
  Icon: LucideIcon;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
  };
}

interface CachedWeather {
  savedAt: number;
  data: WeatherData;
}

export interface MonsoonSafetyPlace {
  categories?: string[];
  safetyNote?: string;
}

export interface MonsoonSafetyNote {
  strong: boolean;
  message: string;
}

const CACHE_DURATION = 30 * 60 * 1000;
const MONSOON_MONTHS = [5, 6, 7, 8];
// These are the exact risk-related category slugs used in src/data/categories.ts.
const MONSOON_RISK_CATEGORIES = new Set(['fort', 'waterfall', 'trek', 'hill-station', 'mountain']);

export function getWeatherCondition(weatherCode: number): WeatherCondition {
  if (weatherCode === 0) return { label: 'Clear sky', Icon: Sun };
  if (weatherCode === 1 || weatherCode === 2) return { label: 'Partly cloudy', Icon: CloudSun };
  if (weatherCode === 3) return { label: 'Overcast', Icon: Cloud };
  if (weatherCode === 45 || weatherCode === 48) return { label: 'Foggy', Icon: CloudFog };
  if ([51, 53, 55, 56, 57].includes(weatherCode)) return { label: 'Drizzle', Icon: CloudDrizzle };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return { label: 'Rain', Icon: CloudRain };
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return { label: 'Snow', Icon: Snowflake };
  if ([95, 96, 99].includes(weatherCode)) return { label: 'Thunderstorm', Icon: CloudLightning };
  return { label: 'Cloudy', Icon: Cloud };
}

export function isThunderstorm(weatherCode: number): boolean {
  return [95, 96, 99].includes(weatherCode);
}

export function getKolkataMonth(): number {
  const month = new Intl.DateTimeFormat('en-US', { month: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date());
  return Number(month) - 1;
}

export function getMonsoonSafetyNote(
  place: MonsoonSafetyPlace,
  weather?: WeatherData,
): MonsoonSafetyNote | null {
  const isMonsoon = MONSOON_MONTHS.includes(getKolkataMonth());
  const hasRiskCategory = place.categories?.some((category) => MONSOON_RISK_CATEGORIES.has(category)) ?? false;
  if (!isMonsoon || (!hasRiskCategory && !place.safetyNote)) return null;

  const today = weather?.daily[0];
  const strong = Boolean(
    (today && today.precipitationProbabilityMax >= 60) ||
    (weather && isThunderstorm(weather.current.weatherCode)) ||
    (today && isThunderstorm(today.weatherCode)),
  );
  const base = strong
    ? 'Heavy rain or thunderstorms are possible. Avoid exposed trails and postpone if local authorities advise.'
    : 'Monsoon conditions can change quickly. Expect slippery paths, landslide or rockfall risk, and fast-flowing water.';
  const localNote = place.safetyNote ? ` ${place.safetyNote}` : '';

  return {
    strong,
    message: `${base} Prefer guided daytime visits and check local advisories before leaving.${localNote}`,
  };
}

function cacheKey(slug?: string): string | null {
  return slug ? `mahasafar_weather_${slug}` : null;
}

function getCachedWeather(slug?: string): WeatherData | null {
  const key = cacheKey(slug);
  if (!key) return null;
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) || 'null') as CachedWeather | null;
    return cached && Date.now() - cached.savedAt < CACHE_DURATION ? cached.data : null;
  } catch {
    return null;
  }
}

function saveCachedWeather(slug: string | undefined, data: WeatherData): void {
  const key = cacheKey(slug);
  if (!key) return;
  try {
    sessionStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data } satisfies CachedWeather));
  } catch {
    // Private browsing or storage policies must not prevent weather loading.
  }
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
  slug?: string,
  signal?: AbortSignal,
): Promise<WeatherData> {
  const cached = getCachedWeather(slug);
  if (cached) return cached;

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
    timezone: 'Asia/Kolkata',
    forecast_days: '5',
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { signal });
  if (!response.ok) throw new Error('Weather request failed');

  const payload = await response.json() as OpenMeteoResponse;
  const data: WeatherData = {
    current: {
      temperature: payload.current.temperature_2m,
      apparentTemperature: payload.current.apparent_temperature,
      humidity: payload.current.relative_humidity_2m,
      precipitation: payload.current.precipitation,
      weatherCode: payload.current.weather_code,
      windSpeed: payload.current.wind_speed_10m,
    },
    daily: payload.daily.time.map((date, index) => ({
      date,
      weatherCode: payload.daily.weather_code[index],
      temperatureMax: payload.daily.temperature_2m_max[index],
      temperatureMin: payload.daily.temperature_2m_min[index],
      precipitationSum: payload.daily.precipitation_sum[index],
      precipitationProbabilityMax: payload.daily.precipitation_probability_max[index],
    })),
  };
  saveCachedWeather(slug, data);
  return data;
}
