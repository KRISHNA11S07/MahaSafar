import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

/**
 * Mirrors a Supabase (Google) session into the same localStorage key the rest
 * of the app already reads, so Profile etc. work for both email and Google users.
 */
export function useAuthSync() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) return;

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const meta = session.user.user_metadata ?? {};
        const email = session.user.email ?? '';
        const name = (meta.full_name as string) || (meta.name as string) || email.split('@')[0];
        localStorage.setItem(
          'mahasafar_user',
          JSON.stringify({ email, name, avatar: meta.avatar_url ?? null, provider: 'google' })
        );
        // Only jump to the profile when the person just came back from Google.
        if (window.location.search.includes('code=') || window.location.hash.includes('access_token')) {
          navigate('/profile', { replace: true });
        }
      }
    });

    return () => data.subscription.unsubscribe();
  }, [navigate]);
}
