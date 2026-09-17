import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowRight, Compass, ChevronRight, Clock, Calendar } from 'lucide-react';
import { priorityDistricts, sampleDestinations } from '../data/destinations';
import { sampleHiddenSpots } from '../data/hiddenSpots';
import { REGION_COLORS } from '../data/regions';
import { REGIONAL_CHAPTER_IMAGES, getDestinationImage, getHiddenSpotImage } from '../data/images';
import SafeImage from '../components/ui/SafeImage';
import './DistrictPage.css';

export default function DistrictPage() {
  const { slug } = useParams<{ slug: string }>();

  // Find district by slug
  const district = useMemo(() => {
    return priorityDistricts.find(
      (d) => d.slug.toLowerCase() === slug?.toLowerCase()
    );
  }, [slug]);

  // Destinations in this district
  const districtDestinations = useMemo(() => {
    if (!slug) return [];
    return sampleDestinations.filter(
      (dest) => dest.district.toLowerCase() === slug.toLowerCase()
    );
  }, [slug]);

  // Hidden spots in this district
  const districtHiddenSpots = useMemo(() => {
    if (!slug) return [];
    return sampleHiddenSpots.filter(
      (spot) => spot.district.toLowerCase() === slug.toLowerCase()
    );
  }, [slug]);

  if (!district) {
    return (
      <div className="district-not-found container">
        <div className="district-not-found__card">
          <MapPin size={36} className="text-earth" />
          <h1>District Not Found</h1>
          <p>
            We couldn&apos;t locate district details for &ldquo;{slug}&rdquo;. Explore our other documented districts below.
          </p>
          <div className="district-not-found__links">
            {priorityDistricts.slice(0, 6).map((d) => (
              <Link key={d.slug} to={`/district/${d.slug}`} className="district-pill">
                {d.name}
              </Link>
            ))}
          </div>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/" className="btn btn--primary">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const regionColor = REGION_COLORS[district.region] || '#C9A96E';
  const regionHeroImage = REGIONAL_CHAPTER_IMAGES[district.region]?.hero;

  return (
    <div className="district-page">
      {/* Hero Header with Real Photographic Backdrop */}
      <header className="district-hero">
        {regionHeroImage && (
          <div className="district-hero__photo-bg">
            <SafeImage
              src={regionHeroImage.url}
              fallbackSrc={regionHeroImage.fallbackUrl}
              alt={district.name}
              className="district-hero__photo"
            />
            <div className="district-hero__photo-overlay" />
          </div>
        )}

        <div className="container district-hero__container">
          <nav className="district-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={12} />
            <Link to="/search">Districts</Link>
            <ChevronRight size={12} />
            <span aria-current="page">{district.name}</span>
          </nav>

          <span
            className="district-badge"
            style={{
              borderColor: `${regionColor}88`,
              color: '#FFFFFF',
              backgroundColor: `${regionColor}40`,
            }}
          >
            {district.region.replace('-', ' ')}
          </span>

          <h1 className="district-title">{district.name}</h1>
          <p className="district-tagline">&ldquo;{district.tagline}&rdquo;</p>

          <div className="district-highlights">
            {district.highlights.map((h, i) => (
              <span key={i} className="district-highlight-tag">
                ✦ {h}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Destinations in District */}
      <section className="district-section container">
        <div className="district-section__header">
          <span className="district-section__kicker">Featured Exploration</span>
          <h2 className="district-section__title">Destinations in {district.name}</h2>
          <p className="district-section__subtitle">
            Curated points of interest, heritage citadels, and natural landscapes.
          </p>
        </div>

        {districtDestinations.length > 0 ? (
          <div className="district-dest-grid">
            {districtDestinations.map((dest) => {
              const destImage = getDestinationImage(dest.slug);

              return (
                <article key={dest._id} className="district-dest-card">
                  {/* Real Photo Header */}
                  <div className="district-dest-card__photo-wrap">
                    <SafeImage
                      src={destImage.url}
                      fallbackSrc={destImage.fallbackUrl}
                      alt={dest.name}
                      className="district-dest-card__photo"
                    />
                    <div className="district-dest-card__photo-overlay" />
                    <span className="district-dest-card__rating-badge">
                      {dest.popularity}/100 Rating
                    </span>
                  </div>

                  <div className="district-dest-card__body">
                    <div className="district-dest-card__top">
                      <span className="district-dest-card__days">{dest.idealDays} Days</span>
                      <span className="district-dest-card__dist">
                        {dest.distanceFromMumbai > 0
                          ? `${dest.distanceFromMumbai} km from Mumbai`
                          : `${dest.distanceFromPune} km from Pune`}
                      </span>
                    </div>

                    <h3 className="district-dest-card__name">{dest.name}</h3>
                    <p className="district-dest-card__tagline">&ldquo;{dest.tagline}&rdquo;</p>
                    <p className="district-dest-card__story-snippet">
                      {dest.story.slice(0, 130)}...
                    </p>

                    <div className="district-dest-card__stats">
                      <span className="district-dest-card__stat">
                        <Clock size={12} />
                        <span>~{Math.max(1, Math.round((dest.distanceFromPune || 150) / 50))}h road drive</span>
                      </span>
                      <span className="district-dest-card__stat">
                        <Calendar size={12} />
                        <span>Best: {dest.bestTime.season}</span>
                      </span>
                    </div>

                    <div className="district-dest-card__actions">
                      <Link to={`/destination/${dest.slug}`} className="btn btn--outline btn--sm">
                        View Details
                      </Link>
                      <Link to={`/plan/${dest.slug}`} className="btn btn--primary btn--sm">
                        Plan Trip
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="district-empty">
            <p>Detailed destination profiles for {district.name} are currently being curated.</p>
            <Link to="/plan" className="btn btn--primary" style={{ marginTop: '1rem' }}>
              Plan a Custom Itinerary for {district.name}
            </Link>
          </div>
        )}
      </section>

      {/* Hidden Spots in District */}
      {districtHiddenSpots.length > 0 && (
        <section className="district-section district-section--alt">
          <div className="container">
            <div className="district-section__header">
              <span className="district-section__kicker">Secret Locations</span>
              <h2 className="district-section__title">Hidden Gems in {district.name}</h2>
            </div>

            <div className="district-hidden-grid">
              {districtHiddenSpots.map((spot) => {
                const spotImage = getHiddenSpotImage(spot.slug);

                return (
                  <div key={spot._id} className="district-hidden-card">
                    <div className="district-hidden-card__photo-wrap">
                      <SafeImage
                        src={spotImage.url}
                        fallbackSrc={spotImage.fallbackUrl}
                        alt={spot.name}
                        className="district-hidden-card__photo"
                      />
                      <div className="district-hidden-card__photo-overlay" />
                      <span className="district-hidden-card__badge">
                        {spot.badge.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="district-hidden-card__content">
                      <h3 className="district-hidden-card__name">{spot.name}</h3>
                      <p className="district-hidden-card__desc">{spot.description}</p>
                      <div className="district-hidden-card__why">
                        <strong>Why visit:</strong> {spot.whyVisit}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* District Trip Planner CTA */}
      <section className="district-cta container">
        <div className="district-cta__box">
          <Compass size={32} className="text-earth" />
          <h2>Want to travel across {district.name}?</h2>
          <p>Create a custom route with travel budget, transport modes, and duration.</p>
          <Link to="/plan" className="btn btn--primary">
            <span>Open MahaSafar Planner</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
