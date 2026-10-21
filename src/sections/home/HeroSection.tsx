import { useRef } from 'react';
import { ChevronDown, Camera } from 'lucide-react';
import { gsap, useGSAP } from '../../animations/gsapConfig';
import { HERO_IMAGE } from '../../data/images';
import { MAHARASHTRA_BOUNDARY_PATH, MAHARASHTRA_MAP_VIEWBOX } from '../../data/maharashtraBoundary';
import SafeImage from '../../components/ui/SafeImage';
import './HeroSection.css';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // Slow cinematic zoom-in on the real Maharashtra landscape image
    if (heroImageRef.current) {
      gsap.fromTo(
        heroImageRef.current,
        { scale: 1.12, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8, ease: 'power2.out' }
      );
    }

    tl.fromTo(
      logoRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.2
    );

    const mapPath = mapRef.current?.querySelector<SVGPathElement>('.hero__map-path');
    if (mapPath) {
      const pathLength = Math.ceil(mapPath.getTotalLength());
      mapPath.style.strokeDasharray = `${pathLength}`;
      mapPath.style.strokeDashoffset = `${pathLength}`;
      tl.fromTo(
        mapPath,
        { strokeDashoffset: pathLength },
        { strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut' },
        '-=0.2'
      );
    }

    tl.fromTo(
      titleRef.current,
      { opacity: 0, scale: 0.88, y: 25 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'expo.out' },
      '-=0.6'
    )
      .fromTo(
        taglineRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.3'
      )
      .fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
        '-=0.1'
      );

    // Subtle continuous bounce on scroll indicator
    gsap.to(scrollRef.current, {
      y: 8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }, { scope: containerRef });

  return (
    <section className="hero" ref={containerRef} aria-label="MahaSafar Hero">
      {/* Real Maharashtra Photography Background */}
      <div className="hero__photo-container" ref={heroImageRef} aria-hidden="true">
        <SafeImage
          src={HERO_IMAGE.url}
          fallbackSrc={HERO_IMAGE.fallbackUrl}
          alt={HERO_IMAGE.alt}
          className="hero__photo"
          loading="eager"
        />
        {/* Layered cinematic vignette + gradient overlay */}
        <div className="hero__photo-overlay" />
        <div className="hero__photo-grain" />
      </div>

      {/* Photography Location Tag */}
      <div className="hero__photo-badge" title={HERO_IMAGE.caption}>
        <Camera size={12} />
        <span>{HERO_IMAGE.title} &bull; {HERO_IMAGE.location}</span>
      </div>

      {/* Content */}
      <div className="hero__content">
        {/* Logo watermark */}
        <div className="hero__logo" ref={logoRef} aria-hidden="true">
          MAHASAFAR
        </div>

        {/* Maharashtra silhouette SVG overlaid on the photo */}
        <svg
          ref={mapRef}
          className="hero__map"
          viewBox={MAHARASHTRA_MAP_VIEWBOX}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            className="hero__map-path"
            d={MAHARASHTRA_BOUNDARY_PATH}
            stroke="var(--color-earth)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.45"
          />
        </svg>

        {/* Title */}
        <h1 className="hero__title text-hero" ref={titleRef}>
          MAHARASHTRA
        </h1>

        {/* Tagline */}
        <p className="hero__tagline" ref={taglineRef}>
          Sea forts, Sahyadri ridgelines and old pilgrim trails. Let's find your next weekend away.
        </p>

        {/* Scroll Indicator */}
        <div className="hero__scroll" ref={scrollRef}>
          <span className="hero__scroll-text">Keep scrolling</span>
          <ChevronDown size={16} className="hero__scroll-icon" />
        </div>
      </div>
    </section>
  );
}
