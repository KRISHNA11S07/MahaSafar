import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-page__glow" />
      <div className="container not-found-card">
        <Compass size={48} className="text-earth not-found-icon" />
        <span className="not-found-kicker">404 &bull; Road Not Taken</span>
        <h1 className="not-found-title">Lost in the Sahyadris?</h1>
        <p className="not-found-desc">
          The trail you are looking for doesn't exist or has moved. Explore our documented destinations across Maharashtra or head back home.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn--primary">
            <span>Return to Home</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/search" className="btn btn--outline">
            Search Destinations
          </Link>
        </div>
      </div>
    </div>
  );
}
