import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/ui/LoadingScreen';
import ChatPanel from './components/chat/ChatPanel';
import { ChatProvider } from './components/chat/ChatContext';
import { AuthProvider } from './lib/useAuthSync';
import { useAuthSync } from './lib/useAuthSync';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const DestinationPage = lazy(() => import('./pages/DestinationPage'));
const DistrictPage = lazy(() => import('./pages/DistrictPage'));
const TripPlannerPage = lazy(() => import('./pages/TripPlannerPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SafetyPage = lazy(() => import('./pages/SafetyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/**
 * Sends the visitor back to the top on every route change, and honours a
 * `#section` hash once the new page has painted (the account menu links
 * straight to sections of the profile page).
 */
function RouteScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // The target may not be mounted yet, so retry on the next frames.
      let attempts = 0;
      const scrollToHash = () => {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (attempts < 20) {
          attempts += 1;
          requestAnimationFrame(scrollToHash);
        }
      };
      scrollToHash();
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}

/**
 * GitHub Pages has no server-side routing, so a deep link such as
 * /MahaSafar/profile is served the 404 page, which bounces the visitor back
 * to the root and records where they were going. We restore that path once
 * the app has mounted.
 */
function DeepLinkRestorer() {
  const navigate = useNavigate();

  useEffect(() => {
    let target: string | null = null;
    try {
      target = sessionStorage.getItem('mahasafar:redirect');
      sessionStorage.removeItem('mahasafar:redirect');
    } catch {
      // storage blocked - the visitor just lands on the home page
    }
    if (!target) return;

    // The stored value is a path within the app (e.g. "/MahaSafar/profile").
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const path = target.startsWith(base) ? target.slice(base.length) || '/' : target;
    if (path && path !== '/') {
      navigate(path, { replace: true });
    }
  }, [navigate]);

  return null;
}

function AppInner() {
  useAuthSync();

  return (
    <div className="app">
      <Navbar />
      <main>
        <Suspense fallback={<LoadingScreen />}>
          <RouteScrollManager />
          <DeepLinkRestorer />
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/destination/:slug" element={<DestinationPage />} />
              <Route path="/district/:slug" element={<DistrictPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/explore/:destinationSlug" element={<ExplorePage />} />
              <Route path="/plan" element={<TripPlannerPage />} />
              <Route path="/plan/:destinationSlug" element={<TripPlannerPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/safety" element={<SafetyPage />} />
              <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      {/* Chat panel — anchored under navbar, shared state via ChatContext */}
      <ChatPanel />
    </div>
  );
}

function App() {
  return (
    <ChatProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ChatProvider>
  );
}

export default App;
