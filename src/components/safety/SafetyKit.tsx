import { useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, Hospital, LocateFixed, Navigation, Phone, Pill, ShieldCheck } from 'lucide-react';
import { EMERGENCY_CONTACTS, TRAVELLER_TIPS, type TravellerTipGroup } from '../../data/safety';
import { hospitalSearchUrl, pharmacySearchUrl, policeSearchUrl } from '../../lib/safetyLinks';
import ShareLocationButton from './ShareLocationButton';
import './SafetyKit.css';

interface SafetyKitProps {
  coordinates?: [number, number];
  categories?: string[];
  compact?: boolean;
}

interface MapCoordinates {
  latitude: number;
  longitude: number;
}

const relevantGroupByCategory: Record<string, string> = {
  beach: 'Coastal & water',
  wildlife: 'Wildlife (Tadoba etc.)',
  fort: 'Monsoon & trekking',
  trek: 'Monsoon & trekking',
  waterfall: 'Monsoon & trekking',
};

function orderedTips(categories: string[]): TravellerTipGroup[] {
  const prioritizedNames = categories
    .map((category) => relevantGroupByCategory[category])
    .filter((title): title is string => Boolean(title));
  const priority = new Set(prioritizedNames);
  return [...TRAVELLER_TIPS].sort((a, b) => Number(priority.has(b.title)) - Number(priority.has(a.title)));
}

export default function SafetyKit({ coordinates, categories = [], compact = false }: SafetyKitProps) {
  const [isOpen, setIsOpen] = useState(!compact);
  const [currentLocation, setCurrentLocation] = useState<MapCoordinates | null>(null);
  const [locationStatus, setLocationStatus] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [openTip, setOpenTip] = useState<string | null>(null);
  const tipGroups = useMemo(() => orderedTips(categories), [categories]);
  const destinationLocation = coordinates ? { longitude: coordinates[0], latitude: coordinates[1] } : null;
  const activeLocation = currentLocation ?? destinationLocation;

  const useCurrentLocationForHelp = () => {
    if (!window.isSecureContext) {
      setLocationStatus('Location needs HTTPS (or localhost). Allow location in browser settings on a secure connection.');
      return;
    }
    if (!navigator.geolocation) {
      setLocationStatus('This browser cannot access location. Allow location in browser settings on a supported browser.');
      return;
    }
    setIsLocating(true);
    setLocationStatus('Finding your location…');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocationStatus('Nearest-help links now use your current location. It has not been stored.');
        setIsLocating(false);
      },
      () => {
        setLocationStatus('Location was not available. Allow location in browser settings and try again.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  return (
    <section className={`safety-kit ${compact ? 'safety-kit--compact' : ''}`} aria-labelledby="safety-kit-title">
      <div className="safety-kit__intro">
        <div>
          <span className="safety-kit__eyebrow"><ShieldCheck size={15} aria-hidden="true" /> Travel with confidence</span>
          <h2 id="safety-kit-title">Safety and Emergency Kit</h2>
          <p>General guidance only. In an emergency call 112.</p>
        </div>
        {compact && <button type="button" className="safety-kit__toggle" onClick={() => setIsOpen((value) => !value)} aria-expanded={isOpen} aria-controls="safety-kit-content"><ChevronDown size={18} aria-hidden="true" /> {isOpen ? 'Hide kit' : 'Open kit'}</button>}
      </div>

      <a className="safety-emergency" href="tel:112">
        <AlertTriangle size={21} aria-hidden="true" />
        <span><strong>Emergency? Call 112</strong><small>National emergency support</small></span>
        <Phone size={19} aria-hidden="true" />
      </a>

      {isOpen && (
        <div id="safety-kit-content" className="safety-kit__content">
          <p className="safety-kit__notice"><AlertTriangle size={16} aria-hidden="true" /> Numbers can change. In a real emergency call 112.</p>

          <div className="safety-kit__section-heading"><h3>Emergency helplines</h3><span>Tap a number to call</span></div>
          <div className="safety-contacts">
            {EMERGENCY_CONTACTS.map((contact) => (
              <a key={contact.number} href={`tel:${contact.number}`} className="safety-contact">
                <Phone size={16} aria-hidden="true" />
                <span><strong>{contact.number}</strong><b>{contact.label}</b><small>{contact.description}</small></span>
              </a>
            ))}
          </div>

          <div className="safety-kit__section-heading"><h3>Nearest help</h3><span>{currentLocation ? 'Using your current location' : destinationLocation ? 'Using this destination' : 'Choose current location below'}</span></div>
          {activeLocation ? (
            <div className="safety-nearest">
              <a href={hospitalSearchUrl(activeLocation.latitude, activeLocation.longitude)} target="_blank" rel="noopener noreferrer" className="safety-nearest__link"><Hospital size={18} aria-hidden="true" /> Hospital</a>
              <a href={policeSearchUrl(activeLocation.latitude, activeLocation.longitude)} target="_blank" rel="noopener noreferrer" className="safety-nearest__link"><ShieldCheck size={18} aria-hidden="true" /> Police</a>
              <a href={pharmacySearchUrl(activeLocation.latitude, activeLocation.longitude)} target="_blank" rel="noopener noreferrer" className="safety-nearest__link"><Pill size={18} aria-hidden="true" /> Pharmacy</a>
            </div>
          ) : <p className="safety-muted">Use your current location to find nearby help.</p>}
          <button type="button" className="safety-current-location" onClick={useCurrentLocationForHelp} disabled={isLocating}><LocateFixed size={16} aria-hidden="true" /> {isLocating ? 'Finding location…' : 'Use my current location'}</button>
          <p className="safety-map-note"><Navigation size={14} aria-hidden="true" /> Opens in Google Maps, needs internet.</p>
          <p className="safety-status" aria-live="polite">{locationStatus}</p>

          <ShareLocationButton onLocationReady={(latitude, longitude) => setCurrentLocation({ latitude, longitude })} />

          <div className="safety-kit__section-heading"><h3>Traveller tips</h3><span>Calm, practical reminders</span></div>
          <div className="safety-tips">
            {tipGroups.map((group) => {
              const expanded = openTip === group.title;
              const panelId = `safety-tip-${group.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
              return (
                <div className="safety-tip" key={group.title}>
                  <button type="button" onClick={() => setOpenTip(expanded ? null : group.title)} aria-expanded={expanded} aria-controls={panelId}>
                    {group.title}<ChevronDown size={18} aria-hidden="true" />
                  </button>
                  {expanded && <ul id={panelId}>{group.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
