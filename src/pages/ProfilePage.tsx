import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Bookmark,
  LogOut,
  Compass,
  Calendar,
  ArrowRight,
  Camera,
  Heart,
  UserPen,
  Check,
  AlertCircle,
  LoaderCircle,
  Phone,
  MapPin,
  X,
} from 'lucide-react';
import { sampleDestinations } from '../data/destinations';
import { getDestinationImage } from '../data/images';
import SafeImage from '../components/ui/SafeImage';
import UserAvatar from '../components/ui/UserAvatar';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuthSync';
import { getSavedPlaces, removeSavedPlace, SAVED_PLACES_EVENT, type SavedPlace } from '../lib/savedPlaces';
import type { SavedPlannerTrip } from '../types';
import './ProfilePage.css';

const formatDepartureTime = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${period}`;
};

/** Google exposes these in user_metadata; phone is only present when the
 *  Google account has a phone number shared with the app. */
interface ProfileFields {
  fullName: string;
  phone: string;
  city: string;
}

function readProfileFields(user: {
  user_metadata?: Record<string, unknown>;
  phone?: string;
}): ProfileFields {
  const meta = user.user_metadata ?? {};
  return {
    fullName:
      (meta.full_name as string) || (meta.name as string) || (meta.nickname as string) || '',
    phone: (meta.phone as string) || user.phone || '',
    city: (meta.city as string) || (meta.locality as string) || '',
  };
}

/** The fields to show for a browser-only session (email / guest sign-in). */
function readLocalProfileFields(stored: {
  name?: string;
  phone?: string;
  city?: string;
}): ProfileFields {
  return {
    fullName: stored.name ?? '',
    phone: stored.phone ?? '',
    city: stored.city ?? '',
  };
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, storedUser, signOut, isAuthenticated, isLoading, updateLocalProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [savedTrips, setSavedTrips] = useState<SavedPlannerTrip[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  // Edit form state
  const [isEditing, setIsEditing] = useState(searchParams.get('edit') === '1');
  const [fields, setFields] = useState<ProfileFields>({ fullName: '', phone: '', city: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Open the edit form when the URL changes to /profile?edit=1 (e.g. the account
  // menu navigates there while the visitor is already on the profile page).
  useEffect(() => {
    if (searchParams.get('edit') !== '1') return;
    setIsEditing(true);
    if (user) setFields(readProfileFields(user));
    else if (storedUser) setFields(readLocalProfileFields(storedUser));
  }, [searchParams, user, storedUser]);

  // Read the trips and favourite places from local storage.
  useEffect(() => {
    try {
      const trips = JSON.parse(localStorage.getItem('mahasafar_saved_trips') || '[]');
      setSavedTrips(Array.isArray(trips) ? trips : []);
    } catch {
      setSavedTrips([]);
    }
    setSavedPlaces(getSavedPlaces());
  }, []);

  // Refresh favourite places when they change elsewhere in the app
  useEffect(() => {
    const handleChange = () => setSavedPlaces(getSavedPlaces());
    window.addEventListener(SAVED_PLACES_EVENT, handleChange);
    return () => window.removeEventListener(SAVED_PLACES_EVENT, handleChange);
  }, []);

  // Seed the edit form from whichever session is active.
  useEffect(() => {
    if (user) {
      setFields(readProfileFields(user));
    } else if (storedUser) {
      setFields(readLocalProfileFields(storedUser));
    }
  }, [user, storedUser]);

  // Show the identity we have: the live Supabase user, then the mirrored
  // localStorage copy, then a guest fallback.
  const displayName = useMemo(() => {
    if (user) return readProfileFields(user).fullName || storedUser?.name || 'Explorer';
    return storedUser?.name || 'Maharashtra Explorer';
  }, [user, storedUser]);

  const displayEmail = user?.email || storedUser?.email || '';
  const displayAvatar = storedUser?.avatar ?? null;
  // The demo guest account is the pre-existing mock identity, not a real member.
  const isDemoGuest = !user && storedUser?.email === 'explorer@mahasafar.in';
  const isGuest = !isAuthenticated;
  // A browser-only session can be edited locally; a real member can be edited
  // on their Supabase account.
  const canEdit = Boolean(user) || Boolean(storedUser);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleStartEdit = () => {
    setSaveError('');
    setSaveSuccess(false);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSaveError('');
    setSaveSuccess(false);
    if (user) setFields(readProfileFields(user));
    else if (storedUser) setFields(readLocalProfileFields(storedUser));
    // Drop the ?edit=1 flag so a refresh does not re-open the form
    if (searchParams.get('edit')) {
      searchParams.delete('edit');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleSaveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setSaveError('');
    setSaveSuccess(false);

    setIsSaving(true);
    try {
      if (user && supabase) {
        // A real Supabase session: write the fields back to the account's
        // user metadata. Only the fields Google owns can be written.
        const metadataUpdate: Record<string, string> = {};
        if (fields.fullName.trim()) metadataUpdate.full_name = fields.fullName.trim();
        if (fields.phone.trim()) metadataUpdate.phone = fields.phone.trim();
        if (fields.city.trim()) metadataUpdate.city = fields.city.trim();

        const { error } = await supabase.auth.updateUser({
          data: metadataUpdate,
        });

        if (error) {
          setSaveError(error.message || "We couldn't save your profile just now.");
          setIsSaving(false);
          return;
        }

        // Mirror into the localStorage copy the rest of the app reads.
        try {
          const stored = {
            ...(storedUser ?? {}),
            id: user.id,
            email: user.email ?? '',
            name: fields.fullName.trim() || storedUser?.name || 'Explorer',
            avatar: storedUser?.avatar ?? null,
            provider: storedUser?.provider ?? 'google',
            source: 'supabase' as const,
          };
          localStorage.setItem('mahasafar_user', JSON.stringify(stored));
        } catch {
          // ignore - the Supabase session is the source of truth
        }
      } else if (storedUser) {
        // A browser-only session: keep the edits in local storage.
        updateLocalProfile(fields);
      } else {
        setSaveError('Sign in to save changes to your profile.');
        setIsSaving(false);
        return;
      }

      setSaveSuccess(true);
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("We couldn't save your profile just now. Please try again.");
      setIsSaving(false);
    }
  };

  const handleRemovePlace = (slug: string) => {
    removeSavedPlace(slug);
    setSavedPlaces(getSavedPlaces());
  };

  if (isLoading) {
    return (
      <div className="profile-page container">
        <div className="profile-loading" role="status">
          <LoaderCircle size={26} className="profile-loading__spinner" aria-hidden="true" />
          <p>Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page container">
      {/* Profile Header */}
      <header className="profile-header">
        <div className="profile-avatar">
          <UserAvatar src={displayAvatar} name={displayName} size={72} />
        </div>
        <div className="profile-meta">
          <h1 className="profile-name">{displayName}</h1>
          <p className="profile-email">{displayEmail || 'Guest Session'}</p>
          <div className="profile-badges">
            {isGuest ? (
              <span className="profile-badge">Guest explorer</span>
            ) : isDemoGuest ? (
              <span className="profile-badge">Guest explorer</span>
            ) : (
              <span className="profile-badge">MahaSafar member</span>
            )}
            {user?.created_at && (
              <span className="profile-badge">
                Member since {new Date(user.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>
        <div className="profile-header__actions">
          {canEdit && !isEditing && (
            <button onClick={handleStartEdit} className="profile-edit-btn" title="Edit profile">
              <UserPen size={15} />
              <span>Edit Profile</span>
            </button>
          )}
          <button onClick={handleLogout} className="profile-logout-btn" title="Sign Out">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Edit Profile Form */}
      {isEditing && (
        <section className="profile-section" id="preferences">
          <div className="profile-section__header">
            <div className="profile-section__title-wrap">
              <UserPen size={20} className="text-earth" />
              <h2 className="profile-section__title">Edit Profile</h2>
            </div>
          </div>

          <form className="profile-edit-form" onSubmit={handleSaveProfile}>
            <div className="profile-edit-grid">
              <div className="profile-edit-field">
                <label className="profile-edit-label" htmlFor="profile-name">
                  Full name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  className="profile-edit-input"
                  value={fields.fullName}
                  onChange={(e) => setFields({ ...fields, fullName: e.target.value })}
                  placeholder="Your name"
                />
              </div>

              <div className="profile-edit-field">
                <label className="profile-edit-label" htmlFor="profile-phone">
                  <Phone size={12} aria-hidden="true" /> Phone number
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  className="profile-edit-input"
                  value={fields.phone}
                  onChange={(e) => setFields({ ...fields, phone: e.target.value })}
                  placeholder="Add a phone number"
                />
              </div>

              <div className="profile-edit-field">
                <label className="profile-edit-label" htmlFor="profile-city">
                  <MapPin size={12} aria-hidden="true" /> City
                </label>
                <input
                  id="profile-city"
                  type="text"
                  className="profile-edit-input"
                  value={fields.city}
                  onChange={(e) => setFields({ ...fields, city: e.target.value })}
                  placeholder="Where do you plan from?"
                />
              </div>
            </div>

            {saveError && (
              <p className="profile-form-error" role="alert">
                <AlertCircle size={14} aria-hidden="true" />
                {saveError}
              </p>
            )}
            {saveSuccess && (
              <p className="profile-form-success" role="status">
                <Check size={14} aria-hidden="true" />
                Profile updated
              </p>
            )}

            <div className="profile-edit-actions">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <LoaderCircle size={15} className="profile-loading__spinner" aria-hidden="true" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <>
                    <Check size={15} aria-hidden="true" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn--outline"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                <X size={15} aria-hidden="true" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Favourite Places */}
      <section className="profile-section" id="favourites">
        <div className="profile-section__header">
          <div className="profile-section__title-wrap">
            <Heart size={20} className="text-earth" />
            <h2 className="profile-section__title">Favourite Places</h2>
          </div>
        </div>

        {savedPlaces.length > 0 ? (
          <div className="profile-fav-grid">
            {savedPlaces.map((place) => (
              <div key={place.slug} className="fav-card">
                <Link to={`/destination/${place.slug}`} className="fav-card__link">
                  <span className="fav-card__name">{place.name}</span>
                  <span className="fav-card__district">{place.districtName}</span>
                  <span className="fav-card__tagline">{place.tagline}</span>
                </Link>
                <button
                  type="button"
                  className="fav-card__remove"
                  onClick={() => handleRemovePlace(place.slug)}
                  aria-label={`Remove ${place.name} from favourites`}
                  title="Remove from favourites"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="profile-empty-trips">
            <Heart size={32} className="text-earth" />
            <p>No favourite places yet.</p>
            <Link to="/explore" className="btn btn--outline" style={{ marginTop: '1rem' }}>
              Find places you love
            </Link>
          </div>
        )}
      </section>

      {/* Saved Trips Section */}
      <section className="profile-section" id="trips">
        <div className="profile-section__header">
          <div className="profile-section__title-wrap">
            <Bookmark size={20} className="text-earth" />
            <h2 className="profile-section__title">My Trips</h2>
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
                  {trip.departureTime && (
                    <>
                      <span>&bull;</span>
                      <span>Departs {formatDepartureTime(trip.departureTime)}</span>
                    </>
                  )}
                </div>
                <div className="trip-card__date">
                  <Calendar size={12} />
                  <span>Saved on {new Date(trip.savedAt).toLocaleDateString()}</span>
                </div>
                {trip.itinerary && trip.itinerary.length > 0 && (
                  <details className="trip-card__itinerary">
                    <summary>View saved itinerary</summary>
                    {trip.itinerary.map((day) => (
                      <section key={day.day} className="trip-card__itinerary-day">
                        <h3>Day {day.day}: {day.title}</h3>
                        {day.events.map((event, eventIndex) => (
                          <div key={`${day.day}-${eventIndex}`} className="trip-card__itinerary-event">
                            <strong>{event.time} · {event.title}</strong>
                            <p>{event.description}</p>
                          </div>
                        ))}
                      </section>
                    ))}
                  </details>
                )}
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
