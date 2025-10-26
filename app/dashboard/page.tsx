'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingTrial from '@/components/OnboardingTrial';
import LinksTable from '@/components/LinksTable';
import DashboardStats from '@/components/DashboardStats';
import RecentLeads from '@/components/RecentLeads';
import { linkBuilderService } from '@/lib/services/LinkBuilderService';
import { AffiliateLink } from '@/lib/types/link';
import { profileService } from '@/lib/services/ProfileService';

function DashboardContent() {
  const { user, fetchProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [affiliateId, setAffiliateId] = useState<number | null>(null);

  // Links state
  const [recentLinks, setRecentLinks] = useState<AffiliateLink[]>([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile and affiliate profile on mount
  useEffect(() => {
    fetchProfile();
    loadAffiliateProfile();
  }, []);

  const loadAffiliateProfile = async () => {
    try {
      const profile = await profileService.getProfile();
      setAffiliateId(profile.id);
    } catch (error) {
      console.error('Failed to load affiliate profile:', error);
    }
  };

  // Fetch recent links on mount
  useEffect(() => {
    fetchRecentLinks();
  }, []);

  // Check for registration success parameter
  useEffect(() => {
    const registrationSuccess = searchParams.get('registration_success');
    if (registrationSuccess === 'true') {
      setShowOnboarding(true);
    }
  }, [searchParams]);

  const fetchRecentLinks = async () => {
    setIsLoadingLinks(true);
    try {
      const response = await linkBuilderService.getAllLinks(1);
      // Get last 5 links
      setRecentLinks(response.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch links:', err);
    } finally {
      setIsLoadingLinks(false);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      await linkBuilderService.createLink(
        referenceId ? { reference_id: referenceId } : {}
      );
      setReferenceId('');
      setShowCreateModal(false);

      // Refresh the links list
      await fetchRecentLinks();
    } catch (err: any) {
      setError(err.message || 'Failed to create link');
    } finally {
      setIsCreating(false);
    }
  };


  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Clean up URL
    router.replace('/dashboard');
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-zinc-900">
            {getGreeting()}, {user?.name || 'User'}!
          </h1>
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <span>Earn 40% on all paid customers.</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <DashboardStats affiliateId={affiliateId} />

      {/* Links Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900">Recent Links</h2>
          {!isLoadingLinks && recentLinks.length > 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Create link
            </button>
          )}
        </div>

        <LinksTable
          links={recentLinks}
          isLoading={isLoadingLinks}
          showViewAll={recentLinks.length === 5}
          onViewAll={() => router.push('/linkbuilder')}
          onCreateLink={() => setShowCreateModal(true)}
        />
      </div>

      {/* Recent Leads */}
      <RecentLeads affiliateId={affiliateId} />

      {/* Onboarding Trial */}
      {showOnboarding && <OnboardingTrial onComplete={handleOnboardingComplete} />}

      {/* Create Link Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-zinc-900">Create New Link</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setReferenceId('');
                    setError(null);
                  }}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateLink}>
                <div className="mb-4">
                  <label htmlFor="referenceId" className="block text-sm font-medium text-zinc-700 mb-2">
                    Custom Reference ID (Optional)
                  </label>
                  <input
                    type="text"
                    id="referenceId"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    placeholder="e.g., summer2025, promo-campaign"
                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    disabled={isCreating}
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    Leave empty to auto-generate a random reference ID
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setReferenceId('');
                      setError(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-6 py-2 text-sm font-medium bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? 'Creating...' : 'Create Link'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-600">Loading...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
