// Stub Supabase client - no authentication required
// This file maintains API compatibility but doesn't require actual Supabase credentials

export const supabaseClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: new Error('Authentication disabled') }),
    signInWithOAuth: async () => ({ data: null, error: new Error('Authentication disabled') }),
    signUp: async () => ({ data: null, error: new Error('Authentication disabled') }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } }
    })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: new Error('Cloud storage disabled') })
      }),
      order: () => ({ data: [], error: null })
    }),
    insert: async () => ({ data: null, error: new Error('Cloud storage disabled') }),
    update: () => ({
      eq: async () => ({ data: null, error: new Error('Cloud storage disabled') })
    }),
    delete: () => ({
      eq: async () => ({ error: new Error('Cloud storage disabled') })
    })
  })
};