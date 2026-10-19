import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

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
