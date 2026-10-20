import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, MapPin, MessageCircle } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { useChatContext } from '../chat/ChatContext';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { isOpen: isChatOpen, toggleChat } = useChatContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const isHomePage = location.pathname === '/';

  function handleChatClick() {
    setIsMobileOpen(false);
    toggleChat();
  }

  return (
    <header
      className={`navbar ${isScrolled ? 'navbar--scrolled' : ''} ${isHomePage ? 'navbar--transparent' : 'navbar--solid'}`}
      role="banner"
    >
      <nav className="navbar__inner" aria-label="Main navigation">
        {/* Logo */}
        <Link to="/" className="navbar__logo" aria-label="MahaSafar Home">
          MAHASAFAR
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar__links">
          <Link to="/explore" className="navbar__link">
            <MapPin size={14} />
            <span>Explore</span>
          </Link>
          <Link to="/search" className="navbar__link">
            <Search size={14} />
            <span>Discover</span>
          </Link>
          <Link to="/plan" className="navbar__link">
            Plan Trip
          </Link>
          {/* Chat with AI — visually distinct from Login */}
          <button
            type="button"
            className={`navbar__link navbar__link--chat ${isChatOpen ? 'navbar__link--chat-active' : ''}`}
            onClick={handleChatClick}
            aria-expanded={isChatOpen}
            aria-label={isChatOpen ? 'Close Chat with AI' : 'Open Chat with AI'}
          >
            <MessageCircle size={14} aria-hidden="true" />
            <span>Chat with AI</span>
          </button>
          <Link to="/login" className="navbar__link navbar__link--cta">
            <User size={14} />
            <span>Login</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile actions: chat icon + theme toggle */}
        <div className="navbar__mobile-actions">
          <button
            type="button"
            className="navbar__chat-mobile"
            onClick={handleChatClick}
            aria-expanded={isChatOpen}
            aria-label={isChatOpen ? 'Close Chat with AI' : 'Open Chat with AI'}
          >
            <MessageCircle size={18} aria-hidden="true" />
          </button>
          <ThemeToggle />
        </div>

        {/* Mobile Toggle */}
        <button
          className="navbar__toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-expanded={isMobileOpen}
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div className={`navbar__mobile ${isMobileOpen ? 'navbar__mobile--open' : ''}`} role="dialog" aria-label="Mobile navigation">
        <div className="navbar__mobile-inner">
          <Link to="/explore" className="navbar__mobile-link">Explore Maharashtra</Link>
          <Link to="/search" className="navbar__mobile-link">Discover</Link>
          <Link to="/plan" className="navbar__mobile-link">Plan Trip</Link>
          <button
            type="button"
            className="navbar__mobile-link navbar__mobile-link--chat"
            onClick={handleChatClick}
          >
            Chat with AI
          </button>
          <div className="navbar__mobile-divider" />
          <Link to="/login" className="navbar__mobile-link">Login</Link>
          <Link to="/register" className="navbar__mobile-link">Sign up</Link>
        </div>
      </div>
    </header>
  );
}
