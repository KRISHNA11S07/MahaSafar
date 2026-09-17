import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP } from '../../animations/gsapConfig';
import { categories } from '../../data/categories';
import { getCategoryImage } from '../../data/images';
import SafeImage from '../../components/ui/SafeImage';
import './CategoryExplorer.css';

export default function CategoryExplorer() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = sectionRef.current?.querySelectorAll('.category-card');
    cards?.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.07,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, { scope: sectionRef });

  // Asymmetrical editorial grid layout
  const layoutClasses = [
    'category-card--wide', // Beaches - 2 col
    'category-card--tall', // Mountains - tall
    'category-card--normal', // Forts
    'category-card--normal', // Wildlife
    'category-card--normal', // Heritage
    'category-card--wide', // Spiritual - 2 col
    'category-card--normal', // Food & Culture
    'category-card--full', // Hidden Maharashtra - full span
  ];

  return (
    <section className="category-explorer section" ref={sectionRef} aria-label="Explore by category">
      <div className="container">
        <div className="category-explorer__header">
          <span className="category-explorer__tag">Curated Collections</span>
          <h2 className="text-section category-explorer__title">
            Where will you go next?
          </h2>
          <p className="category-explorer__subtitle">
            Explore Maharashtra by landscapes, historic citadels, and rich cultural traditions.
          </p>
        </div>

        <div className="category-explorer__grid">
          {categories.map((cat, i) => {
            const categoryImage = getCategoryImage(cat.slug);

            return (
              <Link
                to={`/search?category=${cat.slug}`}
                key={cat.slug}
                className={`category-card ${layoutClasses[i] || 'category-card--normal'}`}
              >
                {/* Real Photographic Background */}
                <div className="category-card__photo-wrap">
                  <SafeImage
                    src={categoryImage.url}
                    fallbackSrc={categoryImage.fallbackUrl}
                    alt={categoryImage.alt}
                    className="category-card__photo"
                  />
                  <div className="category-card__gradient-overlay" />
                </div>

                {/* Content Overlay */}
                <div className="category-card__content">
                  <div className="category-card__top">
                    <span className="category-card__count">{cat.count} places</span>
                    <span className="category-card__arrow">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>

                  <div className="category-card__bottom">
                    <h3 className="category-card__name">{cat.name}</h3>
                    <p className="category-card__desc">{cat.description}</p>
                    <span className="category-card__location-chip">
                      {categoryImage.location}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
