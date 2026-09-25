import { createClient } from '@supabase/supabase-js';

// Resolve Supabase project URL and public Anon key safely
const rawSupabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  'https://ewddcvvpehdlisdovfia.supabase.co';

// Clean off any /rest/v1 suffix that might be present in the env secret
export const SUPABASE_URL = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '');

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
  'sb_publishable_g9A6z8HGIixWENjmjUu7QQ_2Ld8PUqB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
