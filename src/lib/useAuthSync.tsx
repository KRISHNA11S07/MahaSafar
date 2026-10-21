import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { supabase, isOAuthCallback, isOAuthError, clearOAuthParamsFromUrl } from './supabase';

/**
 * The shape we keep in `localStorage` so the rest of the app (Profile etc.)
 * works for both email and Google users. This mirrors the Supabase session
 * rather than replacing it — Supabase remains the source of truth.
 */
export interface StoredUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  provider: string;
  /**
   * Where this record came from. `supabase` records are backed by a real
   * server session; `local` records are the browser-only sign-ins the
   * email / guest forms create. The two are cleared separately.
   */
  source?: 'supabase' | 'local';
  /** Extra profile fields edited by the visitor. */
  phone?: string;
  city?: string;
}

export const AUTH_STORAGE_KEY = 'mahasafar_user';

export interface AuthContextValue {
  /** The live Supabase user, or null when signed out. */
  user: User | null;
  /** True while we are restoring the session on first paint. */
  isLoading: boolean;
  /** The synced user mirrored into localStorage. */
  storedUser: StoredUser | null;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  /**
   * Starts a browser-only session (the email / guest sign-in forms). There is
   * no server round-trip, so this only records the visitor locally.
   */
  signInLocally: (profile: { email: string; name: string; avatar?: string | null }) => void;
  /**
   * Saves edits to a browser-only session. Supabase sessions are updated
   * through `supabase.auth.updateUser` instead.
   */
  updateLocalProfile: (fields: { fullName: string; phone: string; city: string }) => void;
  /** True when the OAuth provider sent the visitor back with an error. */
  oauthError: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

/** Pull the best available name out of the OAuth metadata. */
function readDisplayName(user: User): string {
  const meta = user.user_metadata ?? {};
  const name =
    (meta.full_name as string) ||
    (meta.name as string) ||
    (meta['nickname'] as string) ||
    '';
  if (name.trim()) return name.trim();
  return user.email?.split('@')[0] ?? 'Explorer';
}

/** Pull the avatar out of the OAuth metadata (Google puts it in picture). */
function readAvatar(user: User): string | null {
  const meta = user.user_metadata ?? {};
  const avatar = (meta.avatar_url as string) || (meta.picture as string) || '';
  return avatar.trim() ? avatar : null;
}

/** Mirror the session into the localStorage key the rest of the app reads. */
function persistUser(user: User): StoredUser {
  return {
    id: user.id,
    email: user.email ?? '',
    name: readDisplayName(user),
    avatar: readAvatar(user),
    provider: user.app_metadata?.provider ?? 'email',
    source: 'supabase',
  };
}

/**
 * Read the mirrored user back out of localStorage. Used to restore a
 * browser-only session on a page refresh.
 */
function readPersistedUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || typeof parsed.email !== 'string') return null;
    return {
      id: parsed.id ?? '',
      email: parsed.email,
      name: parsed.name || parsed.email.split('@')[0],
      avatar: parsed.avatar ?? null,
      provider: parsed.provider ?? 'email',
      source: parsed.source ?? 'local',
      phone: parsed.phone ?? '',
      city: parsed.city ?? '',
    };
  } catch {
    return null;
  }
}

function writePersistedUser(stored: StoredUser) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // storage can be blocked (private mode)
  }
}

function clearPersistedUser() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Owns a single Supabase auth listener for the whole app. It:
 *   1. Restores the session on startup (from Supabase storage or via getSession).
 *   2. Mirrors it into localStorage.
 *   3. Updates React state on every auth event.
 *   4. Jumps to /profile on a successful OAuth return trip.
 *   5. Flags (but does not navigate on) an OAuth error such as a cancelled
 *      consent, so the Login page can surface it.
 */
function useAuthState() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [storedUser, setStoredUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [oauthError, setOauthError] = useState(false);

  // ---- Session restore on first paint ----
  useEffect(() => {
    if (!supabase) {
      // No Supabase project configured: fall back to a browser-only session
      // if one was left behind by the email / guest forms.
      const local = readPersistedUser();
      setStoredUser(local);
      setIsLoading(false);
      return;
    }

    let active = true;

    // Restore an existing session on startup (e.g. after a page refresh).
    // Supabase emits INITIAL_SESSION for this, but reading the session
    // directly means the Navbar is correct on the very first paint.
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) {
        setStoredUser(persistUser(sessionUser));
        setOauthError(false);
      } else {
        // No server session. Keep a browser-only session if one exists so a
        // refresh does not sign the email / guest visitor out.
        const local = readPersistedUser();
        if (local) {
          setStoredUser(local);
        } else {
          clearPersistedUser();
          setStoredUser(null);
        }
      }
      setIsLoading(false);
    });

    // Single listener handles restored sessions AND OAuth returns AND sign-out.
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);
        if (sessionUser) {
          setStoredUser(persistUser(sessionUser));
          setOauthError(false);
        }
        // The OAuth return trip navigates to /profile inside its own effect
        // below, which runs because isOAuthCallback is true at mount time.
        clearOAuthParamsFromUrl();
        return;
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setStoredUser(null);
        clearPersistedUser();
        setOauthError(false);
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  // ---- OAuth return handling (runs once, on mount) ----
  useEffect(() => {
    if (!supabase) return;

    if (isOAuthError) {
      // The visitor cancelled consent (or the provider errored). Nothing was
      // signed in. The provider sends them back to the site root, so we send
      // them to the Login page where the reason can be explained, and the
      // Navbar keeps showing Login.
      setOauthError(true);
      clearOAuthParamsFromUrl();
      navigate('/login', { replace: true });
      return;
    }

    if (!isOAuthCallback) return;

    // On the OAuth success trip, redirect to /profile immediately.
    navigate('/profile', { replace: true });
    clearOAuthParamsFromUrl();
    // No need to subscribe: the restore above already wired SIGNED_IN to
    // persistUser, and Supabase will also fire it again if the visitor
    // refreshes /profile (its own INITIAL_SESSION branch keeps the user set).
  }, [navigate]);

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    clearPersistedUser();
    setUser(null);
    setStoredUser(null);
    setOauthError(false);
  }, []);

  /**
   * The email / guest forms have no server to talk to, so they create a
   * browser-only session. It is stored in the same key the Supabase mirror
   * uses, and is cleared by sign-out like any other session.
   */
  const signInLocally = useCallback(
    (profile: { email: string; name: string; avatar?: string | null }) => {
      const stored: StoredUser = {
        id: profile.email,
        email: profile.email,
        name: profile.name || profile.email.split('@')[0],
        avatar: profile.avatar ?? null,
        provider: 'email',
        source: 'local',
        phone: '',
        city: '',
      };
      writePersistedUser(stored);
      setUser(null);
      setStoredUser(stored);
      setOauthError(false);
    },
    []
  );

  /** Saves profile edits for a browser-only session. */
  const updateLocalProfile = useCallback(
    (fields: { fullName: string; phone: string; city: string }) => {
      setStoredUser((current) => {
        if (!current || current.source === 'supabase') return current;
        return {
          ...current,
          name: fields.fullName.trim() || current.name,
          phone: fields.phone,
          city: fields.city,
        };
      });
    },
    []
  );

  // ---- Mirror the current session into localStorage ----
  // One place writes the mirror, so the two session kinds can never drift.
  // A null session is left alone here: sign-out clears the key explicitly, and
  // the restore path must not wipe a browser-only session on startup.
  useEffect(() => {
    if (!storedUser) return;
    writePersistedUser(storedUser);
  }, [storedUser]);

  return useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      storedUser,
      // A browser-only session counts as signed in too, otherwise the Navbar
      // would keep offering "Login" to someone who already signed in.
      isAuthenticated: Boolean(user) || Boolean(storedUser),
      signOut,
      signInLocally,
      updateLocalProfile,
      oauthError,
    }),
    [user, isLoading, storedUser, signOut, signInLocally, updateLocalProfile, oauthError]
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthState();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Kept for the existing call site in App.tsx. The session handling itself
 * now lives in <AuthProvider>, so this simply exposes the resulting auth
 * state to any component that needs it without subscribing again.
 */
export function useAuthSync(): AuthContextValue {
  return useAuth();
}
