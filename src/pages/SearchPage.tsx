import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { sampleDestinations, priorityDistricts } from '../data/destinations';
import { categories } from '../data/categories';
import { regions } from '../data/regions';
import { getDestinationImage } from '../data/images';
import SafeImage from '../components/ui/SafeImage';
import './SearchPage.css';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedRegion, setSelectedRegion] = useState('');

  // Sync URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params, { replace: true });
  }, [query, selectedCategory, setSearchParams]);

  // Filtered Destinations
  const filteredDestinations = useMemo(() => {
    return sampleDestinations.filter((dest) => {
      const matchesQuery =
        !query ||
        dest.name.toLowerCase().includes(query.toLowerCase()) ||
        dest.districtName.toLowerCase().includes(query.toLowerCase()) ||
        dest.tagline.toLowerCase().includes(query.toLowerCase()) ||
        dest.activities.some((a) => a.name.toLowerCase().includes(query.toLowerCase()));

      const matchesCategory =
        !selectedCategory || dest.categories.includes(selectedCategory);

      const matchesRegion =
        !selectedRegion || dest.region === selectedRegion;

      return matchesQuery && matchesCategory && matchesRegion;
    });
  }, [query, selectedCategory, selectedRegion]);

  // Matching Districts
  const filteredDistricts = useMemo(() => {
    if (!query) return [];
    return priorityDistricts.filter((dist) =>
      dist.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="search-page">
      {/* Header */}
      <header className="search-header">
        <div className="container search-header__container">
          <span className="search-header__tag">
            <Sparkles size={14} />
            <span>Directory & Discovery</span>
          </span>
          <h1 className="search-header__title">Find Your Next Destination</h1>
          <p className="search-header__subtitle">
            Search across Maharashtra&apos;s 36 districts, coastal shores, Sahyadri forts, and wildlife reserves.
          </p>

          {/* Search Bar Input */}
          <div className="search-bar">
            <Search size={20} className="search-bar__icon" />
            <input
              type="text"
              placeholder="Search by destination name, district, activity (e.g. Scuba, Forts, Tarkarli)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-bar__input"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="search-bar__clear"
                aria-label="Clear query"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Filter Section */}
      <section className="search-filters container">
        {/* Category Filters */}
        <div className="filter-group">
          <span className="filter-group__label">Category:</span>
          <div className="filter-pills">
            <button
              onClick={() => setSelectedCategory('')}
              className={`filter-pill ${!selectedCategory ? 'filter-pill--active' : ''}`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)
                }
                className={`filter-pill ${selectedCategory === cat.slug ? 'filter-pill--active' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Region Filters */}
        <div className="filter-group">
          <span className="filter-group__label">Region:</span>
          <div className="filter-pills">
            <button
              onClick={() => setSelectedRegion('')}
              className={`filter-pill ${!selectedRegion ? 'filter-pill--active' : ''}`}
            >
              All Maharashtra
            </button>
            {regions.map((reg) => (
              <button
                key={reg.slug}
                onClick={() =>
                  setSelectedRegion(selectedRegion === reg.slug ? '' : reg.slug)
                }
                className={`filter-pill ${selectedRegion === reg.slug ? 'filter-pill--active' : ''}`}
              >
                {reg.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <main className="container search-results">
        {/* Matching Districts Banner if query matches */}
        {filteredDistricts.length > 0 && (
          <div className="search-districts-banner">
            <span className="search-districts-label">Matching Districts:</span>
            <div className="search-districts-pills">
              {filteredDistricts.map((d) => (
                <Link key={d.slug} to={`/district/${d.slug}`} className="search-dist-link">
                  <MapPin size={13} />
                  <span>{d.name} District</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="search-count">
          Showing <strong>{filteredDestinations.length}</strong> {filteredDestinations.length === 1 ? 'place' : 'places'}
        </div>

        {filteredDestinations.length > 0 ? (
          <div className="search-grid">
            {filteredDestinations.map((dest) => {
              const destImage = getDestinationImage(dest.slug);

              return (
                <article key={dest._id} className="search-card">
                  {/* Real Photo Thumbnail */}
                  <div className="search-card__photo-wrap">
                    <SafeImage
                      src={destImage.url}
                      fallbackSrc={destImage.fallbackUrl}
                      alt={dest.name}
                      className="search-card__photo"
                    />
                    <div className="search-card__photo-overlay" />
                    <span className="search-card__district-badge">{dest.districtName}</span>
                  </div>

                  <div className="search-card__body">
                    <div className="search-card__top">
                      <span className="search-card__days">{dest.idealDays} Days</span>
                      <span className="search-card__rating">{dest.popularity}/100</span>
                    </div>

                    <h3 className="search-card__title">{dest.name}</h3>
                    <p className="search-card__tagline">&ldquo;{dest.tagline}&rdquo;</p>
                    <p className="search-card__desc">{dest.story.slice(0, 110)}...</p>

                    <div className="search-card__categories">
                      {dest.categories.slice(0, 3).map((c) => (
                        <span key={c} className="search-card__cat">
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="search-card__footer">
                      <Link to={`/destination/${dest.slug}`} className="search-card__link">
                        <span>Explore</span>
                        <ArrowRight size={14} />
                      </Link>
                      <Link to={`/plan/${dest.slug}`} className="search-card__plan-btn">
                        Plan Trip
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="search-empty">
            <h3>No destinations match your filters</h3>
            <p>Try resetting filters or searching with a different keyword.</p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('');
                setSelectedRegion('');
              }}
              className="btn btn--outline"
              style={{ marginTop: '1rem' }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
