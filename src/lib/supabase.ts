import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * OAuth return detection.
 *
 * These MUST be read before `createClient()` runs. Supabase exchanges the
 * `code` query parameter for a session and then strips it from the URL
 * (see `_getSessionFromURL` in @supabase/auth-js) *before* it emits the
 * SIGNED_IN event. Checking `window.location.search` inside the auth
 * callback therefore always returns false — which is why the original
 * "did we come back from Google?" check never fired.
 *
 * Reading them here (module scope) captures the URL as it was on arrival.
 */

function parseOAuthParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

/**
 * True when the page was loaded as a return trip from an OAuth provider.
 */
export const isOAuthCallback = (() => {
  if (typeof window === 'undefined') return false;
  const params = parseOAuthParams();
  if (params.has('code') || params.has('error_code')) return true;
  // Any OAuth error parameter also means we came back from the provider.
  if (params.has('error') || params.has('error_description')) return true;
  // Implicit flow returns the tokens in the URL fragment.
  return window.location.hash.includes('access_token');
})();

/**
 * True when the OAuth provider sent the visitor back with an error — most
 * often because they cancelled the consent screen.
 */
export const isOAuthError = (() => {
  if (typeof window === 'undefined') return false;
  const params = parseOAuthParams();
  const error = params.get('error');
  return Boolean(error) || params.has('error_code') || params.has('error_description');
})();

/** True once the Supabase project keys have been added to the environment. */
export const isGoogleAuthConfigured = Boolean(url && anonKey);

export const supabase = isGoogleAuthConfigured ? createClient(url!, anonKey!) : null;

/**
 * Where Google sends people back to. We land on the site root rather than
 * /profile because GitHub Pages can't serve deep links directly - the app
 * routes to /profile itself once the session is picked up.
 */
export function getOAuthRedirectUrl() {
  return `${window.location.origin}${import.meta.env.BASE_URL}`;
}

/**
 * Removes the OAuth query parameters from the address bar once the session
 * has been picked up, so a later refresh does not look like a fresh OAuth
 * return. Supabase already removes `code`; this clears the rest (and the
 * fragment used by the implicit flow).
 */
export function clearOAuthParamsFromUrl() {
  if (typeof window === 'undefined') return;
  const { pathname, search, hash } = window.location;

  const params = new URLSearchParams(search);
  const hadParams = ['code', 'error', 'error_code', 'error_description', 'error_uri'].some(
    (key) => params.has(key)
  );
  const hadHash = hash.includes('access_token');

  if (!hadParams && !hadHash) return;

  ['code', 'error', 'error_code', 'error_description', 'error_uri'].forEach((key) =>
    params.delete(key)
  );

  const query = params.toString();
  window.history.replaceState(
    {},
    '',
    pathname + (query ? `?${query}` : '') + (hadHash ? '' : hash)
  );
}
