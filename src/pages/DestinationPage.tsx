import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  Train,
  Plane,
  Heart,
  Share2,
  Check,
  ChevronRight,
  Sparkles,
  Bed,
  Utensils,
  Camera,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
} from 'lucide-react';
import { sampleDestinations } from '../data/destinations';
import { REGION_COLORS } from '../data/regions';
import { CATEGORY_ICONS } from '../data/categories';
import { DESTINATION_GALLERIES, getDestinationImage } from '../data/images';
import SafeImage from '../components/ui/SafeImage';
import type { Destination } from '../types';
import './DestinationPage.css';

export default function DestinationPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeItineraryDay, setActiveItineraryDay] = useState(1);
  const [activeMalvanSlide, setActiveMalvanSlide] = useState(0);

  // Find destination by slug
  const destination: Destination | undefined = useMemo(() => {
    return sampleDestinations.find((d) => d.slug === slug);
  }, [slug]);

  // Gallery images from centralized registry
  const destinationImages = useMemo(() => {
    if (!slug) return null;
    return DESTINATION_GALLERIES[slug] || null;
  }, [slug]);

  // Related destinations from same region or other featured destinations
  const relatedDestinations = useMemo(() => {
    if (!destination) return [];
    return sampleDestinations
      .filter((d) => d._id !== destination._id)
      .slice(0, 3);
  }, [destination]);

  // Handle share
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // If destination not found
  if (!destination) {
    return (
      <div className="destination-not-found container">
        <div className="destination-not-found__card">
          <Sparkles size={36} className="text-earth" />
          <h1 className="destination-not-found__title">Destination Not Found</h1>
          <p className="destination-not-found__desc">
            We couldn&apos;t find details for &ldquo;{slug}&rdquo;. Explore our other handpicked Maharashtra destinations below.
          </p>
          <div className="destination-not-found__actions">
            <Link to="/" className="btn btn--primary">
              Return to Home
            </Link>
            <Link to="/search" className="btn btn--outline">
              Search Destinations
            </Link>
          </div>

          <div className="destination-not-found__suggestions">
            <h3>Suggested Destinations</h3>
            <div className="destination-not-found__grid">
              {sampleDestinations.slice(0, 3).map((d) => (
                <Link
                  to={`/destination/${d.slug}`}
                  key={d._id}
                  className="destination-not-found__item"
                >
                  <span className="font-semibold text-earth">{d.name}</span>
                  <span className="text-xs text-muted">{d.districtName}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const regionColor = REGION_COLORS[destination.region] || '#C9A96E';
  const primaryItinerary = destination.itineraryTemplates?.[0];
  const heroImage = destinationImages?.heroImage || getDestinationImage(destination.slug);
  const galleryList = destinationImages?.gallery || [];

  // Special Malvan 3-Photo Experience
  const isMalvanOrTarkarli = destination.slug === 'tarkarli';
  const malvanPhotos = [
    {
      title: 'Sindhudurg Fort',
      subtitle: 'The 1664 Sea Fortress built by Shivaji Maharaj in the Arabian Sea',
      image: galleryList[0]?.url || 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600&q=85',
      caption: 'Massive undersea basalt foundation walls standing resilient against ocean surges.',
    },
    {
      title: 'Tarkarli Beach',
      subtitle: 'Transparent waters and unhurried coastal solitude',
      image: galleryList[1]?.url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
      caption: 'Water so clear you can count the shells on the sea bed.',
    },
    {
      title: 'Devbag Sangam',
      subtitle: 'Where the Karli River quietly enters the Arabian Sea',
      image: galleryList[2]?.url || 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=85',
      caption: 'A narrow sand spit between river and sea lined with swaying coconut palms.',
    },
  ];

  return (
    <article className="destination-page">
      {/* 1. Full-Screen Cinematic Photo Hero */}
      <header className="dest-hero">
        <div className="dest-hero__photo-bg">
          <SafeImage
            src={heroImage.url}
            fallbackSrc={heroImage.fallbackUrl}
            alt={heroImage.alt}
            className="dest-hero__photo"
            loading="eager"
          />
          <div className="dest-hero__photo-overlay" />
          <div className="dest-hero__glow" style={{ backgroundColor: `${regionColor}30` }} />
        </div>

        {/* Photography Credit Chip */}
        <div className="dest-hero__photo-credit-chip">
          <Camera size={13} />
          <span>Real Photograph &bull; {heroImage.location}</span>
        </div>

        <div className="container dest-hero__container">
          {/* Breadcrumbs */}
          <nav className="dest-hero__breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={12} />
            <Link to={`/district/${destination.district}`}>{destination.districtName}</Link>
            <ChevronRight size={12} />
            <span aria-current="page">{destination.name}</span>
          </nav>

          {/* Badges */}
          <div className="dest-hero__badges">
            <span
              className="dest-hero__region-pill"
              style={{
                backgroundColor: `${regionColor}25`,
                borderColor: `${regionColor}60`,
                color: '#FFFFFF',
              }}
            >
              {destination.districtName} District
            </span>

            {destination.featured && (
              <span className="dest-hero__featured-pill">
                <Sparkles size={12} />
                <span>Featured Experience</span>
              </span>
            )}
          </div>

          {/* Title & Tagline */}
          <h1 className="dest-hero__title">{destination.name}</h1>
          <p className="dest-hero__tagline">&ldquo;{destination.tagline}&rdquo;</p>

          {/* Categories */}
          <div className="dest-hero__categories">
            {destination.categories.map((cat) => (
              <span key={cat} className="dest-hero__category-tag">
                {CATEGORY_ICONS[cat] || '✦'} {cat.replace('-', ' ')}
              </span>
            ))}
          </div>

          {/* Quick Action Bar */}
          <div className="dest-hero__actions">
            <button
              onClick={() => navigate(`/plan/${destination.slug}`)}
              className="btn btn--primary dest-hero__cta"
            >
              <span>Plan This Trip</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`dest-hero__icon-btn ${isSaved ? 'dest-hero__icon-btn--active' : ''}`}
              aria-label="Save to favorites"
              title={isSaved ? 'Saved to Favorites' : 'Save to Favorites'}
            >
              <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="dest-hero__icon-btn"
              aria-label="Share this destination"
              title="Copy share link"
            >
              {copiedLink ? <Check size={18} className="text-success" /> : <Share2 size={18} />}
              <span>{copiedLink ? 'Copied Link' : 'Share'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Key Facts Strip */}
      <section className="dest-facts" aria-label="Key Destination Facts">
        <div className="container dest-facts__grid">
          <div className="dest-fact-card">
            <div className="dest-fact-card__icon text-earth">
              <Calendar size={20} />
            </div>
            <div className="dest-fact-card__info">
              <span className="dest-fact-card__label">Best Season</span>
              <span className="dest-fact-card__val capitalize">
                {destination.bestTime.season} ({destination.bestTime.months.slice(0, 3).join(', ')})
              </span>
            </div>
          </div>

          <div className="dest-fact-card">
            <div className="dest-fact-card__icon text-earth">
              <Clock size={20} />
            </div>
            <div className="dest-fact-card__info">
              <span className="dest-fact-card__label">Ideal Duration</span>
              <span className="dest-fact-card__val">
                {destination.idealDays} {destination.idealDays === 1 ? 'Day' : 'Days'} Recommended
              </span>
            </div>
          </div>

          <div className="dest-fact-card">
            <div className="dest-fact-card__icon text-earth">
              <MapPin size={20} />
            </div>
            <div className="dest-fact-card__info">
              <span className="dest-fact-card__label">Distance</span>
              <span className="dest-fact-card__val">
                {destination.distanceFromPune} km from Pune &bull; {destination.distanceFromMumbai} km from Mumbai
              </span>
            </div>
          </div>

          <div className="dest-fact-card">
            <div className="dest-fact-card__icon text-earth">
              <TrendingUp size={20} />
            </div>
            <div className="dest-fact-card__info">
              <span className="dest-fact-card__label">Popularity Score</span>
              <span className="dest-fact-card__val">
                {destination.popularity}/100 Rating
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Story & Essence */}
      <section className="dest-section container" aria-label="About the Destination">
        <div className="dest-story">
          <span className="dest-section__kicker">The Story</span>
          <h2 className="dest-section__heading">The Soul of {destination.name}</h2>
          <div className="dest-story__body">
            <p className="dest-story__lead">{destination.story}</p>
          </div>
        </div>
      </section>

      {/* 4. SPECIAL MALVAN 3-PHOTOGRAPH CINEMATIC EXPERIENCE (When on Tarkarli/Malvan) */}
      {isMalvanOrTarkarli && (
        <section className="malvan-experience container" aria-label="Malvan Special Photographic Experience">
          <div className="malvan-experience__header">
            <div className="malvan-experience__tag">
              <Layers size={16} />
              <span>Cinematic Visual Showcase</span>
            </div>
            <h2 className="malvan-experience__title">The Malvan Trilogy</h2>
            <p className="malvan-experience__subtitle">
              Three unmissable landscapes that capture the heart and soul of southern Konkan.
            </p>

            {/* Switcher tabs */}
            <div className="malvan-tabs">
              {malvanPhotos.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMalvanSlide(idx)}
                  className={`malvan-tab ${activeMalvanSlide === idx ? 'malvan-tab--active' : ''}`}
                >
                  <span className="malvan-tab__num">0{idx + 1}</span>
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="malvan-showcase">
            <div className="malvan-showcase__image-wrap">
              <SafeImage
                src={malvanPhotos[activeMalvanSlide].image}
                alt={malvanPhotos[activeMalvanSlide].title}
                className="malvan-showcase__photo"
              />
              <div className="malvan-showcase__overlay" />
              <div className="malvan-showcase__caption-box">
                <span className="malvan-showcase__index">Photo 0{activeMalvanSlide + 1} of 03</span>
                <h3 className="malvan-showcase__name">{malvanPhotos[activeMalvanSlide].title}</h3>
                <p className="malvan-showcase__sub">{malvanPhotos[activeMalvanSlide].subtitle}</p>
                <p className="malvan-showcase__desc">{malvanPhotos[activeMalvanSlide].caption}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. RESPONSIVE DESTINATION PHOTO GALLERY (3-6 Real Images) */}
      {galleryList.length > 0 && (
        <section className="dest-section dest-section--alt" aria-label="Destination Photographic Gallery">
          <div className="container">
            <div className="dest-section__header">
              <span className="dest-section__kicker">Visual Archive</span>
              <h2 className="dest-section__heading">Photographic Gallery</h2>
              <p className="dest-section__subheading">
                Real, authentic photography documenting the landscapes, heritage, and character of {destination.name}.
              </p>
            </div>

            {/* Desktop Asymmetrical Editorial Grid / Mobile Vertical Stack */}
            <div className="dest-gallery-grid">
              {galleryList.map((img, idx) => (
                <div
                  key={idx}
                  className={`dest-gallery-item ${idx === 0 ? 'dest-gallery-item--large' : ''}`}
                >
                  <SafeImage
                    src={img.url}
                    fallbackSrc={img.fallbackUrl}
                    alt={img.alt}
                    className="dest-gallery-item__img"
                  />
                  <div className="dest-gallery-item__overlay">
                    <div className="dest-gallery-item__info">
                      <span className="dest-gallery-item__title">{img.alt}</span>
                      <span className="dest-gallery-item__credit">
                        <Camera size={11} />
                        <span>{img.location}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Top Places to Explore with Real Photography */}
      {destination.topPlaces && destination.topPlaces.length > 0 && (
        <section className="dest-section container" aria-label="Top Sights to Visit">
          <div className="dest-section__header">
            <span className="dest-section__kicker">Must-See Sights</span>
            <h2 className="dest-section__heading">Top Places to Visit in {destination.name}</h2>
            <p className="dest-section__subheading">
              Essential landmarks, viewpoints, and monuments that define this landscape.
            </p>
          </div>

          <div className="dest-places-grid">
            {destination.topPlaces.map((place, idx) => {
              // Connect place to matching gallery image or fallback to primary destination card photo
              const placePhotoUrl =
                galleryList[idx % galleryList.length]?.url || heroImage.url;

              return (
                <div key={idx} className="place-card">
                  <div className="place-card__photo-container">
                    <SafeImage
                      src={placePhotoUrl}
                      alt={place.name}
                      className="place-card__photo"
                    />
                    <div className="place-card__photo-overlay" />
                    <div className="place-card__badge">
                      <Camera size={12} />
                      <span>{place.categories?.[0] || 'Sight'}</span>
                    </div>
                  </div>
                  <div className="place-card__content">
                    <h3 className="place-card__title">{place.name}</h3>
                    <p className="place-card__desc">{place.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. Activities & Experiences */}
      {destination.activities && destination.activities.length > 0 && (
        <section className="dest-section dest-section--alt" aria-label="Things to Do">
          <div className="container">
            <div className="dest-section__header">
              <span className="dest-section__kicker">Experiences</span>
              <h2 className="dest-section__heading">Activities & Things To Do</h2>
              <p className="dest-section__subheading">
                Curated experiences with typical duration and budget estimates.
              </p>
            </div>

            <div className="dest-activities-grid">
              {destination.activities.map((activity, idx) => (
                <div key={idx} className="activity-card">
                  <div className="activity-card__top">
                    <span className="activity-card__category">{activity.category}</span>
                    <span className="activity-card__cost">
                      {activity.estimatedCost === 0 ? 'Free Entry' : `₹${activity.estimatedCost}`}
                    </span>
                  </div>
                  <h3 className="activity-card__name">{activity.name}</h3>
                  <div className="activity-card__meta">
                    <Clock size={13} />
                    <span>{activity.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Food & Culinary Culture */}
      {destination.foodAndCulture && (
        <section className="dest-section container" aria-label="Culinary Traditions">
          <div className="dest-culinary">
            <div className="dest-culinary__content">
              <div className="dest-culinary__tag">
                <Utensils size={16} />
                <span>Flavours & Heritage</span>
              </div>
              <h2 className="dest-section__heading">Culinary Culture</h2>
              <p className="dest-culinary__desc">{destination.foodAndCulture.description}</p>

              <div className="dest-culinary__specialities">
                <h3 className="dest-culinary__spec-title">Local Specialities You Must Taste:</h3>
                <div className="dest-culinary__pills">
                  {destination.foodAndCulture.specialities.map((item, idx) => (
                    <span key={idx} className="dest-culinary__pill">
                      ✦ {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 9. Where to Stay */}
      {destination.stayOptions && (
        <section className="dest-section dest-section--alt" aria-label="Stay Options">
          <div className="container">
            <div className="dest-section__header">
              <span className="dest-section__kicker">Accommodation</span>
              <h2 className="dest-section__heading">Where to Stay</h2>
              <p className="dest-section__subheading">
                Accommodations catering to every travel preference and budget level.
              </p>
            </div>

            <div className="dest-stay-grid">
              {destination.stayOptions.budget && (
                <div className="stay-tier-card">
                  <div className="stay-tier-card__badge">Budget Friendly</div>
                  <div className="stay-tier-card__price">
                    {destination.stayOptions.budget.range}
                    <span className="text-xs text-muted"> / night</span>
                  </div>
                  <p className="stay-tier-card__desc">{destination.stayOptions.budget.description}</p>
                  <div className="stay-tier-card__icon">
                    <Bed size={18} />
                  </div>
                </div>
              )}

              {destination.stayOptions.standard && (
                <div className="stay-tier-card stay-tier-card--recommended">
                  <div className="stay-tier-card__badge stay-tier-card__badge--featured">Recommended</div>
                  <div className="stay-tier-card__price">
                    {destination.stayOptions.standard.range}
                    <span className="text-xs text-muted"> / night</span>
                  </div>
                  <p className="stay-tier-card__desc">{destination.stayOptions.standard.description}</p>
                  <div className="stay-tier-card__icon">
                    <Bed size={18} />
                  </div>
                </div>
              )}

              {destination.stayOptions.premium && (
                <div className="stay-tier-card">
                  <div className="stay-tier-card__badge">Luxury & Heritage</div>
                  <div className="stay-tier-card__price">
                    {destination.stayOptions.premium.range}
                    <span className="text-xs text-muted"> / night</span>
                  </div>
                  <p className="stay-tier-card__desc">{destination.stayOptions.premium.description}</p>
                  <div className="stay-tier-card__icon">
                    <Bed size={18} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 10. How to Reach */}
      {destination.howToReach && (
        <section className="dest-section container" aria-label="Transit & Connectivity">
          <div className="dest-section__header">
            <span className="dest-section__kicker">Connectivity</span>
            <h2 className="dest-section__heading">How to Reach {destination.name}</h2>
          </div>

          <div className="dest-transit-grid">
            <div className="transit-card">
              <div className="transit-card__icon text-earth">
                <Car size={24} />
              </div>
              <h3 className="transit-card__type">By Road</h3>
              <p className="transit-card__desc">{destination.howToReach.road}</p>
            </div>

            <div className="transit-card">
              <div className="transit-card__icon text-earth">
                <Train size={24} />
              </div>
              <h3 className="transit-card__type">By Rail</h3>
              <p className="transit-card__desc">{destination.howToReach.rail}</p>
            </div>

            <div className="transit-card">
              <div className="transit-card__icon text-earth">
                <Plane size={24} />
              </div>
              <h3 className="transit-card__type">By Air</h3>
              <p className="transit-card__desc">{destination.howToReach.air}</p>
            </div>
          </div>
        </section>
      )}

      {/* 11. Suggested Day-by-Day Itinerary */}
      {primaryItinerary && primaryItinerary.timeline.length > 0 && (
        <section className="dest-section dest-section--alt" aria-label="Suggested Itinerary">
          <div className="container">
            <div className="dest-section__header">
              <span className="dest-section__kicker">Trip Roadmap</span>
              <h2 className="dest-section__heading">{primaryItinerary.title}</h2>
              <p className="dest-section__subheading">
                A sample {primaryItinerary.days}-day itinerary crafted to experience the best of {destination.name}.
              </p>
            </div>

            {/* Day selection tabs */}
            {primaryItinerary.timeline.length > 1 && (
              <div className="dest-itinerary-tabs">
                {primaryItinerary.timeline.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setActiveItineraryDay(day.day)}
                    className={`dest-itinerary-tab ${
                      activeItineraryDay === day.day ? 'dest-itinerary-tab--active' : ''
                    }`}
                  >
                    Day {day.day}: {day.title}
                  </button>
                ))}
              </div>
            )}

            {/* Timeline events */}
            <div className="dest-timeline">
              {primaryItinerary.timeline
                .filter((day) => day.day === activeItineraryDay)
                .map((day) => (
                  <div key={day.day} className="dest-timeline__day">
                    <div className="dest-timeline__events">
                      {day.events.map((evt, idx) => (
                        <div key={idx} className="timeline-item">
                          <div className="timeline-item__time-badge">{evt.time}</div>
                          <div className="timeline-item__node" />
                          <div className="timeline-item__card">
                            <h4 className="timeline-item__title">{evt.title}</h4>
                            <p className="timeline-item__desc">{evt.description}</p>
                            <span className="timeline-item__type capitalize">{evt.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* 12. Call to Action Banner */}
      <section className="dest-cta container">
        <div className="dest-cta__card">
          <div className="dest-cta__glow" />
          <h2 className="dest-cta__title">Ready to Experience {destination.name}?</h2>
          <p className="dest-cta__desc">
            Customize dates, choose your travel mode, select stay preferences, and receive an instant transparent budget breakdown.
          </p>
          <div className="dest-cta__buttons">
            <Link to={`/plan/${destination.slug}`} className="btn btn--primary">
              <span>Start Planning Your Trip</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/search" className="btn btn--outline">
              Explore More Places
            </Link>
          </div>
        </div>
      </section>

      {/* 13. Image Source & Attribution Section */}
      <section className="dest-attribution container">
        <div className="dest-attribution__card">
          <div className="dest-attribution__header">
            <Shield size={16} className="text-earth" />
            <span>Photography Attribution & Licensing</span>
          </div>
          <p className="dest-attribution__text">
            Photography used on this page represents genuine, documented locations across Maharashtra.
            Primary imagery: <strong>{heroImage.photographer}</strong> via <strong>{heroImage.source}</strong> ({heroImage.license}).
            No AI-generated or synthetic landscapes are utilized in MahaSafar.
          </p>
        </div>
      </section>

      {/* 14. Related Destinations */}
      {relatedDestinations.length > 0 && (
        <section className="dest-section dest-section--alt" aria-label="Explore Related Destinations">
          <div className="container">
            <div className="dest-section__header">
              <span className="dest-section__kicker">Continue Your Journey</span>
              <h2 className="dest-section__heading">Other Places in Maharashtra</h2>
            </div>

            <div className="dest-related-grid">
              {relatedDestinations.map((rel) => {
                const relImage = getDestinationImage(rel.slug);

                return (
                  <Link to={`/destination/${rel.slug}`} key={rel._id} className="related-card">
                    <div className="related-card__photo-container">
                      <SafeImage
                        src={relImage.url}
                        alt={rel.name}
                        className="related-card__photo"
                      />
                      <div className="related-card__photo-overlay" />
                      <span className="related-card__district">{rel.districtName}</span>
                    </div>
                    <div className="related-card__body">
                      <h3 className="related-card__name">{rel.name}</h3>
                      <p className="related-card__tagline">&ldquo;{rel.tagline}&rdquo;</p>
                      <div className="related-card__footer">
                        <span className="text-earth text-xs font-semibold">Explore Destination &rarr;</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
