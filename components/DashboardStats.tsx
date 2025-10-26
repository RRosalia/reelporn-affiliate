'use client';

import { useEffect, useState } from 'react';
import { getEcho } from '@/lib/echo-config';
import { dashboardService } from '@/lib/services/DashboardService';

export interface DashboardStatsData {
  total_earnings: number;
  total_clicks: number;
  total_leads: number;
  total_customers: number;
}

interface DashboardStatsProps {
  affiliateId: number | null;
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export default function DashboardStats({ affiliateId }: DashboardStatsProps) {
  const [stats, setStats] = useState<DashboardStatsData>({
    total_earnings: 0,
    total_clicks: 0,
    total_leads: 0,
    total_customers: 0,
  });
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [clickAnimation, setClickAnimation] = useState(false);
  const [leadAnimation, setLeadAnimation] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch initial stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoadingStats(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Subscribe to Echo channel for real-time updates
  useEffect(() => {
    if (!affiliateId) {
      setConnectionStatus('disconnected');
      return;
    }

    const echo = getEcho();
    if (!echo) {
      console.warn('[DashboardStats] Echo not initialized');
      setConnectionStatus('disconnected');
      return;
    }

    // Set to connecting when we start
    setConnectionStatus('connecting');

    const channelName = `affiliates.${affiliateId}.dashboard-stats`;
    console.log(`[DashboardStats] Subscribing to private channel: ${channelName}`);

    const channel = echo.private(channelName);

    // Listen for individual click events
    channel.listen('.click.tracked', (data: any) => {
      console.log('[DashboardStats] Click tracked:', data);
      setStats((prevStats) => ({
        ...prevStats,
        total_clicks: prevStats.total_clicks + 1,
      }));

      // Trigger animation
      setClickAnimation(true);
      setTimeout(() => setClickAnimation(false), 600);
    });

    // Listen for click converted to lead events
    channel.listen('.click.converted', (data: any) => {
      console.log('[DashboardStats] Click converted to lead:', data);
      setStats((prevStats) => ({
        ...prevStats,
        total_leads: prevStats.total_leads + 1,
      }));

      // Trigger animation
      setLeadAnimation(true);
      setTimeout(() => setLeadAnimation(false), 600);
    });

    // Handle subscription success
    channel.subscription.bind('pusher:subscription_succeeded', () => {
      console.log(`[DashboardStats] Successfully subscribed to ${channelName}`);
      setConnectionStatus('connected');
    });

    // Handle subscription error
    channel.subscription.bind('pusher:subscription_error', (error: any) => {
      console.error(`[DashboardStats] Subscription error for ${channelName}:`, error);
      setConnectionStatus('disconnected');
    });

    // Monitor connection state
    const connector = (echo as any).connector;
    if (connector?.pusher) {
      connector.pusher.connection.bind('connecting', () => {
        console.log('[DashboardStats] WebSocket connecting');
        setConnectionStatus('connecting');
      });

      connector.pusher.connection.bind('connected', () => {
        console.log('[DashboardStats] WebSocket connected');
        // Don't set to connected here, wait for subscription success
      });

      connector.pusher.connection.bind('disconnected', () => {
        console.log('[DashboardStats] WebSocket disconnected');
        setConnectionStatus('disconnected');
      });

      connector.pusher.connection.bind('unavailable', () => {
        console.log('[DashboardStats] WebSocket unavailable');
        setConnectionStatus('disconnected');
      });

      connector.pusher.connection.bind('failed', () => {
        console.log('[DashboardStats] WebSocket connection failed');
        setConnectionStatus('disconnected');
      });
    }

    // Cleanup: leave channel when component unmounts or affiliate changes
    return () => {
      console.log(`[DashboardStats] Leaving channel: ${channelName}`);
      echo.leave(channelName);
      setConnectionStatus('disconnected');
    };
  }, [affiliateId]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-zinc-900">
          You and reelporn.ai's Affiliate Program
        </h2>

        {/* Live Indicator */}
        <div className="relative group">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
              connectionStatus === 'connected'
                ? 'bg-green-100 text-green-700'
                : connectionStatus === 'connecting'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-zinc-100 text-zinc-600'
            }`}
            data-testid="live-indicator"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-green-500 animate-pulse'
                  : connectionStatus === 'connecting'
                  ? 'bg-blue-500 animate-pulse'
                  : 'bg-zinc-400'
              }`}
            ></span>
            <span className="text-xs font-medium">
              {connectionStatus === 'connected'
                ? 'Live'
                : connectionStatus === 'connecting'
                ? 'Connecting...'
                : 'Offline'}
            </span>
          </div>

          {/* Tooltip */}
          <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-zinc-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <div className="absolute -top-1 right-4 w-2 h-2 bg-zinc-900 transform rotate-45"></div>
            {connectionStatus === 'connected' ? (
              <>
                <p className="font-medium mb-1">Real-time monitoring active</p>
                <p className="text-zinc-300">
                  Your statistics are being updated in real-time as clicks, leads, and conversions
                  happen. No need to refresh!
                </p>
              </>
            ) : connectionStatus === 'connecting' ? (
              <>
                <p className="font-medium mb-1">Establishing connection...</p>
                <p className="text-zinc-300">
                  Connecting to real-time updates. This usually takes just a moment.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium mb-1">Real-time updates unavailable</p>
                <p className="text-zinc-300">
                  Don't worry - your traffic is still being tracked. The information shown may be
                  delayed. Refresh the page to see the latest stats.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Earnings */}
        <div>
          <div className="text-sm text-zinc-600 mb-2">Total earnings</div>
          <div className="text-3xl font-bold text-zinc-900" data-testid="total-earnings">
            {isLoadingStats ? (
              <span className="text-zinc-400">...</span>
            ) : (
              `$${(stats.total_earnings / 100).toFixed(2)}`
            )}
          </div>
        </div>

        {/* Total Clicks */}
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-zinc-600 mb-2">
            <span>Total clicks</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          </div>
          <div
            className={`text-3xl font-bold transition-all duration-300 ${
              clickAnimation ? 'text-green-600 scale-110' : 'text-zinc-900 scale-100'
            }`}
            data-testid="total-clicks"
          >
            {isLoadingStats ? (
              <span className="text-zinc-400">...</span>
            ) : (
              stats.total_clicks.toLocaleString()
            )}
          </div>
          <div className="text-xs text-zinc-500 mt-1">All clicks from your links</div>

          {/* Pulse effect overlay */}
          {clickAnimation && (
            <div className="absolute inset-0 -z-10" data-testid="click-animation">
              <div className="absolute top-1/2 left-0 w-full h-12 -translate-y-1/2 bg-green-100 rounded-lg animate-ping opacity-75"></div>
            </div>
          )}
        </div>

        {/* Total Leads */}
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-zinc-600 mb-2">
            <span>Total leads</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div
            className={`text-3xl font-bold transition-all duration-300 ${
              leadAnimation ? 'text-blue-600 scale-110' : 'text-zinc-900 scale-100'
            }`}
            data-testid="total-leads"
          >
            {isLoadingStats ? (
              <span className="text-zinc-400">...</span>
            ) : (
              stats.total_leads.toLocaleString()
            )}
          </div>
          <div className="text-xs text-zinc-500 mt-1">All leads from your links</div>

          {/* Pulse effect overlay */}
          {leadAnimation && (
            <div className="absolute inset-0 -z-10" data-testid="lead-animation">
              <div className="absolute top-1/2 left-0 w-full h-12 -translate-y-1/2 bg-blue-100 rounded-lg animate-ping opacity-75"></div>
            </div>
          )}
        </div>

        {/* Total Referred Customers */}
        <div>
          <div className="flex items-center gap-2 text-sm text-zinc-600 mb-2">
            <span>Total referred customers</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold text-zinc-900" data-testid="total-customers">
            {isLoadingStats ? (
              <span className="text-zinc-400">...</span>
            ) : (
              stats.total_customers.toLocaleString()
            )}
          </div>
          <div className="text-xs text-zinc-500 mt-1">All customers from your links</div>
        </div>
      </div>
    </div>
  );
}
