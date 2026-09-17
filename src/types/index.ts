// MahaSafar — Core TypeScript Types

// ---- Region & Geography ----
export interface Region {
  _id: string;
  name: string;
  slug: string;
  chapterNumber: number;
  description: string;
  visualPersonality: VisualPersonality;
  districts: string[];
  order: number;
}

export interface VisualPersonality {
  primaryColor: string;
  mood: string;
  typography: string;
}

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

// ---- District ----
export interface District {
  _id: string;
  name: string;
  slug: string;
  region: string;
  center: GeoPoint;
  heroImage: string;
  thumbnailImage: string;
  description: string;
  tagline: string;
  highlights: string[];
  destinationCount: number;
  order: number;
}

// ---- Destination ----
export interface Destination {
  _id: string;
  name: string;
  slug: string;
  district: string;
  districtName: string;
  region: string;
  categories: string[];
  location: GeoPoint;
  bestTime: {
    months: string[];
    season: string;
  };
  idealDays: number;
  distanceFromPune: number;
  distanceFromMumbai: number;
  activities: Activity[];
  story: string;
  tagline: string;
  images: DestinationImage[];
  topPlaces: TopPlace[];
  foodAndCulture: {
    description: string;
    specialities: string[];
  };
  howToReach: {
    road: string;
    rail: string;
    air: string;
  };
  stayOptions: {
    budget: StayOption;
    standard: StayOption;
    premium: StayOption;
  };
  itineraryTemplates: ItineraryTemplate[];
  popularity: number;
  hidden: boolean;
  featured: boolean;
}

export interface Activity {
  name: string;
  category: string;
  duration: string;
  estimatedCost: number;
}

export interface DestinationImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface TopPlace {
  name: string;
  description: string;
  image: string;
  categories: string[];
}

export interface StayOption {
  range: string;
  description: string;
}

// ---- Itinerary ----
export interface ItineraryTemplate {
  days: number;
  title: string;
  timeline: ItineraryDay[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  events: ItineraryEvent[];
}

export interface ItineraryEvent {
  time: string;
  title: string;
  description: string;
  duration?: string;
  type: 'travel' | 'activity' | 'food' | 'rest' | 'sightseeing';
  isOptional?: boolean;
}

// ---- Hidden Spots ----
export type HiddenBadge = 
  | 'hidden-gem'
  | 'local-favourite'
  | 'nature-escape'
  | 'photography-spot'
  | 'sunset-point'
  | 'offbeat';

export interface HiddenSpot {
  _id: string;
  name: string;
  slug: string;
  destination: string;
  destinationName: string;
  district: string;
  districtName: string;
  location: GeoPoint;
  badge: HiddenBadge;
  description: string;
  whyVisit: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  crowdLevel: 'very-low' | 'low' | 'moderate' | 'high';
  bestTime: string;
  accessibility: string;
  nearbyAttractions: string[];
  safetyNote: string;
  images: DestinationImage[];
}

// ---- Trip ----
export type TravelMode = 'bike' | 'car' | 'bus' | 'train';
export type StayType = 'budget' | 'standard' | 'premium';
export type TravelStyle = 'relaxed' | 'balanced' | 'adventure';
export type FoodPreference = 'veg' | 'nonveg' | 'both';

export interface TripInput {
  origin: {
    name: string;
    coordinates: [number, number];
  };
  destination: string;
  people: number;
  days: number;
  travelMode: TravelMode;
  stayType: StayType;
  travelStyle: TravelStyle;
  foodPreference: FoodPreference;
}

export interface CostBreakdown {
  travel: number;
  stay: number;
  food: number;
  activities: number;
  miscellaneous: number;
  total: number;
}

export interface TripResult {
  estimatedCost: CostBreakdown;
  distance: number;
  itinerary: ItineraryDay[];
  disclaimer: string;
}

export interface SavedTrip {
  _id: string;
  userId: string;
  origin: {
    name: string;
    coordinates: [number, number];
  };
  destination: {
    name: string;
    slug: string;
    coordinates: [number, number];
  };
  people: number;
  days: number;
  travelMode: TravelMode;
  stayType: StayType;
  travelStyle: TravelStyle;
  foodPreference: FoodPreference;
  estimatedCost: CostBreakdown;
  itinerary: ItineraryDay[];
  createdAt: string;
}

// ---- User ----
export interface UserProfile {
  _id: string;
  authUserId: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
  savedDestinations: string[];
  recentlyViewed: RecentView[];
  createdAt: string;
}

export interface UserPreferences {
  travelStyle: TravelStyle;
  budget: StayType;
  food: FoodPreference;
  interests: string[];
}

export interface RecentView {
  destinationId: string;
  viewedAt: string;
}

// ---- API Response ----
export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
}

export interface RecommendedDestination {
  destination: Destination;
  score: number;
  distance: number;
  reasons: string[];
}

// ---- Category ----
export interface Category {
  slug: string;
  name: string;
  count: number;
  image: string;
  description: string;
}

// ---- Search ----
export interface SearchResults {
  districts: District[];
  destinations: Destination[];
  hiddenSpots: HiddenSpot[];
}
