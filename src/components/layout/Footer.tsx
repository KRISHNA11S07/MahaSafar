import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner container">
        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">MAHASAFAR</Link>
          <p className="footer__tagline">Discover Maharashtra, one journey at a time.</p>
        </div>

        {/* Link Columns */}
        <div className="footer__columns">
          <div className="footer__column">
            <h4 className="footer__column-title">Explore</h4>
            <Link to="/" className="footer__link">Districts</Link>
            <Link to="/search" className="footer__link">Destinations</Link>
            <Link to="/" className="footer__link">Categories</Link>
            <Link to="/" className="footer__link">Hidden Spots</Link>
          </div>
          <div className="footer__column">
            <h4 className="footer__column-title">Plan</h4>
            <Link to="/plan" className="footer__link">Trip Planner</Link>
            <Link to="/plan" className="footer__link">Cost Guide</Link>
            <Link to="/" className="footer__link">How It Works</Link>
          </div>
          <div className="footer__column">
            <h4 className="footer__column-title">About</h4>
            <a href="#" className="footer__link">About MahaSafar</a>
            <a href="#" className="footer__link">Data Sources</a>
            <a href="#" className="footer__link">Credits</a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <div className="footer__disclaimer">
            <p>A college mini-project. Data sourced from Maharashtra Tourism (Govt. of Maharashtra).</p>
            <p>All costs shown are estimates, not live prices.</p>
          </div>
          <p className="footer__copyright">© 2026 MahaSafar</p>
        </div>
      </div>
    </footer>
  );
}
