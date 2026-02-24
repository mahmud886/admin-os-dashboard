'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Check, Copy, Lock, Shield, Smartphone } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { user, updatePassword, enrollMFA, verifyMFAEnrollment, unenrollMFA, listFactors } = useAuth();
  
  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // 2FA State
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaError, setMfaError] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [activeFactorId, setActiveFactorId] = useState(null);

  useEffect(() => {
    checkMFAStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkMFAStatus = async () => {
    try {
      const result = await listFactors();
      if (result.success && result.data) {
        const verifiedFactor = result.data.totp.find(f => f.status === 'verified');
        if (verifiedFactor) {
          setMfaEnabled(true);
          setActiveFactorId(verifiedFactor.id);
        } else {
          setMfaEnabled(false);
          setActiveFactorId(null);
        }
      }
    } catch (error) {
      console.error('Error checking MFA status:', error);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      const result = await updatePassword(newPassword);
      if (result.success) {
        setPasswordSuccess('Password updated successfully');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(result.error || 'Failed to update password');
      }
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEnrollMFA = async () => {
    setMfaLoading(true);
    setMfaError('');
    try {
      const result = await enrollMFA();
      if (result.success) {
        setEnrollmentData(result.data);
        const url = await QRCode.toDataURL(result.data.totp.uri);
        setQrCodeUrl(url);
      } else {
        setMfaError(result.error || 'Failed to start MFA enrollment');
      }
    } catch (err) {
      setMfaError(err.message);
    } finally {
      setMfaLoading(false);
    }
  };

  const handleVerifyMFA = async () => {
    if (!enrollmentData || !verificationCode) return;
    
    setMfaLoading(true);
    setMfaError('');
    try {
      const result = await verifyMFAEnrollment(enrollmentData.id, verificationCode);
      if (result.success) {
        setMfaEnabled(true);
        setActiveFactorId(enrollmentData.id);
        setEnrollmentData(null);
        setVerificationCode('');
        setQrCodeUrl('');
      } else {
        setMfaError(result.error || 'Invalid verification code');
      }
    } catch (err) {
      setMfaError(err.message);
    } finally {
      setMfaLoading(false);
    }
  };

  const handleDisableMFA = async () => {
    if (!activeFactorId) return;
    
    if (!window.confirm('Are you sure you want to disable Two-Factor Authentication?')) {
      return;
    }

    setMfaLoading(true);
    try {
      const result = await unenrollMFA(activeFactorId);
      if (result.success) {
        setMfaEnabled(false);
        setActiveFactorId(null);
      } else {
        setMfaError(result.error || 'Failed to disable MFA');
      }
    } catch (err) {
      setMfaError(err.message);
    } finally {
      setMfaLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <MainLayout breadcrumb="SYSTEM CONSOLE / SETTINGS">
      <div className="space-y-8 max-w-4xl mx-auto pb-10">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your password and security preferences.</p>
        </div>

        {/* Change Password Section */}
        <div className="bg-[#111111] border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-teal-500/10 rounded-lg">
              <Lock className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Change Password</h2>
              <p className="text-sm text-gray-400">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-[#0a0a0a]"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#0a0a0a]"
                placeholder="Confirm new password"
              />
            </div>

            {passwordError && (
              <div className="text-red-400 text-sm bg-red-950/30 p-2 rounded border border-red-500/30">
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="text-green-400 text-sm bg-green-950/30 p-2 rounded border border-green-500/30">
                {passwordSuccess}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={passwordLoading || !newPassword || !confirmPassword}
              className="bg-teal-500 hover:bg-teal-600 text-black font-semibold"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="bg-[#111111] border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-teal-500/10 rounded-lg">
              <Shield className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Two-Factor Authentication (2FA)</h2>
              <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
            </div>
          </div>

          {mfaEnabled ? (
            <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-green-400">2FA is Enabled</h3>
                  <p className="text-sm text-gray-400">Your account is protected with two-factor authentication.</p>
                </div>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleDisableMFA}
                disabled={mfaLoading}
                className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
              >
                {mfaLoading ? 'Disabling...' : 'Disable 2FA'}
              </Button>
            </div>
          ) : enrollmentData ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Step 1: Scan QR */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-teal-400 mb-2">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-xs font-bold">1</span>
                    <h3 className="font-medium">Scan QR Code</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Use an authenticator app (like Google Authenticator or Authy) to scan this QR code.
                  </p>
                  
                  {qrCodeUrl && (
                    <div className="bg-white p-4 rounded-lg inline-block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                    </div>
                  )}

                  <div className="bg-[#0a0a0a] p-3 rounded border border-border mt-4">
                    <p className="text-xs text-gray-500 mb-1">Or enter code manually:</p>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-teal-400 font-mono text-sm">{enrollmentData.totp.secret}</code>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(enrollmentData.totp.secret)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Step 2: Verify */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-teal-400 mb-2">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-xs font-bold">2</span>
                    <h3 className="font-medium">Verify Code</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Enter the 6-digit code generated by your authenticator app to verify setup.
                  </p>

                  <div className="space-y-2 max-w-xs">
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <Input
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="bg-[#0a0a0a] text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  {mfaError && (
                    <div className="text-red-400 text-sm bg-red-950/30 p-2 rounded border border-red-500/30">
                      {mfaError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button 
                      onClick={handleVerifyMFA}
                      disabled={mfaLoading || verificationCode.length !== 6}
                      className="bg-teal-500 hover:bg-teal-600 text-black font-semibold flex-1"
                    >
                      {mfaLoading ? 'Verifying...' : 'Enable 2FA'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setEnrollmentData(null);
                        setQrCodeUrl('');
                        setVerificationCode('');
                      }}
                      className="border-border hover:bg-accent"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-[#0a0a0a] border border-border rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-500/10 rounded-full">
                    <Smartphone className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Protect your account</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to log in.
                    </p>
                    <Button 
                      onClick={handleEnrollMFA}
                      disabled={mfaLoading}
                      className="bg-teal-500 hover:bg-teal-600 text-black font-semibold"
                    >
                      {mfaLoading ? 'Starting Setup...' : 'Enable 2FA'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
