import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Bookmark, LogOut, Compass, Calendar, ArrowRight, Camera } from 'lucide-react';
import { sampleDestinations } from '../data/destinations';
import { getDestinationImage } from '../data/images';
import SafeImage from '../components/ui/SafeImage';
import './ProfilePage.css';

interface SavedTripItem {
  destination: string;
  origin: string;
  days: number;
  travelers: number;
  cost: number;
  savedAt: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [savedTrips, setSavedTrips] = useState<SavedTripItem[]>([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('mahasafar_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Fallback default
        setUser({ name: 'Maharashtra Explorer', email: 'explorer@mahasafar.in' });
      }

      const trips = JSON.parse(localStorage.getItem('mahasafar_saved_trips') || '[]');
      setSavedTrips(trips);
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mahasafar_user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="profile-page container">
      {/* Profile Header */}
      <header className="profile-header">
        <div className="profile-avatar">
          <User size={36} />
        </div>
        <div className="profile-meta">
          <h1 className="profile-name">{user?.name || 'Explorer'}</h1>
          <p className="profile-email">{user?.email || 'Guest Session'}</p>
          <div className="profile-badges">
            <span className="profile-badge">Maharashtra Traveler</span>
            <span className="profile-badge">Sahyadri Enthusiast</span>
          </div>
        </div>
        <button onClick={handleLogout} className="profile-logout-btn" title="Sign Out">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Saved Trips Section */}
      <section className="profile-section">
        <div className="profile-section__header">
          <div className="profile-section__title-wrap">
            <Bookmark size={20} className="text-earth" />
            <h2 className="profile-section__title">Saved Trips & Itineraries</h2>
          </div>
          <Link to="/plan" className="btn btn--primary btn--sm">
            <span>+ Plan New Trip</span>
          </Link>
        </div>

        {savedTrips.length > 0 ? (
          <div className="profile-trips-grid">
            {savedTrips.map((trip, idx) => (
              <div key={idx} className="trip-card">
                <div className="trip-card__header">
                  <span className="trip-card__dest">{trip.destination}</span>
                  <span className="trip-card__cost">₹{trip.cost.toLocaleString('en-IN')}</span>
                </div>
                <div className="trip-card__meta">
                  <span>From: {trip.origin}</span>
                  <span>&bull;</span>
                  <span>{trip.days} Days</span>
                  <span>&bull;</span>
                  <span>{trip.travelers} Travelers</span>
                </div>
                <div className="trip-card__date">
                  <Calendar size={12} />
                  <span>Saved on {new Date(trip.savedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="profile-empty-trips">
            <Compass size={32} className="text-earth" />
            <p>You have not saved any trip itineraries yet.</p>
            <Link to="/plan" className="btn btn--outline" style={{ marginTop: '1rem' }}>
              Create Your First Maharashtra Itinerary
            </Link>
          </div>
        )}
      </section>

      {/* Recommended for You with Real Photography */}
      <section className="profile-section">
        <div className="profile-section__header">
          <h2 className="profile-section__title">Recommended Next Journeys</h2>
        </div>
        <div className="profile-rec-grid">
          {sampleDestinations.slice(0, 3).map((d) => {
            const photo = getDestinationImage(d.slug);
            return (
              <Link to={`/destination/${d.slug}`} key={d._id} className="rec-card">
                <div className="rec-card__image-box">
                  <SafeImage
                    src={photo.url}
                    fallbackSrc={photo.fallbackUrl}
                    alt={photo.alt}
                    className="rec-card__image"
                  />
                  <div className="rec-card__image-overlay" />
                  <span className="rec-card__district-badge">{d.districtName}</span>
                  <span className="rec-card__photo-credit">
                    <Camera size={10} />
                    <span>{photo.location}</span>
                  </span>
                </div>
                <div className="rec-card__content">
                  <h3 className="rec-card__name">{d.name}</h3>
                  <p className="rec-card__tagline">&ldquo;{d.tagline}&rdquo;</p>
                  <span className="rec-card__link">
                    <span>View Destination</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
