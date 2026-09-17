import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, ArrowRight } from 'lucide-react';
import './Auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('mahasafar_user', JSON.stringify({ email, name: email.split('@')[0] }));
      navigate('/profile');
    }
  };

  const handleDemoLogin = () => {
    localStorage.setItem(
      'mahasafar_user',
      JSON.stringify({ email: 'explorer@mahasafar.in', name: 'Maharashtra Explorer' })
    );
    navigate('/profile');
  };

  return (
    <div className="auth-page">
      <div className="auth-page__glow" />
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-tag">Welcome Back</span>
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">Access your saved itineraries, hidden gems, and travel history.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          <button type="submit" className="btn btn--primary auth-submit-btn">
            <LogIn size={16} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="auth-demo-btn"
          >
            Quick Guest / Demo Sign In &rarr;
          </button>
        </form>

        <div className="auth-footer">
          <span>Don&apos;t have an account?</span>
          <Link to="/register" className="auth-link">
            Create one <ArrowRight size={12} style={{ display: 'inline' }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
