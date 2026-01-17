'use client';

import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [configError, setConfigError] = useState(null);
  const router = useRouter();

  // Initialize Supabase client with error handling
  const [supabase] = useState(() => {
    try {
      return createClient();
    } catch (error) {
      console.error('Supabase client initialization error:', error);
      setConfigError(error.message);
      return null;
    }
  });

  useEffect(() => {
    // Skip if Supabase client is not initialized
    if (!supabase || configError) {
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [supabase, configError]);

  const signIn = async (email, password) => {
    try {
      if (!supabase) {
        throw new Error(configError || 'Supabase client not initialized. Please check your environment variables.');
      }

      // Validate against static credentials before calling Supabase
      // Note: These env vars need NEXT_PUBLIC_ prefix to be accessible in client components
      const staticEmail = process.env.NEXT_PUBLIC_STATIC_ADMIN_EMAIL;
      const staticPassword = process.env.NEXT_PUBLIC_STATIC_ADMIN_PASSWORD;

      if (!staticEmail || !staticPassword) {
        throw new Error('Server configuration error. Please contact administrator.');
      }

      // Trim and normalize email for comparison
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedStaticEmail = staticEmail.trim().toLowerCase();

      // Validate credentials match static user before calling Supabase
      if (normalizedEmail !== normalizedStaticEmail || password !== staticPassword) {
        throw new Error('Invalid credentials. Access denied.');
      }

      // If credentials match, proceed with Supabase sign-in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: staticEmail, // Use the exact email from env for Supabase
        password: staticPassword, // Use the exact password from env for Supabase
      });

      if (error) {
        // Provide more helpful error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error(
            'Invalid login credentials. The user does not exist in Supabase Auth or the password is incorrect. ' +
              'Please create the user in your Supabase Dashboard: Authentication → Users → Add User'
          );
        }
        throw error;
      }

      setSession(data.session);
      setUser(data.user);
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'An error occurred during sign-in',
      };
    }
  };

  const signOut = async () => {
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    configError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
