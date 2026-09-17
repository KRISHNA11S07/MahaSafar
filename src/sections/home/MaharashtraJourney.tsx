import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, Camera } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP } from '../../animations/gsapConfig';
import { regions } from '../../data/regions';
import { sampleDestinations } from '../../data/destinations';
import { REGIONAL_CHAPTER_IMAGES, getDestinationImage } from '../../data/images';
import SafeImage from '../../components/ui/SafeImage';
import './MaharashtraJourney.css';

const CHAPTER_COLORS: Record<number, string> = {
  1: '#2A5F9E', // Konkan blue
  2: '#4A6741', // Heritage green
  3: '#8B6F47', // Earth brown
  4: '#A67B5B', // Sandstone
  5: '#6B8E4E', // Wildlife green
};

export default function MaharashtraJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [activeRegionSlug, setActiveRegionSlug] = useState<string>(regions[0].slug);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Pin the map & visual viewport during the scroll journey
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: mapRef.current,
      pinSpacing: false,
    });

    // Track active chapter during scroll to dynamically update the pinned photography showcase
    const chapters = sectionRef.current?.querySelectorAll<HTMLElement>('.journey-chapter');
    chapters?.forEach((chapter) => {
      const slug = chapter.getAttribute('data-region-slug');
      if (slug) {
        ScrollTrigger.create({
          trigger: chapter,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActiveRegionSlug(slug),
          onEnterBack: () => setActiveRegionSlug(slug),
        });
      }

      const title = chapter.querySelector('.journey-chapter__title');
      const cards = chapter.querySelectorAll('.journey-chapter__card');
      const intro = chapter.querySelector('.journey-chapter__intro');
      const photoStrip = chapter.querySelector('.journey-chapter__photo-strip');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: chapter,
          start: 'top 75%',
          end: 'top 25%',
          scrub: 0.5,
        },
      });

      if (title) {
        tl.fromTo(
          title,
          { opacity: 0, scale: 1.15, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8 }
        );
      }

      if (intro) {
        tl.fromTo(
          intro,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.4'
        );
      }

      if (photoStrip) {
        tl.fromTo(
          photoStrip,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        );
      }

      if (cards.length) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 0.7 },
          '-=0.2'
        );
      }
    });

    // Route line animation synced with scroll
    const routePath = sectionRef.current?.querySelector('.journey-map__route');
    if (routePath) {
      gsap.fromTo(
        routePath,
        { strokeDashoffset: 1200 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        }
      );
    }
  }, { scope: sectionRef });

  // Get destinations per region
  const getRegionDestinations = (regionSlug: string) => {
    return sampleDestinations.filter((d) => d.region === regionSlug);
  };

  const activeChapterData = REGIONAL_CHAPTER_IMAGES[activeRegionSlug] || REGIONAL_CHAPTER_IMAGES['mumbai-konkan'];

  return (
    <section className="journey" ref={sectionRef} id="journey" aria-label="Maharashtra Journey">
      {/* Sticky Visual Viewport: Pinned Real Destination Photography + SVG Map */}
      <div className="journey-map" ref={mapRef} aria-hidden="true">
        <div className="journey-map__inner">
          {/* Active Chapter Real Photograph Showcase */}
          <div className="journey-photo-backdrop">
            <SafeImage
              src={activeChapterData.hero.url}
              fallbackSrc={activeChapterData.hero.fallbackUrl}
              alt={activeChapterData.hero.alt}
              className="journey-photo-backdrop__img"
            />
            <div className="journey-photo-backdrop__overlay" />
            <div className="journey-photo-backdrop__meta">
              <Camera size={13} className="text-earth" />
              <span>{activeChapterData.hero.location}</span>
            </div>
          </div>

          {/* SVG Map with interactive route overlay */}
          <div className="journey-map__svg-wrapper">
            <svg
              className="journey-map__svg"
              viewBox="0 0 400 350"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Maharashtra outline */}
              <path
                className="journey-map__outline"
                d="M120 40 L140 32 L160 28 L180 30 L200 25 L220 28 L240 22 L260 30 L280 28 L300 35 L315 48 L325 65 L332 85 L338 105 L340 125 L338 145 L330 162 L318 178 L305 192 L290 205 L275 218 L260 228 L245 238 L228 248 L210 258 L192 265 L175 268 L158 265 L142 258 L128 248 L115 235 L102 220 L90 205 L80 188 L72 170 L65 152 L60 135 L58 118 L60 100 L65 85 L72 70 L82 55 L95 45 Z"
                stroke="rgba(245, 240, 235, 0.25)"
                strokeWidth="1.2"
                fill="rgba(10, 9, 8, 0.45)"
              />

              {/* Route line through Maharashtra */}
              <path
                className="journey-map__route"
                d="M130 175 L155 160 L175 148 L195 135 L200 110 L215 95 L245 85 L270 95 L295 115 L310 140"
                stroke="var(--color-earth)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="1200"
                strokeDashoffset="1200"
                fill="none"
                opacity="0.85"
              />

              {/* District markers */}
              {/* Mumbai */}
              <circle cx="130" cy="175" r="5" fill="#C9A96E" className="journey-map__marker" />
              <text x="110" y="193" fill="#F5F0EB" fontSize="9" fontWeight="600" fontFamily="var(--font-ui)">
                Mumbai
              </text>

              {/* Pune */}
              <circle cx="155" cy="160" r="4.5" fill="#4A6741" className="journey-map__marker" />
              <text x="140" y="153" fill="rgba(245,240,235,0.8)" fontSize="8" fontFamily="var(--font-ui)">
                Pune
              </text>

              {/* Nashik */}
              <circle cx="175" cy="148" r="4" fill="#8B6F47" className="journey-map__marker" />
              <text x="178" y="142" fill="rgba(245,240,235,0.8)" fontSize="8" fontFamily="var(--font-ui)">
                Nashik
              </text>

              {/* Kolhapur */}
              <circle cx="140" cy="220" r="4" fill="#4A6741" className="journey-map__marker" />
              <text x="146" y="224" fill="rgba(245,240,235,0.8)" fontSize="8" fontFamily="var(--font-ui)">
                Kolhapur
              </text>

              {/* Sambhajinagar */}
              <circle cx="215" cy="95" r="4.5" fill="#A67B5B" className="journey-map__marker" />
              <text x="220" y="90" fill="rgba(245,240,235,0.8)" fontSize="8" fontFamily="var(--font-ui)">
                Sambhajinagar
              </text>

              {/* Nagpur */}
              <circle cx="310" cy="140" r="5" fill="#6B8E4E" className="journey-map__marker" />
              <text x="295" y="157" fill="#F5F0EB" fontSize="9" fontWeight="600" fontFamily="var(--font-ui)">
                Nagpur
              </text>

              {/* Sindhudurg/Konkan */}
              <circle cx="115" cy="250" r="4.5" fill="#2A5F9E" className="journey-map__marker" />
              <text x="100" y="265" fill="#F5F0EB" fontSize="8" fontFamily="var(--font-ui)">
                Sindhudurg
              </text>
            </svg>
          </div>

          <div className="journey-map__label">
            <span className="text-label">SCROLLING MAHARASHTRA</span>
          </div>
        </div>
      </div>

      {/* Scrolling Narrative Chapters */}
      <div className="journey-chapters">
        {regions.map((region) => {
          const destinations = getRegionDestinations(region.slug);
          const chapterColor = CHAPTER_COLORS[region.chapterNumber];
          const chapterImages = REGIONAL_CHAPTER_IMAGES[region.slug] || REGIONAL_CHAPTER_IMAGES['mumbai-konkan'];

          return (
            <div
              className="journey-chapter"
              key={region.slug}
              data-region-slug={region.slug}
              style={{ '--chapter-color': chapterColor } as React.CSSProperties}
            >
              {/* Chapter Header */}
              <div className="journey-chapter__header">
                <span className="journey-chapter__number text-label">
                  Chapter {String(region.chapterNumber).padStart(2, '0')}
                </span>
                <h2 className="journey-chapter__title text-chapter">
                  {region.name}
                </h2>
                <p className="journey-chapter__intro">
                  {region.description}
                </p>
              </div>

              {/* Real Landmark Photographic Strip for this Chapter */}
              <div className="journey-chapter__photo-strip">
                {chapterImages.spots.map((spot, idx) => (
                  <div key={idx} className="photo-strip-item">
                    <SafeImage
                      src={spot.image.url}
                      fallbackSrc={spot.image.fallbackUrl}
                      alt={spot.image.alt}
                      className="photo-strip-item__img"
                    />
                    <div className="photo-strip-item__caption">
                      <span className="photo-strip-item__name">{spot.name}</span>
                      <span className="photo-strip-item__dist">{spot.district}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Destination Cards (Upgraded with Real Photos and Full Meta) */}
              <div className="journey-chapter__destinations">
                {destinations.map((dest) => {
                  const destImage = getDestinationImage(dest.slug);

                  return (
                    <article key={dest.slug} className="journey-chapter__card">
                      {/* Real Photography Image Container */}
                      <div className="journey-chapter__card-image">
                        <SafeImage
                          src={destImage.url}
                          fallbackSrc={destImage.fallbackUrl}
                          alt={destImage.alt}
                          className="journey-chapter__card-img"
                        />
                        <div className="journey-chapter__card-overlay" />
                        <span
                          className="journey-chapter__card-district-badge"
                          style={{
                            backgroundColor: `${chapterColor}dd`,
                            color: '#FFFFFF',
                          }}
                        >
                          {dest.districtName}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="journey-chapter__card-info">
                        <div className="journey-chapter__card-header-meta">
                          <span className="journey-chapter__card-dist">
                            {dest.distanceFromMumbai > 0
                              ? `${dest.distanceFromMumbai} km from Mumbai`
                              : `${dest.distanceFromPune} km from Pune`}
                          </span>
                        </div>

                        <h3 className="journey-chapter__card-name">{dest.name}</h3>
                        <p className="journey-chapter__card-tagline">&ldquo;{dest.tagline}&rdquo;</p>
                        <p className="journey-chapter__card-story">
                          {dest.story.slice(0, 130)}...
                        </p>

                        <div className="journey-chapter__card-stats">
                          <div className="journey-chapter__card-stat">
                            <Clock size={13} />
                            <span>~{Math.max(1, Math.round((dest.distanceFromPune || 150) / 50))}h road drive</span>
                          </div>
                          <div className="journey-chapter__card-stat">
                            <Calendar size={13} />
                            <span>{dest.idealDays} {dest.idealDays === 1 ? 'day' : 'days'} trip</span>
                          </div>
                        </div>

                        <div className="journey-chapter__card-actions">
                          <Link
                            to={`/destination/${dest.slug}`}
                            className="journey-chapter__card-explore"
                          >
                            <span>View Destination</span>
                            <ArrowRight size={14} />
                          </Link>
                          <Link
                            to={`/plan/${dest.slug}`}
                            className="journey-chapter__card-plan-btn"
                          >
                            Plan Trip
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* District navigation trail */}
              <div className="journey-chapter__districts">
                <span className="journey-chapter__districts-label">Exploring: </span>
                {region.districts.slice(0, 5).map((d, i) => (
                  <span key={d} className="journey-chapter__district-name">
                    <Link to={`/district/${d}`}>
                      {d.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Link>
                    {i < Math.min(region.districts.length, 5) - 1 && (
                      <span className="journey-chapter__district-arrow"> &bull; </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
