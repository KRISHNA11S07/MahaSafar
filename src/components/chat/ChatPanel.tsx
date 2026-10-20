import { useEffect, useRef, useState, useCallback } from 'react';
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Trash2, X, Send } from 'lucide-react';
import { useChatContext } from './ChatContext';
import { getChatReply } from '../../lib/chatService';
import type { ChatMessage } from '../../lib/chatService';
import './ChatPanel.css';

const STORAGE_KEY = 'mahasafar_chat_v1';

const SUGGESTIONS = [
  'Plan a 3-day trip from Pune',
  'Best hill stations near Mumbai',
  'Hidden spots in Konkan',
  'Best time to visit Lonavala',
] as const;

const GREETING: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  content:
    'Namaste! 🙏 I\'m the MahaSafar travel assistant. Ask me about Maharashtra destinations, itineraries, budgets, hidden spots, or the best time to visit.',
  createdAt: Date.now(),
};

function loadMessages(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed as ChatMessage[];
  } catch {
    // ignore
  }
  return [];
}

function saveMessages(msgs: ChatMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  } catch {
    // ignore
  }
}

let msgCounter = 0;
function newId() {
  msgCounter += 1;
  return `msg-${Date.now()}-${msgCounter}`;
}

export default function ChatPanel() {
  const { isOpen, closeChat } = useChatContext();

  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages());
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);
  // Track in-flight request generation to ignore stale responses
  const requestGen = useRef(0);

  // Persist messages
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // Escape closes
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeChat();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeChat]);

  // Auto-scroll to bottom after every message/loading change
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? draft).trim();
      if (!content || isLoading) return;

      const userMsg: ChatMessage = {
        id: newId(),
        role: 'user',
        content,
        createdAt: Date.now(),
      };

      // (b) functional append — never races with concurrent setState calls
      setMessages((prev) => [...prev, userMsg]);
      // (c) clear input
      setDraft('');
      // (d) show loading
      setIsLoading(true);

      // Track this request generation
      const gen = ++requestGen.current;

      try {
        // (e) await reply — messages passed include the new user message
        const reply = await getChatReply([...messages, userMsg]);

        // Ignore stale responses if a newer request started
        if (gen !== requestGen.current) return;

        const assistantMsg: ChatMessage = {
          id: newId(),
          role: 'assistant',
          content: reply,
          createdAt: Date.now(),
        };

        // (f) functional append
        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        if (gen !== requestGen.current) return;
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: 'assistant',
            content: 'The assistant is taking a break, please try again in a moment.',
            createdAt: Date.now(),
          },
        ]);
      } finally {
        // (g) clear loading even on error
        if (gen === requestGen.current) {
          setIsLoading(false);
        }
      }
    },
    [draft, isLoading, messages],
  );

  function handleKeyDown(e: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  function handleClear() {
    setMessages([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  if (!isOpen) return null;

  const visibleMessages = messages.length === 0 ? [GREETING] : messages;
  const showGreetingOnly = messages.length === 0;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="chat-panel-backdrop"
        onClick={closeChat}
        aria-hidden="true"
      />

      <section
        className="chat-panel"
        role="dialog"
        aria-modal="true"
        aria-label="MahaSafar Assistant"
      >
        {/* Header */}
        <header className="chat-panel__header">
          <div className="chat-panel__header-left">
            <p className="chat-panel__eyebrow">Travel planning</p>
            <h2 className="chat-panel__title">MahaSafar Assistant</h2>
          </div>
          <div className="chat-panel__header-actions">
            <button
              type="button"
              className="chat-panel__icon-btn"
              onClick={handleClear}
              aria-label="Clear chat"
              title="Clear chat"
              disabled={messages.length === 0 || isLoading}
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="chat-panel__icon-btn"
              onClick={closeChat}
              aria-label="Close chat"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Message list */}
        <div
          className="chat-panel__messages"
          aria-live="polite"
          aria-label="Chat messages"
          aria-relevant="additions"
        >
          {showGreetingOnly && (
            <>
              <div className="chat-panel__message chat-panel__message--assistant">
                {GREETING.content}
              </div>
              <div className="chat-panel__welcome">
                <div className="chat-panel__chips" aria-label="Suggested questions">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="chat-panel__chip"
                      onClick={() => void sendMessage(s)}
                      disabled={isLoading}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {!showGreetingOnly &&
            visibleMessages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-panel__message chat-panel__message--${msg.role}`}
              >
                {msg.content}
              </div>
            ))}

          {isLoading && (
            <div
              className="chat-panel__typing"
              aria-label="Assistant is typing"
              role="status"
            >
              <span />
              <span />
              <span />
            </div>
          )}

          {/* Sentinel for auto-scroll */}
          <div ref={listEndRef} />
        </div>

        {/* Input form */}
        <form
          className="chat-panel__form"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            void sendMessage();
          }}
        >
          <textarea
            ref={inputRef}
            className="chat-panel__textarea"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Maharashtra…"
            aria-label="Your message"
            rows={2}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn--primary chat-panel__send"
            disabled={!draft.trim() || isLoading}
            aria-label="Send message"
          >
            <Send size={16} aria-hidden="true" />
            <span>Send</span>
          </button>
        </form>
      </section>
    </>
  );
}

