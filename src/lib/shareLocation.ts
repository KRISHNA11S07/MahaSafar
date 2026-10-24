export interface SharedLocationSnapshot {
  latitude: number;
  longitude: number;
  accuracy: number;
  mapsLink: string;
  message: string;
}

export type LocationErrorKind = 'denied' | 'unavailable' | 'timeout' | 'insecure' | 'unsupported' | 'unknown';

export function createLocationSnapshot(position: GeolocationPosition): SharedLocationSnapshot {
  const { latitude, longitude, accuracy } = position.coords;
  const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const sharedTime = new Date().toLocaleString();
  const message = `📍 I'm here: ${mapsLink} (accuracy ~${Math.round(accuracy)} m, shared ${sharedTime}). Shared via MahaSafar.`;

  return { latitude, longitude, accuracy, mapsLink, message };
}

export function locationErrorKind(error: GeolocationPositionError): LocationErrorKind {
  if (error.code === error.PERMISSION_DENIED) return 'denied';
  if (error.code === error.POSITION_UNAVAILABLE) return 'unavailable';
  if (error.code === error.TIMEOUT) return 'timeout';
  return 'unknown';
}

export function locationErrorMessage(kind: LocationErrorKind): string {
  switch (kind) {
    case 'insecure':
      return 'Location sharing needs HTTPS (or localhost). Open MahaSafar on a secure connection and try again.';
    case 'unsupported':
      return 'This browser does not support location access. Allow location in browser settings on a supported browser.';
    case 'denied':
      return 'Location permission was not allowed. Allow location in your browser settings, then try again.';
    case 'unavailable':
      return 'Your location is unavailable right now. Check your device signal and allow location in browser settings.';
    case 'timeout':
      return 'Finding your location took too long. Try again with a clearer signal, or allow location in browser settings.';
    default:
      return 'We could not get your location. Allow location in browser settings and try again.';
  }
}
