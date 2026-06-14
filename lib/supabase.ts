import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || 'https://kjkrjsslaonxfvxzxjac.supabase.co';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || 'sb_publishable_IU2GQjW2kumQWWDJbkVceA_iXU18dKR';

if (typeof window !== 'undefined') {
	const usingFallback = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	// eslint-disable-next-line no-console
	console.log('Supabase client URL:', url, 'Using fallback values:', usingFallback);
	if (usingFallback) {
		// eslint-disable-next-line no-console
		console.warn('Supabase client: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in the environment. Using code defaults.');
	}
}

export const supabase = createClient(url, anon);
