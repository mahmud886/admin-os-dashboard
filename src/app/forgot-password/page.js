'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // First check if the email exists in our system
      const checkResponse = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const checkData = await checkResponse.json();

      if (!checkResponse.ok) {
        throw new Error(checkData.error || 'Failed to verify email');
      }

      if (!checkData.exists) {
        setError('No account found with this email address.');
        setIsLoading(false);
        return;
      }

      // If exists, proceed with reset
      const result = await resetPasswordForEmail(email.trim());

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to send reset email. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <p className="text-sm text-gray-400">Password Recovery</p>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-border rounded-lg p-8 shadow-lg">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-white">Check your email</h2>
              <p className="text-gray-400 text-sm">
                We've sent a password reset link to <span className="text-teal-400">{email}</span>. Please check your
                inbox and spam folder.
              </p>
              <div className="pt-4">
                <Link href="/login">
                  <Button className="w-full bg-teal-500 hover:bg-teal-600 text-black font-semibold">
                    RETURN TO LOGIN
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h2 className="mb-2 text-xl font-semibold text-center text-gray-200">FORGOT PASSWORD</h2>
              <p className="mb-6 text-sm text-center text-gray-400">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4" />
                    EMAIL ADDRESS
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@sporefall.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                  {isLoading ? 'SENDING LINK...' : 'SEND RESET LINK'}
                </Button>

                <div className="text-center pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" />
                    Back to Login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
