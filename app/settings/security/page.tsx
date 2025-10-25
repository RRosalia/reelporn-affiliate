'use client';

import { useState } from 'react';

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      setIsSaving(false);
      return;
    }

    try {
      // TODO: Implement API call to change password
      // await changePassword(currentPassword, newPassword);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to change password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">Change Password</h2>
        <p className="text-sm text-zinc-600 mb-6">
          Update your password to keep your account secure
        </p>

        <form onSubmit={handleChangePassword} className="space-y-4">
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

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
            <p className="mt-2 text-xs text-zinc-500">
              Password must be at least 8 characters long
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 mb-2">
              Confirm New Password
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
              disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">Two-Factor Authentication</h2>
        <p className="text-sm text-zinc-600 mb-6">
          Add an extra layer of security to your account
        </p>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium text-zinc-900">Status</p>
            <p className="text-sm text-zinc-500">Two-factor authentication is currently disabled</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-zinc-100 text-zinc-600">
            Disabled
          </span>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-200">
          <button
            type="button"
            className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg transition-colors"
          >
            Enable 2FA
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">Active Sessions</h2>
        <p className="text-sm text-zinc-600 mb-6">
          Manage your active sessions across different devices
        </p>

        <div className="space-y-4">
          <div className="flex items-start justify-between py-3 border-b border-zinc-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Current Session</p>
                <p className="text-sm text-zinc-500">macOS - Chrome</p>
                <p className="text-xs text-zinc-400 mt-1">Last active: Just now</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              Active
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-200">
          <button
            type="button"
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Sign out all other sessions
          </button>
        </div>
      </div>
    </div>
  );
}
