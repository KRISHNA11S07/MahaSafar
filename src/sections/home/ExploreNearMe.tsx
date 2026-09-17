import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navigation, MapPin, Clock, ArrowRight, Compass } from 'lucide-react';
import { sampleDestinations } from '../../data/destinations';
import { getDestinationImage } from '../../data/images';
import SafeImage from '../../components/ui/SafeImage';
import './ExploreNearMe.css';

// Pre-defined base locations across Maharashtra with coordinates
const BASE_CITIES = [
  { name: 'Pune', coords: [73.8567, 18.5204] as [number, number] },
  { name: 'Mumbai', coords: [72.8777, 19.0760] as [number, number] },
  { name: 'Nashik', coords: [73.7898, 19.9975] as [number, number] },
  { name: 'Chhatrapati Sambhajinagar', coords: [75.3433, 19.8762] as [number, number] },
  { name: 'Nagpur', coords: [79.0882, 21.1458] as [number, number] },
  { name: 'Kolhapur', coords: [74.2433, 16.7050] as [number, number] },
];

// Haversine formula to compute distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function ExploreNearMe() {
  const [selectedCity, setSelectedCity] = useState(BASE_CITIES[0]);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocationName, setUserLocationName] = useState<string | null>(null);

  const handleUseGeo = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserLocationName('My GPS Location');
        setSelectedCity({
          name: 'My GPS Location',
          coords: [pos.coords.longitude, pos.coords.latitude],
        });
      },
      () => {
        setIsLocating(false);
        alert('Could not access current location. Please pick a nearby city from the list.');
      },
      { timeout: 8000 }
    );
  };

  // Compute nearby destinations sorted by calculated distance
  const sortedDestinations = useMemo(() => {
    return sampleDestinations
      .map((dest) => {
        const [destLon, destLat] = dest.location.coordinates;
        const [cityLon, cityLat] = selectedCity.coords;
        const distKm = calculateDistance(cityLat, cityLon, destLat, destLon);
        const driveHours = Math.max(1, Math.round(distKm / 50));
        return {
          ...dest,
          distKm,
          driveHours,
        };
      })
      .sort((a, b) => a.distKm - b.distKm);
  }, [selectedCity]);

  return (
    <section className="explore-near-me section" aria-label="Explore places near you">
      <div className="container">
        {/* Header */}
        <div className="explore-near-me__header">
          <div className="explore-near-me__tag">
            <Compass size={16} />
            <span>Location Aware Discovery</span>
          </div>
          <h2 className="text-section explore-near-me__title">
            Explore Near You
          </h2>
          <p className="explore-near-me__subtitle">
            Find the closest weekend getaways, hill stations, and heritage monuments based on your starting location.
          </p>

          {/* Location Selector Bar */}
          <div className="explore-near-me__controls">
            <button
              onClick={handleUseGeo}
              disabled={isLocating}
              className={`explore-near-me__geobtn ${userLocationName ? 'explore-near-me__geobtn--active' : ''}`}
              title="Detect your device coordinates"
            >
              <Navigation size={15} />
              <span>{isLocating ? 'Detecting...' : userLocationName || 'Detect Location'}</span>
            </button>

            <span className="explore-near-me__divider">or select city:</span>

            <div className="explore-near-me__cities">
              {BASE_CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => {
                    setUserLocationName(null);
                    setSelectedCity(city);
                  }}
                  className={`explore-near-me__city-pill ${
                    selectedCity.name === city.name ? 'explore-near-me__city-pill--active' : ''
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results grid */}
        <div className="explore-near-me__grid">
          {sortedDestinations.slice(0, 4).map((dest) => {
            const destImage = getDestinationImage(dest.slug);

            return (
              <article key={dest._id} className="near-card">
                {/* Real Destination Photograph */}
                <div className="near-card__image-wrap">
                  <SafeImage
                    src={destImage.url}
                    fallbackSrc={destImage.fallbackUrl}
                    alt={destImage.alt}
                    className="near-card__photo"
                  />
                  <div className="near-card__photo-overlay" />
                  <span className="near-card__region-badge">{dest.districtName}</span>
                </div>

                <div className="near-card__body">
                  <div className="near-card__dist-badge">
                    <MapPin size={13} />
                    <span>{dest.distKm} km from {selectedCity.name}</span>
                  </div>

                  <h3 className="near-card__name">{dest.name}</h3>
                  <p className="near-card__tagline">&ldquo;{dest.tagline}&rdquo;</p>

                  <div className="near-card__stats">
                    <div className="near-card__stat">
                      <Clock size={13} />
                      <span>~{dest.driveHours}h road drive</span>
                    </div>
                    <div className="near-card__stat">
                      <span>{dest.idealDays} {dest.idealDays === 1 ? 'day' : 'days'} trip</span>
                    </div>
                  </div>

                  <div className="near-card__actions">
                    <Link to={`/destination/${dest.slug}`} className="near-card__link">
                      <span>View Destination</span>
                      <ArrowRight size={14} />
                    </Link>
                    <Link to={`/plan/${dest.slug}`} className="near-card__plan-link">
                      Plan Trip
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
