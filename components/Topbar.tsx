'use client';

import { useState, useEffect } from 'react';
import { profileService } from '@/lib/services/ProfileService';

export default function Topbar() {
  const [companyName, setCompanyName] = useState('');
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

  useEffect(() => {
    // Load company name from profile
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await profileService.getProfile();
      if (profile.company_name) {
        setCompanyName(profile.company_name);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleHelp = () => {
    if (supportEmail) {
      window.location.href = `mailto:${supportEmail}`;
    }
  };

  return (
    <div className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6">
      {/* Company Name */}
      <div className="flex items-center">
        {companyName && (
          <h1 className="text-lg font-semibold text-zinc-900">{companyName}</h1>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Help Button - Only show if support email is configured */}
        {supportEmail && (
          <button
            onClick={handleHelp}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Help</span>
          </button>
        )}
      </div>
    </div>
  );
}
