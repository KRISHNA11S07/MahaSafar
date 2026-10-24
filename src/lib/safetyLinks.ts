function mapsSearchUrl(query: string, lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query} near ${lat},${lng}`)}`;
}

export function hospitalSearchUrl(lat: number, lng: number): string {
  return mapsSearchUrl('hospital', lat, lng);
}

export function policeSearchUrl(lat: number, lng: number): string {
  return mapsSearchUrl('police station', lat, lng);
}

export function pharmacySearchUrl(lat: number, lng: number): string {
  return mapsSearchUrl('pharmacy', lat, lng);
}

export function directionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${lat},${lng}`)}`;
}
