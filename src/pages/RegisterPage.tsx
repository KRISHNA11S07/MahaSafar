import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRight } from 'lucide-react';
import { useAuthSync } from '../lib/useAuthSync';
import './Auth.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signInLocally } = useAuthSync();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email && password) {
      signInLocally({ email, name: name || email.split('@')[0] });
      navigate('/profile');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__glow" />
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-tag">Welcome</span>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Save your routes, bookmark hidden spots and keep a list of places you want to see.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Your name</label>
            <input
              type="text"
              required
              placeholder="Siddhi Kulkarni"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Email</label>
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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          <button type="submit" className="btn btn--primary auth-submit-btn">
            <UserPlus size={16} />
            <span>Create account</span>
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-link">
            Sign in <ArrowRight size={12} style={{ display: 'inline' }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
