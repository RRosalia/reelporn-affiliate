'use client';

import { useState, useEffect } from 'react';
import TwoFactorService from '@/lib/services/TwoFactorService';
import PasswordService from '@/lib/services/PasswordService';
import axiosInstance from '@/lib/axios';

export default function SecurityPage() {
  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Email change state
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailChangePassword, setEmailChangePassword] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');

  // Profile state
  const [hasPassword, setHasPassword] = useState(true);

  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [twoFAMessage, setTwoFAMessage] = useState('');

  // Disable 2FA state
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disableCode, setDisableCode] = useState('');
  const [isDisabling, setIsDisabling] = useState(false);

  // View recovery codes state
  const [showViewCodesModal, setShowViewCodesModal] = useState(false);
  const [viewCodesOTP, setViewCodesOTP] = useState('');
  const [isLoadingCodes, setIsLoadingCodes] = useState(false);

  // Regenerate recovery codes state
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [regenerateOTP, setRegenerateOTP] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await axiosInstance.get('/account/profile');
      const user = response.data.data.user || response.data.data;
      const twoFactorEnabled = response.data.data.two_factor_enabled || false;
      const hasPasswordSet = response.data.data.has_password !== false;
      setIs2FAEnabled(twoFactorEnabled);
      setHasPassword(hasPasswordSet);
      setCurrentEmail(user.email || '');
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingEmail(true);
    setEmailMessage('');

    try {
      await axiosInstance.post('/account/email/change', {
        email: newEmail,
        password: emailChangePassword,
      });

      setEmailMessage('A confirmation email has been sent to your new email address. Please check your inbox and click the confirmation link.');
      setNewEmail('');
      setEmailChangePassword('');
    } catch (error: any) {
      setEmailMessage(error.response?.data?.message || 'Failed to request email change. Please try again.');
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const payload = hasPassword
        ? { current_password: currentPassword, password: newPassword, password_confirmation: confirmPassword }
        : { password: newPassword, password_confirmation: confirmPassword };

      await PasswordService.updatePassword(payload);

      const successMessage = hasPassword ? 'Password changed successfully!' : 'Password set successfully!';
      setMessage(successMessage);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Update hasPassword state after setting password
      if (!hasPassword) {
        setHasPassword(true);
      }

      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.message || 'Failed to change password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    setTwoFAMessage('');

    try {
      const response = await TwoFactorService.enableTwoFactor();
      setQrCode(response.data.svg);
      setSecret(response.data.secret);
      setShow2FASetup(true);
    } catch (error: any) {
      setTwoFAMessage(error.message || 'Failed to initialize 2FA setup. Please try again.');
    } finally {
      setIsEnabling2FA(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTwoFAMessage('');

    try {
      await TwoFactorService.confirmTwoFactor(verificationCode);

      setIs2FAEnabled(true);
      setShow2FASetup(false);
      setVerificationCode('');
      setRecoveryCodes([]); // Clear any codes from setup
      setTwoFAMessage('Two-factor authentication enabled successfully!');
      setTimeout(() => setTwoFAMessage(''), 3000);
    } catch (error: any) {
      setTwoFAMessage(error.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const openDisableModal = () => {
    setShowDisableModal(true);
    setDisableCode('');
    setTwoFAMessage('');
  };

  const closeDisableModal = () => {
    setShowDisableModal(false);
    setDisableCode('');
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabling(true);
    setTwoFAMessage('');

    try {
      await TwoFactorService.disableTwoFactor(disableCode);
      setIs2FAEnabled(false);
      setShowDisableModal(false);
      setDisableCode('');
      setTwoFAMessage('Two-factor authentication disabled.');
      setTimeout(() => setTwoFAMessage(''), 3000);
    } catch (error: any) {
      setTwoFAMessage(error.message || 'Failed to disable 2FA. Please try again.');
    } finally {
      setIsDisabling(false);
    }
  };

  const downloadRecoveryCodes = () => {
    const text = recoveryCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recovery-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyRecoveryCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    setTwoFAMessage('Recovery codes copied to clipboard!');
    setTimeout(() => setTwoFAMessage(''), 3000);
  };

  const openViewCodesModal = () => {
    setShowViewCodesModal(true);
    setViewCodesOTP('');
    setTwoFAMessage('');
  };

  const closeViewCodesModal = () => {
    setShowViewCodesModal(false);
    setViewCodesOTP('');
  };

  const handleLoadRecoveryCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingCodes(true);
    setTwoFAMessage('');

    try {
      const codes = await TwoFactorService.getRecoveryCodes(viewCodesOTP);
      console.log('Recovery codes manually loaded:', codes);
      setRecoveryCodes(codes);
      setShowViewCodesModal(false);
      setViewCodesOTP('');
      setTwoFAMessage('Recovery codes loaded successfully!');
      setTimeout(() => setTwoFAMessage(''), 3000);
    } catch (error: any) {
      console.error('Error loading recovery codes:', error);
      setTwoFAMessage(error.message || 'Failed to load recovery codes.');
    } finally {
      setIsLoadingCodes(false);
    }
  };

  const openRegenerateModal = () => {
    setShowRegenerateModal(true);
    setRegenerateOTP('');
    setTwoFAMessage('');
  };

  const closeRegenerateModal = () => {
    setShowRegenerateModal(false);
    setRegenerateOTP('');
  };

  const handleRegenerateRecoveryCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegenerating(true);
    setTwoFAMessage('');

    try {
      const codes = await TwoFactorService.regenerateRecoveryCodes(regenerateOTP);
      console.log('Recovery codes regenerated:', codes);
      setRecoveryCodes(codes);
      setShowRegenerateModal(false);
      setRegenerateOTP('');
      setTwoFAMessage('Recovery codes regenerated successfully! Your old codes no longer work.');
      setTimeout(() => setTwoFAMessage(''), 5000);
    } catch (error: any) {
      console.error('Error regenerating recovery codes:', error);
      setTwoFAMessage(error.message || 'Failed to regenerate recovery codes.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Email */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">Login Email</h2>
        <p className="text-sm text-zinc-600 mb-6">
          Update your login email address
        </p>

        {emailMessage && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            emailMessage.includes('confirmation')
              ? 'bg-blue-50 text-blue-800 border border-blue-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {emailMessage}
          </div>
        )}

        <form onSubmit={handleChangeEmail} className="space-y-4">
          <div>
            <label htmlFor="currentEmail" className="block text-sm font-medium text-zinc-700 mb-2">
              Current Email
            </label>
            <input
              type="email"
              id="currentEmail"
              value={currentEmail}
              disabled
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-zinc-50 text-zinc-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="newEmail" className="block text-sm font-medium text-zinc-700 mb-2">
              New Email
            </label>
            <input
              type="email"
              id="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email address"
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="emailChangePassword" className="block text-sm font-medium text-zinc-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="emailChangePassword"
              value={emailChangePassword}
              onChange={(e) => setEmailChangePassword(e.target.value)}
              placeholder="Enter your password to confirm"
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
            <p className="mt-2 text-xs text-zinc-500">
              For security, you must enter your password to change your email
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingEmail || !newEmail || !emailChangePassword}
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
            >
              {isChangingEmail ? 'Sending...' : 'Change Email'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <button
          type="button"
          onClick={() => setShowPasswordChange(!showPasswordChange)}
          className="w-full flex items-center justify-between"
        >
          <div className="text-left">
            <h2 className="text-lg font-semibold text-zinc-900">
              {hasPassword ? 'Change Password' : 'Set Password'}
            </h2>
            <p className="text-sm text-zinc-600 mt-1">
              {hasPassword
                ? 'Update your password to keep your account secure'
                : 'Set a password to secure your account'}
            </p>
          </div>
          <svg
            className={`w-5 h-5 text-zinc-400 transition-transform ${showPasswordChange ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showPasswordChange && (
          <>
            {!hasPassword && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">No password set</span><br />
                  You can set a password now to add an extra layer of security to your account.
                </p>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 mt-6">
          {hasPassword && (
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-zinc-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-700 mb-2">
              {hasPassword ? 'New Password' : 'Password'}
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 mb-2">
              {hasPassword ? 'Confirm New Password' : 'Confirm Password'}
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('success')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSaving || (hasPassword && !currentPassword) || !newPassword || !confirmPassword}
                  className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : hasPassword ? 'Update Password' : 'Set Password'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Two-Factor Authentication</h2>
            <p className="text-sm text-zinc-600 mt-1">
              Add an extra layer of security to your account
            </p>
          </div>
          {isLoadingProfile ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-zinc-100 text-zinc-700 border border-zinc-300">
              Loading...
            </span>
          ) : is2FAEnabled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Enabled
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-zinc-100 text-zinc-700 border border-zinc-300">
              Disabled
            </span>
          )}
        </div>

        {twoFAMessage && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            twoFAMessage.includes('success') || twoFAMessage.includes('enabled')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {twoFAMessage}
          </div>
        )}

        {isLoadingProfile ? (
          <div className="text-center py-8 text-zinc-500">Loading 2FA status...</div>
        ) : !is2FAEnabled && !show2FASetup ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-medium">What is 2FA?</span><br />
                Two-factor authentication adds an extra layer of security by requiring a code from your phone
                in addition to your password when logging in.
              </p>
            </div>

            <button
              onClick={handleEnable2FA}
              disabled={isEnabling2FA}
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
            >
              {isEnabling2FA ? 'Setting up...' : 'Enable 2FA'}
            </button>
          </div>
        ) : show2FASetup ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium mb-3">
                Step 1: Scan the QR code with your authenticator app
              </p>
              <div className="bg-white p-4 rounded-lg inline-block" dangerouslySetInnerHTML={{ __html: qrCode }} />
              <p className="text-xs text-blue-700 mt-3">
                Can't scan? Enter this code manually: <code className="font-mono bg-white px-2 py-1 rounded">{secret}</code>
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium mb-3">
                Step 2: Enter the 6-digit code from your authenticator app
              </p>
              <form onSubmit={handleVerify2FA} className="space-y-3">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShow2FASetup(false)}
                    className="px-4 py-2 border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify and Enable'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : is2FAEnabled ? (
          <div className="space-y-4">
            {recoveryCodes && recoveryCodes.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800 font-medium mb-3">
                  Recovery Codes
                </p>
                <p className="text-xs text-amber-700 mb-3">
                  Save these recovery codes in a safe place. You can use them to access your account if you lose your authenticator device.
                </p>
                <div className="bg-white p-3 rounded-lg mb-3">
                  <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                    {recoveryCodes.map((code, index) => (
                      <div key={index} className="text-zinc-700">{code}</div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={downloadRecoveryCodes}
                    className="px-3 py-1.5 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={copyRecoveryCodes}
                    className="px-3 py-1.5 text-sm border border-amber-300 text-amber-800 hover:bg-amber-100 rounded-lg transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={openRegenerateModal}
                    className="px-3 py-1.5 text-sm border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Rotate Codes
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {(!recoveryCodes || recoveryCodes.length === 0) && (
                <button
                  type="button"
                  onClick={openViewCodesModal}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Show Recovery Codes
                </button>
              )}
              <button
                onClick={openDisableModal}
                className="px-6 py-2 border border-red-300 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors"
              >
                Disable 2FA
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Disable 2FA Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-zinc-900 mb-2">Disable Two-Factor Authentication</h2>
            <p className="text-zinc-600 mb-4">
              Enter the 6-digit code from your authenticator app to disable 2FA.
            </p>

            <form onSubmit={handleDisable2FA}>
              <input
                type="text"
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                pattern="[0-9]{6}"
                required
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-4"
              />

              {twoFAMessage && twoFAMessage.includes('invalid') && (
                <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-800 border border-red-200">
                  {twoFAMessage}
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeDisableModal}
                  className="px-4 py-2 border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDisabling}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
                >
                  {isDisabling ? 'Disabling...' : 'Disable 2FA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Recovery Codes Modal */}
      {showViewCodesModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-zinc-900 mb-2">View Recovery Codes</h2>
            <p className="text-zinc-600 mb-4">
              Enter the 6-digit code from your authenticator app to view your recovery codes.
            </p>

            <form onSubmit={handleLoadRecoveryCodes}>
              <input
                type="text"
                value={viewCodesOTP}
                onChange={(e) => setViewCodesOTP(e.target.value)}
                placeholder="000000"
                maxLength={6}
                pattern="[0-9]{6}"
                required
                autoFocus
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-4"
              />

              {twoFAMessage && (twoFAMessage.includes('Failed') || twoFAMessage.includes('Invalid') || twoFAMessage.includes('invalid')) && showViewCodesModal && (
                <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-800 border border-red-200">
                  {twoFAMessage}
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeViewCodesModal}
                  className="px-4 py-2 border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoadingCodes}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
                >
                  {isLoadingCodes ? 'Loading...' : 'View Codes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Regenerate Recovery Codes Modal */}
      {showRegenerateModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-zinc-900 mb-2">Rotate Recovery Codes</h2>
            <p className="text-zinc-600 mb-4">
              Enter the 6-digit code from your authenticator app to generate new recovery codes. <strong>Your old codes will no longer work.</strong>
            </p>

            <form onSubmit={handleRegenerateRecoveryCodes}>
              <input
                type="text"
                value={regenerateOTP}
                onChange={(e) => setRegenerateOTP(e.target.value)}
                placeholder="000000"
                maxLength={6}
                pattern="[0-9]{6}"
                required
                autoFocus
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-4"
              />

              {twoFAMessage && (twoFAMessage.includes('Failed') || twoFAMessage.includes('Invalid') || twoFAMessage.includes('invalid')) && showRegenerateModal && (
                <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-800 border border-red-200">
                  {twoFAMessage}
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeRegenerateModal}
                  className="px-4 py-2 border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegenerating}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
                >
                  {isRegenerating ? 'Rotating...' : 'Rotate Codes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
