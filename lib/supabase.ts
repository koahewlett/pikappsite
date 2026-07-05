import { createBrowserClient } from '@supabase/ssr';
import { supabaseAnonKey, supabaseUrl, warnIfSupabaseEnvMissing } from './supabase-config';

warnIfSupabaseEnvMissing();

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
