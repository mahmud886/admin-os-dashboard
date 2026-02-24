'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResetPasswordPage() {
  const { updatePassword, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // If not authenticated, it means the recovery link was invalid or expired
      // However, Supabase might take a moment to process the hash fragment
      // We'll give it a slight delay or just show a message
    }
  }, [loading, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await updatePassword(password);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setError(result.error || 'Failed to update password. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-400/10 rounded-full border-t-teal-400 animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#111111] border border-border rounded-lg p-8 shadow-lg text-center">
          <h2 className="mb-4 text-xl font-semibold text-red-400">Invalid or Expired Link</h2>
          <p className="mb-6 text-gray-400 text-sm">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link href="/forgot-password">
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-black font-semibold">
              REQUEST NEW LINK
            </Button>
          </Link>
        </div>
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
          <h1 className="mb-2 text-3xl font-bold text-teal-400">SPORE FALL ADMIN</h1>
          <p className="text-sm text-gray-400">Set New Password</p>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-border rounded-lg p-8 shadow-lg">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-white">Password Updated!</h2>
              <p className="text-gray-400 text-sm">
                Your password has been successfully updated. Redirecting to dashboard...
              </p>
              <div className="pt-4">
                <Link href="/dashboard">
                  <Button className="w-full bg-teal-500 hover:bg-teal-600 text-black font-semibold">
                    GO TO DASHBOARD
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h2 className="mb-6 text-xl font-semibold text-center text-gray-200">RESET PASSWORD</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-gray-300">
                    <Lock className="w-4 h-4" />
                    NEW PASSWORD
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-[#0a0a0a] border-border text-gray-300 focus:border-teal-500/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-gray-300">
                    <Lock className="w-4 h-4" />
                    CONFIRM PASSWORD
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-[#0a0a0a] border-border text-gray-300 focus:border-teal-500/50"
                  />
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-400 bg-red-950/30 border border-red-500/50 rounded-md">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-600 text-black font-semibold transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
