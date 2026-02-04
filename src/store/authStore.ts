import { create } from 'zustand';
import { supabaseClient } from '../lib/supabaseClient';
import { User, AuthError, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  signInWithOAuth: (provider: 'github' | 'google') => Promise<{ success: boolean; error?: string }>;
  initialize: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true });
      
      // Check for existing session
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      
      if (error) throw error;
      
      if (session) {
        set({
          user: session.user,
          session,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }

      // Listen for auth changes
      supabaseClient.auth.onAuthStateChange((_event, session) => {
        set({
          user: session?.user || null,
          session,
          isAuthenticated: !!session,
        });
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({
        user: data.user,
        session: data.session,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = (error as AuthError).message || 'Failed to sign in';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      // If email confirmation is required, user won't be automatically signed in
      if (data.user && data.session) {
        set({
          user: data.user,
          session: data.session,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }

      return { success: true };
    } catch (error) {
      const errorMessage = (error as AuthError).message || 'Failed to sign up';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      
      await supabaseClient.auth.signOut();
      
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = (error as AuthError).message || 'Failed to sign out';
      set({ error: errorMessage, isLoading: false });
      console.error('Sign out error:', error);
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = (error as AuthError).message || 'Failed to send reset email';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  signInWithOAuth: async (provider: 'github' | 'google') => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/workstation`,
        },
      });

      if (error) throw error;

      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = (error as AuthError).message || `Failed to sign in with ${provider}`;
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
