import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, Camera } from 'lucide-react';
import { gsap, ScrollTrigger, useGSAP } from '../../animations/gsapConfig';
import { regions } from '../../data/regions';
import { sampleDestinations } from '../../data/destinations';
import { REGIONAL_CHAPTER_IMAGES, getDestinationImage } from '../../data/images';
import {
  MAHARASHTRA_BOUNDARY_ATTRIBUTION,
  MAHARASHTRA_BOUNDARY_PATH,
  MAHARASHTRA_MAP_VIEWBOX,
  projectMaharashtraCoordinates,
} from '../../data/maharashtraBoundary';
import SafeImage from '../../components/ui/SafeImage';
import './MaharashtraJourney.css';

interface JourneyMapCity {
  name: string;
  coordinates: [number, number];
  color: string;
  radius: number;
  labelOffset: [number, number];
  emphasis?: boolean;
}

const JOURNEY_MAP_CITIES: JourneyMapCity[] = [
  { name: 'Mumbai', coordinates: [72.8777, 19.076], color: '#C9A96E', radius: 5, labelOffset: [-18, 19], emphasis: true },
  { name: 'Pune', coordinates: [73.8567, 18.5204], color: '#4A6741', radius: 4.5, labelOffset: [8, -9] },
  { name: 'Nashik', coordinates: [73.7898, 19.9975], color: '#8B6F47', radius: 4, labelOffset: [7, -7] },
  { name: 'Sambhajinagar', coordinates: [75.3433, 19.8762], color: '#A67B5B', radius: 4.5, labelOffset: [8, -2] },
  { name: 'Nagpur', coordinates: [79.0882, 21.1458], color: '#6B8E4E', radius: 5, labelOffset: [8, 4], emphasis: true },
  { name: 'Kolhapur', coordinates: [74.2433, 16.705], color: '#4A6741', radius: 4, labelOffset: [8, 4] },
  { name: 'Sindhudurg', coordinates: [73.4682, 16.0194], color: '#2A5F9E', radius: 4.5, labelOffset: [-5, 18] },
];

const JOURNEY_MAP_POINTS = JOURNEY_MAP_CITIES.map((city) => ({
  ...city,
  point: projectMaharashtraCoordinates(city.coordinates),
}));
const JOURNEY_MAP_ROUTE = `M ${JOURNEY_MAP_POINTS.map(({ point }) => point.join(' ')).join(' L ')} Z`;

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
    if (prefersReducedMotion) {
      const routePath = sectionRef.current?.querySelector<SVGPathElement>('.journey-map__route');
      if (routePath) {
        routePath.style.strokeDasharray = 'none';
        routePath.style.strokeDashoffset = '0';
      }
      return;
    }

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

    // Route line animation synced with scroll across the complete circular path
    const routePath = sectionRef.current?.querySelector<SVGPathElement>('.journey-map__route');
    if (routePath) {
      const pathLength = Math.ceil(routePath.getTotalLength() || 600);
      routePath.style.strokeDasharray = `${pathLength}`;
      routePath.style.strokeDashoffset = `${pathLength}`;

      gsap.fromTo(
        routePath,
        { strokeDashoffset: pathLength },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
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
      <div className="journey-map" ref={mapRef}>
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
              viewBox={MAHARASHTRA_MAP_VIEWBOX}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                className="journey-map__outline"
                d={MAHARASHTRA_BOUNDARY_PATH}
                stroke="rgba(245, 240, 235, 0.25)"
                strokeWidth="1.2"
                fill="rgba(10, 9, 8, 0.45)"
                fillRule="evenodd"
              />

              {/* Illustrative route connects the mapped cities in geographic order. */}
              <path
                className="journey-map__route"
                d={JOURNEY_MAP_ROUTE}
                stroke="var(--color-earth)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="600"
                strokeDashoffset="600"
                fill="none"
                opacity="0.9"
              />

              {JOURNEY_MAP_POINTS.map(({ name, point, color, radius, labelOffset, emphasis }) => (
                <g key={name}>
                  <circle
                    cx={point[0]}
                    cy={point[1]}
                    r={radius}
                    fill={color}
                    className="journey-map__marker"
                  />
                  <text
                    x={point[0] + labelOffset[0]}
                    y={point[1] + labelOffset[1]}
                    fill={emphasis ? '#F5F0EB' : 'rgba(245,240,235,0.85)'}
                    fontSize={emphasis ? 9 : 8}
                    fontWeight={emphasis ? 600 : 400}
                    fontFamily="var(--font-ui)"
                  >
                    {name}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="journey-map__label">
            <span className="text-label">Maharashtra, region by region</span>
            <a href={MAHARASHTRA_BOUNDARY_ATTRIBUTION.website} target="_blank" rel="noreferrer">
              Boundary data: geoBoundaries
            </a>
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
                      {spot.image.sourcePage && spot.image.licenseUrl && (
                        <span className="photo-strip-item__credit">
                          Photo: <a href={spot.image.sourcePage} target="_blank" rel="noreferrer">{spot.image.photographer}</a>
                          {' · '}
                          <a href={spot.image.licenseUrl} target="_blank" rel="noreferrer">{spot.image.license}</a>
                        </span>
                      )}
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
