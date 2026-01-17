'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Lock, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, isAuthenticated, loading: authLoading, configError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    }
  }, [isAuthenticated, authLoading, router, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn(email.trim(), password);

      if (result.success) {
        const redirect = searchParams.get('redirect') || '/dashboard';
        router.push(redirect);
      } else {
        setError(result.error || 'Invalid credentials. Access denied.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-400 rounded-full border-t-transparent animate-spin"></div>
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
              src="/assets/images/sporefall.jpeg"
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
          <h2 className="mb-6 text-2xl font-semibold text-center text-gray-200">AUTHENTICATION REQUIRED</h2>

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
              <Label htmlFor="password" className="flex items-center gap-2 text-gray-300">
                <Lock className="w-4 h-4" />
                PASSWORD
              </Label>
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

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-950/30 border border-red-500/50 rounded-md">{error}</div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full text-base font-semibold h-11" disabled={isLoading || !!configError}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-teal-400 rounded-full border-t-transparent animate-spin"></div>
                  AUTHENTICATING...
                </>
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
