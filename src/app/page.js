'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    }, 1000);
  };

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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-[#0a0a0a] text-teal-400 focus:ring-teal-400 focus:ring-offset-0 focus:ring-2"
                />
                <span className="text-gray-400">Remember me</span>
              </label>
              <button type="button" className="text-teal-400 transition-colors hover:text-teal-300 hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full text-base font-semibold h-11" disabled={isLoading}>
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
