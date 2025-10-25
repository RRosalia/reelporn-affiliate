'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-6">Account Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={user?.username || ''}
              disabled
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-zinc-50 text-zinc-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-zinc-50 text-zinc-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Affiliate ID
            </label>
            <input
              type="text"
              value={user?.id || ''}
              disabled
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-zinc-50 text-zinc-600 cursor-not-allowed"
            />
            <p className="mt-2 text-xs text-zinc-500">
              Your unique affiliate identifier
            </p>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-6">Account Status</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-zinc-100">
            <div>
              <p className="font-medium text-zinc-900">Account Status</p>
              <p className="text-sm text-zinc-500">Your account is currently active</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Active
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-zinc-100">
            <div>
              <p className="font-medium text-zinc-900">Commission Rate</p>
              <p className="text-sm text-zinc-500">Your current commission percentage</p>
            </div>
            <span className="text-2xl font-bold text-pink-600">40%</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-zinc-900">Cookie Duration</p>
              <p className="text-sm text-zinc-500">How long referrals are tracked</p>
            </div>
            <span className="text-lg font-semibold text-zinc-900">60 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
