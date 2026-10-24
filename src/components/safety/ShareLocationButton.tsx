import { useState } from 'react';
import { Check, Copy, LoaderCircle, MapPin, Share2 } from 'lucide-react';
import {
  createLocationSnapshot,
  locationErrorKind,
  locationErrorMessage,
  type SharedLocationSnapshot,
} from '../../lib/shareLocation';

interface ShareLocationButtonProps {
  onLocationReady?: (latitude: number, longitude: number) => void;
}

export default function ShareLocationButton({ onLocationReady }: ShareLocationButtonProps) {
  const [hasConsent, setHasConsent] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [snapshot, setSnapshot] = useState<SharedLocationSnapshot | null>(null);
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);
  const canNativeShare = 'share' in (navigator as object);

  const requestLocation = () => {
    if (!window.isSecureContext) {
      setStatus(locationErrorMessage('insecure'));
      return;
    }
    if (!navigator.geolocation) {
      setStatus(locationErrorMessage('unsupported'));
      return;
    }

    setIsRequesting(true);
    setStatus('Finding your location…');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextSnapshot = createLocationSnapshot(position);
        setSnapshot(nextSnapshot);
        onLocationReady?.(nextSnapshot.latitude, nextSnapshot.longitude);
        setStatus('Your one-time location link is ready. It has not been stored.');
        setIsRequesting(false);
      },
      (error) => {
        setStatus(locationErrorMessage(locationErrorKind(error)));
        setIsRequesting(false);
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  const share = async () => {
    if (!snapshot) return;
    if (canNativeShare) {
      try {
        await navigator.share({ title: 'My location', text: snapshot.message, url: snapshot.mapsLink });
        setStatus('Location link shared.');
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          setStatus('Sharing was cancelled. Your location was not saved.');
        } else {
          setStatus('Sharing is not available right now. You can copy the link below.');
        }
      }
    }
  };

  const copyLink = async () => {
    if (!snapshot) return;
    try {
      await navigator.clipboard.writeText(snapshot.mapsLink);
      setCopied(true);
      setStatus('Location link copied.');
      window.setTimeout(() => setCopied(false), 2_000);
    } catch {
      setStatus('Could not copy automatically. Select the Google Maps link and copy it manually.');
    }
  };

  return (
    <section className="share-location" aria-labelledby="share-location-title">
      <div className="share-location__heading">
        <MapPin size={20} aria-hidden="true" />
        <div>
          <h3 id="share-location-title">Share my location</h3>
          <p>Your location will only be used to create a link you choose to send. It is not stored or sent to our servers.</p>
        </div>
      </div>

      {!hasConsent ? (
        <button className="safety-button safety-button--primary" type="button" onClick={() => setHasConsent(true)} aria-label="Consent to create a one-time location link">
          <Share2 size={16} aria-hidden="true" /> Create a location link
        </button>
      ) : (
        <button className="safety-button safety-button--primary" type="button" onClick={requestLocation} disabled={isRequesting} aria-label="Use my current location to create a share link">
          {isRequesting ? <LoaderCircle className="safety-spin" size={16} aria-hidden="true" /> : <MapPin size={16} aria-hidden="true" />}
          {isRequesting ? 'Finding location…' : 'Use my current location'}
        </button>
      )}

      {snapshot && (
        <div className="share-location__result">
          <p>Accuracy: approximately {Math.round(snapshot.accuracy)} m. This is a one-time snapshot and is not retained by MahaSafar.</p>
          <a href={snapshot.mapsLink} target="_blank" rel="noopener noreferrer" className="share-location__link">Open location in Google Maps</a>
          <div className="share-location__actions">
            {canNativeShare && <button type="button" className="safety-button safety-button--secondary" onClick={share}><Share2 size={15} aria-hidden="true" /> Share</button>}
            <a className="safety-button safety-button--secondary" href={`https://wa.me/?text=${encodeURIComponent(snapshot.message)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a className="safety-button safety-button--secondary" href={`sms:?body=${encodeURIComponent(snapshot.message)}`}>SMS</a>
            <button type="button" className="safety-button safety-button--secondary" onClick={copyLink}>
              {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
          </div>
        </div>
      )}
      <p className="safety-status" aria-live="polite">{status}</p>
    </section>
  );
}
