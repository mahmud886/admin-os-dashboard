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
  const [needsMFA, setNeedsMFA] = useState(false);
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
        checkMFA(session);
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
      checkMFA(session);
      setLoading(false);
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [supabase, configError]);

  const checkMFA = async (session) => {
    if (!session) {
      setNeedsMFA(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (!error && data) {
        // If user has AAL2 enabled (nextLevel='aal2') but is currently at AAL1 (currentLevel='aal1')
        if (data.nextLevel === 'aal2' && data.currentLevel === 'aal1') {
          setNeedsMFA(true);
        } else {
          setNeedsMFA(false);
        }
      }
    } catch (error) {
      console.error('Error checking MFA level:', error);
    }
  };

  const signIn = async (email, password) => {
    try {
      if (!supabase) {
        throw new Error(configError || 'Supabase client not initialized. Please check your environment variables.');
      }

      // Proceed with Supabase sign-in directly
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Check if MFA is enabled for this user
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;

      const totpFactor = factors.totp.find((factor) => factor.status === 'verified');

      if (totpFactor) {
        return {
          success: true,
          mfaRequired: true,
          factorId: totpFactor.id,
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  };

  const verifyLoginMFA = async (factorId, code) => {
    try {
      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code,
      });

      if (verify.error) throw verify.error;

      return { success: true };
    } catch (error) {
      console.error('MFA verification error:', error);
      return { success: false, error: error.message };
    }
  };

  const resetPasswordForEmail = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Update password error:', error);
      return { success: false, error: error.message };
    }
  };

  const enrollMFA = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('MFA enrollment error:', error);
      return { success: false, error: error.message };
    }
  };

  const verifyMFAEnrollment = async (factorId, code) => {
    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('MFA verification error:', error);
      return { success: false, error: error.message };
    }
  };

  const unenrollMFA = async (factorId) => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('MFA unenroll error:', error);
      return { success: false, error: error.message };
    }
  };

  const listFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('List factors error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    session,
    isAuthenticated: !!user,
    configError,
    needsMFA,
    signIn,
    signOut,
    verifyLoginMFA,
    resetPasswordForEmail,
    updatePassword,
    enrollMFA,
    verifyMFAEnrollment,
    unenrollMFA,
    listFactors,
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
