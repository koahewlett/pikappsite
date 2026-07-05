export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || 'https://kjkrjsslaonxfvxzxjac.supabase.co';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || 'sb_publishable_IU2GQjW2kumQWWDJbkVceA_iXU18dKR';

export function warnIfSupabaseEnvMissing() {
  if (typeof window === 'undefined') return;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;

  // eslint-disable-next-line no-console
  console.warn('Supabase client: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Using defaults.');
}
