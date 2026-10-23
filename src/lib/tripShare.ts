import { sampleDestinations } from '../data/destinations';
import type { FoodPreference, StayType, TravelMode, TravelStyle, TripInput } from '../types';

const MAX_STRING_LENGTH = 60;
const ORIGINS: Record<string, [number, number]> = {
  Pune: [73.8567, 18.5204],
  Mumbai: [72.8777, 19.076],
  Nashik: [73.7898, 19.9975],
  'Chhatrapati Sambhajinagar': [75.3433, 19.8762],
  Nagpur: [79.0882, 21.1458],
  Kolhapur: [74.2433, 16.705],
};

export function getTripOrigin(name: string): { name: string; coordinates: [number, number] } | null {
  const coordinates = ORIGINS[name];
  return coordinates ? { name, coordinates } : null;
}

type SharedTripPayload = {
  destination: string;
  origin: string;
  departureTime: string;
  travelers: number;
  days: number;
  travelMode: TravelMode;
  stayType: StayType;
  travelStyle: TravelStyle;
  foodPreference: FoodPreference;
};

export type ShareableTripInput = TripInput & { departureTime: string };

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const isOneOf = <T extends string>(value: unknown, allowed: readonly T[]): value is T =>
  typeof value === 'string' && allowed.includes(value as T);
const isShortString = (value: unknown): value is string => typeof value === 'string' && value.length > 0 && value.length <= MAX_STRING_LENGTH;
const isTime = (value: unknown): value is string => typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
const clampInteger = (value: unknown, minimum: number, maximum: number): number | null =>
  typeof value === 'number' && Number.isInteger(value) && value >= minimum && value <= maximum ? value : null;

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string): string | null {
  try {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
    const binary = atob(padded);
    return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
  } catch {
    return null;
  }
}

/** Encodes only form inputs; generated itinerary and costs are intentionally omitted. */
export function encodeTrip(input: ShareableTripInput): string {
  const payload: SharedTripPayload = {
    destination: input.destination,
    origin: input.origin.name,
    departureTime: input.departureTime,
    travelers: input.people,
    days: input.days,
    travelMode: input.travelMode,
    stayType: input.stayType,
    travelStyle: input.travelStyle,
    foodPreference: input.foodPreference,
  };
  return toBase64Url(JSON.stringify(payload));
}

/** Decodes and strictly validates URL data before it reaches planner state. */
export function decodeTrip(param: string | null): ShareableTripInput | null {
  if (!param || param.length > 2000) return null;
  const decoded = fromBase64Url(param);
  if (!decoded) return null;
  try {
    const value: unknown = JSON.parse(decoded);
    if (!isRecord(value)
      || !isShortString(value.destination)
      || !sampleDestinations.some((destination) => destination.slug === value.destination)
      || !isShortString(value.origin)
      || !getTripOrigin(value.origin)
      || !isTime(value.departureTime)
      || !isOneOf(value.travelMode, ['car', 'bus', 'train', 'bike'])
      || !isOneOf(value.stayType, ['budget', 'standard', 'premium'])
      || !isOneOf(value.travelStyle, ['relaxed', 'balanced', 'adventure'])
      || !isOneOf(value.foodPreference, ['veg', 'nonveg', 'both'])) return null;

    const people = clampInteger(value.travelers, 1, 10);
    const days = clampInteger(value.days, 1, 7);
    if (people === null || days === null) return null;
    return {
      destination: value.destination,
      origin: getTripOrigin(value.origin)!,
      departureTime: value.departureTime,
      people,
      days,
      travelMode: value.travelMode,
      stayType: value.stayType,
      travelStyle: value.travelStyle,
      foodPreference: value.foodPreference,
    };
  } catch {
    return null;
  }
}

export function buildShareUrl(input: ShareableTripInput): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${window.location.origin}${base}/plan/${input.destination}?trip=${encodeTrip(input)}`;
}
