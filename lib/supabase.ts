import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kjkrjsslaonxfvxzxjac.supabase.co';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_IU2GQjW2kumQWWDJbkVceA_iXU18dKR';

if (typeof window !== 'undefined') {
	// Warn in the browser console if env vars look like defaults.
	if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
		// eslint-disable-next-line no-console
		console.warn('Supabase client: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Using defaults.');
	}
}

export const supabase = createClient(url, anon);
