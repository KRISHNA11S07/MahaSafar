// MahaSafar — Saved Places
// Favourite places the visitor has hearted on a destination page. They are
// stored in the browser, matching how saved trip itineraries already work
// (`mahasafar_saved_trips`).

const STORAGE_KEY = 'mahasafar_saved_places';

/** Fired whenever the list changes so open views can refresh themselves. */
export const SAVED_PLACES_EVENT = 'mahasafar:saved-places-changed';

export interface SavedPlace {
  slug: string;
  name: string;
  districtName: string;
  tagline: string;
  savedAt: string;
}

export function getSavedPlaces(): SavedPlace[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (place): place is SavedPlace =>
        Boolean(place) && typeof place.slug === 'string' && typeof place.name === 'string'
    );
  } catch {
    return [];
  }
}

function writeSavedPlaces(places: SavedPlace[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  } catch {
    // storage can be blocked (private mode) - the list just won't persist
  }
  window.dispatchEvent(new CustomEvent(SAVED_PLACES_EVENT));
}

export function isPlaceSaved(slug: string): boolean {
  return getSavedPlaces().some((place) => place.slug === slug);
}

/**
 * Adds the place if it is not saved yet, removes it if it already is.
 * Returns the new saved state.
 */
export function toggleSavedPlace(place: Omit<SavedPlace, 'savedAt'>): boolean {
  const places = getSavedPlaces();
  const existingIndex = places.findIndex((item) => item.slug === place.slug);

  if (existingIndex >= 0) {
    places.splice(existingIndex, 1);
    writeSavedPlaces(places);
    return false;
  }

  places.unshift({ ...place, savedAt: new Date().toISOString() });
  writeSavedPlaces(places);
  return true;
}

export function removeSavedPlace(slug: string) {
  const places = getSavedPlaces().filter((place) => place.slug !== slug);
  writeSavedPlaces(places);
}
