'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getEcho } from '@/lib/echo-config';
import { leadService } from '@/lib/services/LeadService';
import { Lead } from '@/lib/types/lead';
import { getCountryFlag } from '@/lib/utils/countryFlags';
import { formatCurrency } from '@/lib/utils/currency';

interface RecentLeadsProps {
  affiliateId: number | null;
}

export default function RecentLeads({ affiliateId }: RecentLeadsProps) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newLeadAnimation, setNewLeadAnimation] = useState(false);

  // Fetch initial leads on mount
  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const response = await leadService.getAll({
        per_page: 15,
        page: 1,
        sort_by: 'created_at',
        sort_order: 'desc',
      });
      setLeads(response.data);
    } catch (error) {
      console.error('Failed to load recent leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to Echo channel for real-time updates
  useEffect(() => {
    if (!affiliateId) {
      return;
    }

    const echo = getEcho();
    if (!echo) {
      console.warn('[RecentLeads] Echo not initialized');
      return;
    }

    const channelName = `affiliates.${affiliateId}.dashboard-stats`;
    console.log(`[RecentLeads] Subscribing to private channel: ${channelName}`);

    const channel = echo.private(channelName);

    // Listen for click converted to lead events
    channel.listen('.click.converted', (data: any) => {
      console.log('[RecentLeads] New lead detected:', data);

      // Trigger animation
      setNewLeadAnimation(true);
      setTimeout(() => setNewLeadAnimation(false), 600);

      // Refetch leads to get the latest
      loadLeads();
    });

    // Cleanup: leave channel when component unmounts or affiliate changes
    return () => {
      console.log(`[RecentLeads] Leaving channel: ${channelName}`);
      echo.leave(channelName);
    };
  }, [affiliateId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeColor = (status: string) => {
    const statusColors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      banned: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900">Recent Leads</h2>
        </div>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <p className="mt-4 text-zinc-500">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-zinc-900">Recent Leads</h2>
        {leads.length > 0 && (
          <button
            onClick={() => router.push('/traffic/leads')}
            className="text-green-500 hover:text-green-600 text-sm font-medium"
          >
            View all →
          </button>
        )}
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <p className="font-semibold text-zinc-900 mb-1">No leads yet</p>
          <p className="text-sm text-zinc-500">Leads will appear here when visitors click your affiliate links</p>
        </div>
      ) : (
        <div className={`overflow-x-auto transition-all duration-300 ${newLeadAnimation ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">Status</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-700">Commission</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">Country</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr
                  key={lead.id}
                  className={`border-b border-zinc-100 hover:bg-zinc-50 transition-colors ${
                    index === 0 && newLeadAnimation ? 'bg-green-50' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className="text-sm text-zinc-900">#{lead.id}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-zinc-900">{lead.email}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getStatusBadgeColor(lead.status)}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-medium text-zinc-900">${formatCurrency(lead.total_commission_earned)}</span>
                  </td>
                  <td className="py-3 px-4">
                    {lead.country ? (
                      <span className="text-base" title={lead.country}>
                        {getCountryFlag(lead.country)}
                      </span>
                    ) : (
                      <span className="text-sm text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-zinc-500">{formatDate(lead.signed_up_at)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
