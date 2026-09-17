import { useRef } from 'react';
import { ChevronDown, Camera } from 'lucide-react';
import { gsap, useGSAP } from '../../animations/gsapConfig';
import { HERO_IMAGE } from '../../data/images';
import SafeImage from '../../components/ui/SafeImage';
import './HeroSection.css';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
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
    )
      .fromTo(
        mapRef.current?.querySelector('.hero__map-path') as Element,
        { strokeDashoffset: 800 },
        { strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut' },
        '-=0.2'
      )
      .fromTo(
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
        ctaRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.1'
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
          viewBox="0 0 400 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Simplified Maharashtra outline */}
          <path
            className="hero__map-path"
            d="M120 40 L140 32 L160 28 L180 30 L200 25 L220 28 L240 22 L260 30 L280 28 L300 35 L315 48 L325 65 L332 85 L338 105 L340 125 L338 145 L330 162 L318 178 L305 192 L290 205 L275 218 L260 228 L245 238 L228 248 L210 258 L192 265 L175 268 L158 265 L142 258 L128 248 L115 235 L102 220 L90 205 L80 188 L72 170 L65 152 L60 135 L58 118 L60 100 L65 85 L72 70 L82 55 L95 45 Z"
            stroke="var(--color-earth)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="800"
            strokeDashoffset="800"
            opacity="0.45"
          />
          {/* Subtle inner nodes */}
          <circle cx="148" cy="155" r="2.5" fill="var(--color-earth)" opacity="0.6" />
          <circle cx="200" cy="80" r="2.5" fill="var(--color-earth)" opacity="0.6" />
          <circle cx="290" cy="140" r="2.5" fill="var(--color-earth)" opacity="0.6" />
          <circle cx="230" cy="200" r="2.5" fill="var(--color-earth)" opacity="0.6" />
          <circle cx="170" cy="120" r="2.5" fill="var(--color-earth)" opacity="0.6" />
        </svg>

        {/* Title */}
        <h1 className="hero__title text-hero" ref={titleRef}>
          MAHARASHTRA
        </h1>

        {/* Tagline */}
        <p className="hero__tagline" ref={taglineRef}>
          An epic journey through mountains, sea forts, and sacred trails.
        </p>

        {/* CTA */}
        <div className="hero__cta" ref={ctaRef}>
          <a href="#journey" className="hero__button">
            EXPLORE THE JOURNEY
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="hero__scroll" ref={scrollRef}>
          <span className="hero__scroll-text">SCROLL TO TRAVEL</span>
          <ChevronDown size={16} className="hero__scroll-icon" />
        </div>
      </div>
    </section>
  );
}
