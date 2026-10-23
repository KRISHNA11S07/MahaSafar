import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CloudRain, Droplets, RefreshCw, Wind } from 'lucide-react';
import type { Destination } from '../../types';
import {
  fetchWeather,
  getMonsoonSafetyNote,
  getWeatherCondition,
  isThunderstorm,
  type WeatherData,
} from '../../lib/weather';
import './WeatherCard.css';

interface WeatherCardProps {
  destination: Destination;
}

type Verdict = {
  level: 'great' | 'okay' | 'not-ideal';
  title: string;
  reason: string;
};

function getVerdict(destination: Destination, weather: WeatherData): Verdict {
  const current = weather.current;
  const today = weather.daily[0];
  const rainyOrStormy = isThunderstorm(current.weatherCode)
    || isThunderstorm(today.weatherCode)
    || today.precipitationProbabilityMax >= 70
    || today.precipitationSum >= 15;
  const extremeTemperature = current.temperature >= 40 || current.temperature <= 8;
  if (rainyOrStormy || extremeTemperature) {
    return {
      level: 'not-ideal',
      title: 'Not ideal',
      reason: rainyOrStormy ? 'Heavy rain expected, plan for another week.' : 'Extreme temperature expected, plan a more comfortable day.',
    };
  }

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'Asia/Kolkata' }).format(new Date());
  const isBestTime = destination.bestTime.months.some((month) => month.toLowerCase() === monthName.toLowerCase());
  if (isBestTime && current.precipitation <= 2 && today.precipitationProbabilityMax < 50) {
    return { level: 'great', title: 'Great time', reason: 'Peak season, dry and pleasant.' };
  }
  return { level: 'okay', title: 'Okay', reason: 'Conditions look manageable; pack for changing weather.' };
}

function formatDay(date: string, index: number): string {
  if (index === 0) return 'Today';
  return new Intl.DateTimeFormat('en-IN', { weekday: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(`${date}T12:00:00`));
}

export default function WeatherCard({ destination }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const [longitude, latitude] = destination.location.coordinates;
    fetchWeather(latitude, longitude, destination.slug, controller.signal)
      .then((data) => setWeather(data))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setHasError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [destination, retryCount]);

  const retry = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount((count) => count + 1);
  }, []);

  if (isLoading) {
    return (
      <section className="weather-card weather-card--loading" aria-label="Loading live weather" aria-live="polite">
        <div className="weather-card__skeleton weather-card__skeleton--heading" />
        <div className="weather-card__skeleton weather-card__skeleton--current" />
        <div className="weather-card__skeleton weather-card__skeleton--forecast" />
      </section>
    );
  }

  if (hasError || !weather) {
    return (
      <section className="weather-card weather-card--error" aria-live="assertive">
        <CloudRain size={28} aria-hidden="true" />
        <div>
          <h2>Weather ata uplabdh nahi</h2>
          <p>Thodya velane punha prayatna kara.</p>
        </div>
        <button type="button" className="weather-card__retry" onClick={retry} aria-label="Retry weather request">
          <RefreshCw size={15} aria-hidden="true" /> Retry
        </button>
      </section>
    );
  }

  const condition = getWeatherCondition(weather.current.weatherCode);
  const CurrentIcon = condition.Icon;
  const verdict = getVerdict(destination, weather);
  const safety = getMonsoonSafetyNote(destination, weather);

  return (
    <section className="weather-card" aria-label={`Live weather for ${destination.name}`}>
      <div className="weather-card__heading">
        <div>
          <span className="weather-card__eyebrow">Live weather</span>
          <h2>{destination.name} right now</h2>
        </div>
        <div className={`weather-card__verdict weather-card__verdict--${verdict.level}`}>
          <strong>{verdict.title}</strong>
          <span>{verdict.reason}</span>
        </div>
      </div>

      <div className="weather-card__current">
        <CurrentIcon className="weather-card__condition-icon" size={48} aria-hidden="true" />
        <div>
          <span className="weather-card__temperature">{Math.round(weather.current.temperature)}°</span>
          <span className="weather-card__condition">{condition.label}</span>
          <p>Feels like {Math.round(weather.current.apparentTemperature)}°C</p>
        </div>
        <dl className="weather-card__metrics" aria-label="Current weather details">
          <div><dt><Droplets size={15} aria-hidden="true" /> Humidity</dt><dd>{Math.round(weather.current.humidity)}%</dd></div>
          <div><dt><Wind size={15} aria-hidden="true" /> Wind</dt><dd>{Math.round(weather.current.windSpeed)} km/h</dd></div>
          <div><dt><CloudRain size={15} aria-hidden="true" /> Rain</dt><dd>{weather.current.precipitation.toFixed(1)} mm</dd></div>
        </dl>
      </div>

      <div className="weather-card__forecast" aria-label="Five day forecast">
        {weather.daily.map((day, index) => {
          const dayCondition = getWeatherCondition(day.weatherCode);
          const DayIcon = dayCondition.Icon;
          return (
            <div className="weather-card__day" key={day.date}>
              <span>{formatDay(day.date, index)}</span>
              <DayIcon size={22} aria-label={dayCondition.label} />
              <strong>{Math.round(day.temperatureMax)}° <small>{Math.round(day.temperatureMin)}°</small></strong>
              <em><Droplets size={12} aria-hidden="true" /> {Math.round(day.precipitationProbabilityMax)}%</em>
            </div>
          );
        })}
      </div>

      {safety && (
        <aside className={`weather-card__safety ${safety.strong ? 'weather-card__safety--strong' : ''}`} aria-label="Monsoon safety warning">
          <AlertTriangle size={20} aria-hidden="true" />
          <div><strong>{safety.strong ? 'High monsoon caution' : 'Monsoon safety note'}</strong><p>{safety.message}</p></div>
        </aside>
      )}
      <p className="weather-card__disclaimer">Weather data by Open-Meteo. Pratyaksh jaanyapurvi local conditions check kara.</p>
    </section>
  );
}
