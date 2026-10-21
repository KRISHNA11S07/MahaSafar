import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import GoogleIcon from '../components/ui/GoogleIcon';
import { supabase, getOAuthRedirectUrl } from '../lib/supabase';
import { useAuth } from '../lib/useAuthSync';
import './Auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const navigate = useNavigate();
  const { oauthError, signInLocally } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // The email / guest sign-in has no server round-trip; we just record the
      // visitor locally under the same key Supabase uses so Profile works the
      // same way for both flows.
      signInLocally({ email, name: email.split('@')[0] });
      navigate('/profile');
    }
  };

  const handleDemoLogin = () => {
    signInLocally({ email: 'explorer@mahasafar.in', name: 'Maharashtra Explorer' });
    navigate('/profile');
  };

  const handleGoogle = async () => {
    setNotice('');
    if (!supabase) {
      setNotice("Google sign-in isn't switched on for this site yet. You can use email or the guest option for now.");
      return;
    }
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getOAuthRedirectUrl() },
    });
    if (error) {
      setGoogleLoading(false);
      setNotice("We couldn't reach Google just now. Please try again in a moment.");
    }
    // On success the browser is redirected to Google, so there's nothing more to do here.
  };

  return (
    <div className="auth-page">
      <div className="auth-page__glow" />
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-tag">Good to see you again</span>
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-subtitle">
            Pick up where you left off. Your saved trips and hidden spots are right where you left them.
          </p>
        </div>

        <button
          type="button"
          className="auth-google-btn"
          onClick={handleGoogle}
          disabled={googleLoading}
        >
          <GoogleIcon />
          <span>{googleLoading ? 'Opening Google…' : 'Continue with Google'}</span>
        </button>

        {notice && (
          <p className="auth-notice" role="status">
            {notice}
          </p>
        )}

        {oauthError && !notice && (
          <p className="auth-notice" role="alert">
            Google sign-in was cancelled, so you stayed signed out. You can try again below.
          </p>
        )}

        <div className="auth-divider" role="separator">
          <span>or use your email</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          <button type="submit" className="btn btn--primary auth-submit-btn">
            <LogIn size={16} />
            <span>Sign in</span>
          </button>

          <button type="button" onClick={handleDemoLogin} className="auth-demo-btn">
            Just looking around? Try it as a guest
          </button>
        </form>

        <div className="auth-footer">
          <span>New to MahaSafar?</span>
          <Link to="/register" className="auth-signup-btn">
            <UserPlus size={15} />
            <span>Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
