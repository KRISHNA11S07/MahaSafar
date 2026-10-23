import { useState } from 'react';
import { Check, Link2, MessageCircle, Printer, Share2 } from 'lucide-react';
import { buildShareUrl, type ShareableTripInput } from '../../lib/tripShare';
import './TripShareActions.css';

interface TripShareActionsProps { input: ShareableTripInput; destinationName: string; total: number; onPrint: () => void; }

function copyWithFallback(text: string): boolean {
  const field = document.createElement('input');
  field.value = text; field.setAttribute('readonly', ''); field.style.position = 'fixed'; field.style.opacity = '0';
  document.body.appendChild(field); field.select();
  const copied = document.execCommand('copy'); document.body.removeChild(field);
  return copied;
}

export default function TripShareActions({ input, destinationName, total, onPrint }: TripShareActionsProps) {
  const [status, setStatus] = useState('');
  const shareUrl = buildShareUrl(input);
  const message = `🧭 MahaSafar Trip Plan\n📍 ${destinationName} | ${input.days} days | ${input.people} people\n🚗 From ${input.origin.name} by ${input.travelMode} | 💰 approx ₹${total.toLocaleString('en-IN')}\nPlan bagha: ${shareUrl}`;
  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const announce = (messageText: string) => { setStatus(messageText); window.setTimeout(() => setStatus(''), 2000); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(shareUrl); announce('Copied'); }
    catch { announce(copyWithFallback(shareUrl) ? 'Copied' : 'Could not copy link'); }
  };
  const nativeShare = async () => {
    try { await navigator.share({ title: `${destinationName} trip plan`, text: message, url: shareUrl }); }
    catch { /* A cancelled share sheet is not an error worth announcing. */ }
  };
  return <div className="trip-share-actions" aria-label="Share this plan">
    <span className="trip-share-actions__label">Share this plan</span>
    <button type="button" onClick={copy} aria-label="Copy shareable trip link"><Link2 size={16} aria-hidden="true" />{status === 'Copied' ? <><Check size={16} aria-hidden="true" />Copied</> : 'Copy link'}</button>
    {hasNativeShare ? <button type="button" onClick={nativeShare} aria-label="Share trip plan"><Share2 size={16} aria-hidden="true" />Share</button> : <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" aria-label="Share trip plan on WhatsApp"><MessageCircle size={16} aria-hidden="true" />WhatsApp</a>}
    <button type="button" onClick={onPrint} aria-label="Print trip plan or save as PDF"><Printer size={16} aria-hidden="true" />Print / PDF</button>
    <span className="trip-share-actions__status" aria-live="polite">{status}</span>
  </div>;
}
