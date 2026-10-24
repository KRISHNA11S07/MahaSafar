import { Bookmark, ShieldCheck } from 'lucide-react';
import SafetyKit from '../components/safety/SafetyKit';
import { lastVerified } from '../data/safety';
import './SafetyPage.css';

export default function SafetyPage() {
  return (
    <div className="safety-page">
      <header className="safety-page__hero">
        <div className="container safety-page__hero-content">
          <span><ShieldCheck size={18} aria-hidden="true" /> MahaSafar travel support</span>
          <h1>Safety and Emergency Kit</h1>
          <p>Practical contacts, nearby-help links and thoughtful reminders for travelling around Maharashtra.</p>
        </div>
      </header>
      <main className="container safety-page__content">
        <div className="safety-page__offline"><Bookmark size={18} aria-hidden="true" /><div><strong>Save for offline</strong><p>Bookmark this page or take screenshots of the key numbers before you travel.</p></div></div>
        <SafetyKit />
        <p className="safety-page__verified">Helpline list last verified: {lastVerified}. Verify against official sources before release or travel.</p>
      </main>
    </div>
  );
}
