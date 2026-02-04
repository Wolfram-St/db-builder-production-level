import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are provided
const hasCredentials = supabaseUrl && supabaseAnonKey;

// Create real Supabase client if credentials are available, otherwise use stub
export const supabaseClient = hasCredentials
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : // Stub client for development without Supabase
    {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({
          data: { user: null, session: null },
          error: new Error('Supabase credentials not configured'),
        }),
        signInWithOAuth: async () => ({
          data: { provider: null, url: null },
          error: new Error('Supabase credentials not configured'),
        }),
        signUp: async () => ({
          data: { user: null, session: null },
          error: new Error('Supabase credentials not configured'),
        }),
        signOut: async () => ({ error: null }),
        resetPasswordForEmail: async () => ({
          data: null,
          error: new Error('Supabase credentials not configured'),
        }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: null,
              error: new Error('Cloud storage disabled'),
            }),
          }),
          order: () => ({ data: [], error: null }),
        }),
        insert: async () => ({
          data: null,
          error: new Error('Cloud storage disabled'),
        }),
        update: () => ({
          eq: async () => ({
            data: null,
            error: new Error('Cloud storage disabled'),
          }),
        }),
        delete: () => ({
          eq: async () => ({ error: new Error('Cloud storage disabled') }),
        }),
      }),
    } as any;

// Export a flag to check if Supabase is configured
export const isSupabaseConfigured = hasCredentials;