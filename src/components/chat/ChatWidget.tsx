import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Trash2, X } from 'lucide-react';
import { isGoogleAuthConfigured, supabase } from '../../lib/supabase';
import './ChatWidget.css';

type ChatRole = 'user' | 'assistant';

type ChatMessage = {
  role: ChatRole;
  content: string;
};

const suggestions = [
  'Plan a 3-day trip from Pune',
  'Best hill stations near Mumbai',
  'Hidden spots in Konkan',
  'What should I pack for a monsoon trip?',
];

const unavailableMessage = 'The assistant is taking a break, please try again in a moment.';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  async function sendMessage(event?: FormEvent, suggestedText?: string) {
    event?.preventDefault();
    const content = (suggestedText ?? draft).trim();
    if (!content || isLoading) return;

    const nextMessages = [...messages, { role: 'user' as const, content }];
    setMessages(nextMessages);
    setDraft('');
    setIsLoading(true);

    if (!isGoogleAuthConfigured || !supabase) {
      setMessages((current) => [...current, { role: 'assistant', content: unavailableMessage }]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke<{ reply?: string }>('chat', {
        body: { messages: nextMessages },
      });
      const reply = !error && typeof data?.reply === 'string' ? data.reply.trim() : '';
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: reply || unavailableMessage },
      ]);
    } catch {
      setMessages((current) => [...current, { role: 'assistant', content: unavailableMessage }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <div className="chat-widget">
      {isOpen && (
        <section className="chat-widget__panel" role="dialog" aria-modal="false" aria-label="MahaSafar Assistant">
          <header className="chat-widget__header">
            <div>
              <p className="chat-widget__eyebrow">Travel planning</p>
              <h2>MahaSafar Assistant</h2>
            </div>
            <div className="chat-widget__actions">
              <button className="chat-widget__icon-button" type="button" onClick={() => setMessages([])} aria-label="Clear chat" title="Clear chat" disabled={!messages.length || isLoading}>
                <Trash2 size={17} aria-hidden="true" />
              </button>
              <button className="chat-widget__icon-button" type="button" onClick={() => setIsOpen(false)} aria-label="Close chat">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="chat-widget__messages" aria-live="polite" aria-label="Chat messages">
            {messages.length === 0 && (
              <div className="chat-widget__welcome">
                <p>Ask for a Maharashtra itinerary, destination ideas, or practical travel tips.</p>
                <div className="chat-widget__suggestions" aria-label="Suggested questions">
                  {suggestions.map((suggestion) => (
                    <button key={suggestion} type="button" onClick={() => void sendMessage(undefined, suggestion)} disabled={isLoading}>
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chat-widget__message chat-widget__message--${message.role}`}>
                {message.content}
              </div>
            ))}
            {isLoading && <div className="chat-widget__typing" aria-label="Assistant is typing"><span /><span /><span /></div>}
            <div ref={listEndRef} />
          </div>

          <form className="chat-widget__form" onSubmit={(event) => void sendMessage(event)}>
            <textarea ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about Maharashtra..." aria-label="Your message" rows={2} disabled={isLoading} />
            <button className="btn btn--primary chat-widget__send" type="submit" disabled={!draft.trim() || isLoading} aria-label="Send message">
              <Send size={17} aria-hidden="true" />
              <span>Send</span>
            </button>
          </form>
        </section>
      )}
      <button className="btn btn--primary chat-widget__trigger" type="button" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? 'Close Chat with AI' : 'Open Chat with AI'} aria-expanded={isOpen}>
        <MessageCircle size={19} aria-hidden="true" />
        <span>Chat with AI</span>
      </button>
    </div>
  );
}
