import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Compass, ShieldAlert, ArrowRight, Camera } from 'lucide-react';
import { sampleHiddenSpots } from '../../data/hiddenSpots';
import { getHiddenSpotImage } from '../../data/images';
import SafeImage from '../../components/ui/SafeImage';
import { gsap, useGSAP } from '../../animations/gsapConfig';
import './HiddenMaharashtra.css';

const BADGE_LABELS: Record<string, { label: string; color: string }> = {
  'hidden-gem': { label: 'Hidden Gem', color: '#D4BA85' },
  'local-favourite': { label: 'Local Secret', color: '#6B8E4E' },
  'nature-escape': { label: 'Nature Sanctuary', color: '#5B8A51' },
  'photography-spot': { label: 'Photo Spot', color: '#2A5F9E' },
  'sunset-point': { label: 'Golden Hour', color: '#C45A3C' },
  'offbeat': { label: 'Offbeat Route', color: '#A67B5B' },
};

export default function HiddenMaharashtra() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = sectionRef.current?.querySelectorAll('.hidden-card');
    cards?.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.08,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section className="hidden-maharashtra section" ref={sectionRef} aria-label="Hidden spots in Maharashtra">
      <div className="container">
        {/* Header */}
        <div className="hidden-maharashtra__header">
          <div className="hidden-maharashtra__tag">
            <Sparkles size={16} />
            <span>Off The Beaten Path</span>
          </div>
          <h2 className="text-section hidden-maharashtra__title">
            Hidden Maharashtra
          </h2>
          <p className="hidden-maharashtra__subtitle">
            Uncrowded beaches, slot canyons, and luminous valleys known mostly to locals and seasoned explorers.
          </p>
        </div>

        {/* Grid */}
        <div className="hidden-maharashtra__grid">
          {sampleHiddenSpots.map((spot) => {
            const badgeInfo = BADGE_LABELS[spot.badge] || { label: 'Hidden Place', color: '#C9A96E' };
            const spotImage = getHiddenSpotImage(spot.slug);

            return (
              <article key={spot._id} className="hidden-card">
                {/* Real Photographic Card Header */}
                <div className="hidden-card__image-container">
                  <SafeImage
                    src={spotImage.url}
                    fallbackSrc={spotImage.fallbackUrl}
                    alt={spotImage.alt}
                    className="hidden-card__photo"
                  />
                  <div className="hidden-card__photo-overlay" />
                  
                  <div className="hidden-card__photo-badges">
                    <span
                      className="hidden-card__badge"
                      style={{
                        backgroundColor: `${badgeInfo.color}dd`,
                        color: '#FFFFFF',
                      }}
                    >
                      {badgeInfo.label}
                    </span>
                    <div className="hidden-card__district">
                      <MapPin size={12} />
                      <span>{spot.districtName}</span>
                    </div>
                  </div>

                  <div className="hidden-card__photo-credit">
                    <Camera size={10} />
                    <span>{spotImage.location}</span>
                  </div>
                </div>

                <div className="hidden-card__body">
                  <h3 className="hidden-card__name">{spot.name}</h3>
                  <p className="hidden-card__desc">{spot.description}</p>

                  <div className="hidden-card__meta">
                    <div className="hidden-card__meta-item">
                      <Compass size={13} />
                      <span>Difficulty: <strong className="capitalize">{spot.difficulty}</strong></span>
                    </div>
                    <div className="hidden-card__meta-item">
                      <span>Crowd: <strong className="capitalize">{spot.crowdLevel.replace('-', ' ')}</strong></span>
                    </div>
                  </div>

                  <div className="hidden-card__why">
                    <span className="hidden-card__why-label">Why Go:</span> {spot.whyVisit}
                  </div>

                  {spot.safetyNote && (
                    <div className="hidden-card__safety">
                      <ShieldAlert size={12} />
                      <span>{spot.safetyNote}</span>
                    </div>
                  )}

                  <div className="hidden-card__footer">
                    <Link to={`/destination/${spot.destination}`} className="hidden-card__link">
                      <span>Explore Area Guide</span>
                      <ArrowRight size={14} />
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
