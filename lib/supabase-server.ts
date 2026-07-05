import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { supabaseAnonKey, supabaseUrl } from './supabase-config';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // Server components cannot always write cookies; middleware/routes can.
        }
      },
      remove(name, options) {
        try {
          cookieStore.set(name, '', options);
        } catch {
          // Server components cannot always write cookies; middleware/routes can.
        }
      },
    },
  });
}
