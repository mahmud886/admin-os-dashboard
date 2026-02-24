'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Smartphone, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    signIn,
    verifyLoginMFA,
    isAuthenticated,
    loading: authLoading,
    configError,
    needsMFA,
    listFactors,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // MFA State
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState(null);
  const [mfaCode, setMfaCode] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && !needsMFA && !mfaRequired) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    }
  }, [isAuthenticated, authLoading, router, searchParams, needsMFA, mfaRequired]);

  // Handle MFA requirement from session check (e.g. on refresh)
  useEffect(() => {
    if (needsMFA && !mfaFactorId) {
      setMfaRequired(true);
      // Fetch factors to get ID
      listFactors().then((result) => {
        if (result.success && result.data.totp.length > 0) {
          const verifiedFactor = result.data.totp.find((f) => f.status === 'verified');
          if (verifiedFactor) {
            setMfaFactorId(verifiedFactor.id);
          }
        }
      });
    }
  }, [needsMFA, mfaFactorId, listFactors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mfaRequired) {
        // Handle MFA Verification
        const result = await verifyLoginMFA(mfaFactorId, mfaCode);
        if (result.success) {
          const redirect = searchParams.get('redirect') || '/dashboard';
          router.push(redirect);
        } else {
          setError(result.error || 'Invalid verification code');
        }
      } else {
        // Handle Normal Login
        const result = await signIn(email.trim(), password);

        if (result.success) {
          if (result.mfaRequired) {
            setMfaRequired(true);
            setMfaFactorId(result.factorId);
            setIsLoading(false);
            return;
          }
          const redirect = searchParams.get('redirect') || '/dashboard';
          router.push(redirect);
        } else {
          setError(result.error || 'Invalid credentials. Access denied.');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      if (!mfaRequired) setIsLoading(false);
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-400/10 rounded-full border-t-teal-400 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="mb-8 text-center">
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4 rounded-lg bg-[#0a0a0a] border border-teal-400/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-transparent to-transparent"></div>
            <Image
              src="/assets/favicon_io/android-chrome-192x192.png"
              alt="Spore Fall Logo"
              fill
              sizes="(max-width: 768px) 80px, 80px"
              className="object-contain rounded mix-blend-lighten"
              priority
            />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-teal-400">SPORE FALL ADMIN CONSOLE</h1>
          <p className="text-sm text-gray-400">Admin Console Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#111111] border border-border rounded-lg p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold text-center text-gray-200">
            {mfaRequired ? 'TWO-FACTOR AUTHENTICATION' : 'AUTHENTICATION REQUIRED'}
          </h2>

          {/* Configuration Error */}
          {configError && (
            <div className="mb-6 p-4 text-sm text-red-400 bg-red-950/30 border border-red-500/50 rounded-md">
              <div className="font-semibold mb-2">Configuration Error:</div>
              <div>{configError}</div>
              <div className="mt-3 text-xs text-red-300">
                Please check your <code className="bg-black/30 px-1 py-0.5 rounded">.env.local</code> file and ensure
                all required environment variables are set.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mfaRequired ? (
              <div className="space-y-4">
                <p className="text-sm text-center text-gray-400 mb-4">
                  Please enter the 6-digit code from your authenticator app.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="mfaCode" className="flex items-center gap-2 text-gray-300">
                    <Smartphone className="w-4 h-4" />
                    VERIFICATION CODE
                  </Label>
                  <Input
                    id="mfaCode"
                    type="text"
                    placeholder="000000"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="bg-[#0a0a0a] border-border text-gray-200 placeholder:text-gray-500 text-center text-lg tracking-widest"
                    required
                    maxLength={6}
                    autoFocus
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Email/Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-gray-300">
                    <User className="w-4 h-4" />
                    USERNAME / EMAIL
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your username or email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#0a0a0a] border-border text-gray-200 placeholder:text-gray-500"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="flex items-center gap-2 text-gray-300">
                      <Lock className="w-4 h-4" />
                      PASSWORD
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#0a0a0a] border-border text-gray-200 placeholder:text-gray-500"
                    required
                  />
                </div>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-950/30 border border-red-500/50 rounded-md">{error}</div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full text-base font-semibold h-11" disabled={isLoading || !!configError}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-teal-400 rounded-full border-t-transparent animate-spin"></div>
                  {mfaRequired ? 'VERIFYING...' : 'AUTHENTICATING...'}
                </>
              ) : mfaRequired ? (
                'VERIFY IDENTITY'
              ) : (
                'SECURE LOGIN'
              )}
            </Button>
          </form>

          {/* Additional Info */}
          <div className="pt-6 mt-6 border-t border-border">
            <p className="text-xs text-center text-gray-500">
              Protected system console. Unauthorized access is prohibited.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">© 2026 SPORE FALL. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-teal-400 rounded-full border-t-transparent animate-spin"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
