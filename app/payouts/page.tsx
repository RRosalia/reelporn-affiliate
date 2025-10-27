'use client';

import { useEffect, useState } from 'react';
import { affiliatePayoutService } from '@/lib/services/AffiliatePayoutService';
import { commissionService } from '@/lib/services/CommissionService';
import { AffiliatePayout, AffiliatePayoutFilters, PayoutStatus } from '@/lib/types/affiliatePayout';
import { Commission, CommissionFilters, CommissionStatus } from '@/lib/types/commission';
import { formatCurrency } from '@/lib/utils/currency';

type TabType = 'payouts' | 'commissions';

export default function PayoutsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('payouts');

  // Payouts state
  const [payouts, setPayouts] = useState<AffiliatePayout[]>([]);
  const [isLoadingPayouts, setIsLoadingPayouts] = useState(true);
  const [currentPayoutsPage, setCurrentPayoutsPage] = useState(1);
  const [totalPayoutsPages, setTotalPayoutsPages] = useState(1);
  const [totalPayouts, setTotalPayouts] = useState(0);
  const [payoutStatusFilter, setPayoutStatusFilter] = useState<PayoutStatus | ''>('');
  const [payoutDateFrom, setPayoutDateFrom] = useState('');
  const [payoutDateTo, setPayoutDateTo] = useState('');
  const [payoutSortOrder, setPayoutSortOrder] = useState<'asc' | 'desc'>('desc');
  const [payoutPerPage, setPayoutPerPage] = useState(15);

  // Commissions state
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoadingCommissions, setIsLoadingCommissions] = useState(true);
  const [currentCommissionsPage, setCurrentCommissionsPage] = useState(1);
  const [totalCommissionsPages, setTotalCommissionsPages] = useState(1);
  const [totalCommissions, setTotalCommissions] = useState(0);
  const [commissionStatusFilter, setCommissionStatusFilter] = useState<CommissionStatus | ''>('');
  const [commissionPayoutFilter, setCommissionPayoutFilter] = useState<string>('');
  const [commissionDateFrom, setCommissionDateFrom] = useState('');
  const [commissionDateTo, setCommissionDateTo] = useState('');
  const [commissionSortOrder, setCommissionSortOrder] = useState<'asc' | 'desc'>('desc');
  const [commissionPerPage, setCommissionPerPage] = useState(15);

  // Fetch payouts
  useEffect(() => {
    if (activeTab === 'payouts') {
      fetchPayouts();
    }
  }, [activeTab, currentPayoutsPage, payoutStatusFilter, payoutDateFrom, payoutDateTo, payoutSortOrder, payoutPerPage]);

  // Fetch commissions
  useEffect(() => {
    if (activeTab === 'commissions') {
      fetchCommissions();
    }
  }, [activeTab, currentCommissionsPage, commissionStatusFilter, commissionPayoutFilter, commissionDateFrom, commissionDateTo, commissionSortOrder, commissionPerPage]);

  const fetchPayouts = async () => {
    setIsLoadingPayouts(true);
    try {
      const filters: AffiliatePayoutFilters = {
        page: currentPayoutsPage,
        per_page: payoutPerPage,
        sort_by: 'scheduled_at',
        sort_order: payoutSortOrder,
      };

      if (payoutStatusFilter) filters.status = payoutStatusFilter;
      if (payoutDateFrom) filters.from = payoutDateFrom;
      if (payoutDateTo) filters.to = payoutDateTo;

      const response = await affiliatePayoutService.getAll(filters);
      setPayouts(response.data);
      setTotalPayoutsPages(response.meta.last_page);
      setTotalPayouts(response.meta.total);
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
    } finally {
      setIsLoadingPayouts(false);
    }
  };

  const fetchCommissions = async () => {
    setIsLoadingCommissions(true);
    try {
      const filters: CommissionFilters = {
        page: currentCommissionsPage,
        per_page: commissionPerPage,
        sort_by: 'created_at',
        sort_order: commissionSortOrder,
      };

      if (commissionStatusFilter) filters.status = commissionStatusFilter;
      if (commissionPayoutFilter === 'unpaid') filters.payout_id = 'null';
      else if (commissionPayoutFilter && commissionPayoutFilter !== '') filters.payout_id = parseInt(commissionPayoutFilter);
      if (commissionDateFrom) filters.from = commissionDateFrom;
      if (commissionDateTo) filters.to = commissionDateTo;

      const response = await commissionService.getAll(filters);
      setCommissions(response.data);
      setTotalCommissionsPages(response.meta.last_page);
      setTotalCommissions(response.meta.total);
    } catch (error) {
      console.error('Failed to fetch commissions:', error);
    } finally {
      setIsLoadingCommissions(false);
    }
  };

  const handleResetPayoutFilters = () => {
    setPayoutStatusFilter('');
    setPayoutDateFrom('');
    setPayoutDateTo('');
    setPayoutSortOrder('desc');
    setPayoutPerPage(15);
    setCurrentPayoutsPage(1);
  };

  const handleResetCommissionFilters = () => {
    setCommissionStatusFilter('');
    setCommissionPayoutFilter('');
    setCommissionDateFrom('');
    setCommissionDateTo('');
    setCommissionSortOrder('desc');
    setCommissionPerPage(15);
    setCurrentCommissionsPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPayoutStatusBadge = (status: PayoutStatus) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCommissionStatusBadge = (status: CommissionStatus) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-blue-100 text-blue-800 border-blue-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Payouts & Commissions</h1>
        <p className="text-zinc-600">
          Track your earnings, view payout history, and monitor commission status
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-zinc-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('payouts')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'payouts'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
              }`}
            >
              Payouts
            </button>
            <button
              onClick={() => setActiveTab('commissions')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'commissions'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
              }`}
            >
              Commissions
            </button>
          </div>
        </div>
      </div>

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Status</label>
                <select
                  value={payoutStatusFilter}
                  onChange={(e) => {
                    setPayoutStatusFilter(e.target.value as PayoutStatus | '');
                    setCurrentPayoutsPage(1);
                  }}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={payoutDateFrom}
                  onChange={(e) => {
                    setPayoutDateFrom(e.target.value);
                    setCurrentPayoutsPage(1);
                  }}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={payoutDateTo}
                  onChange={(e) => {
                    setPayoutDateTo(e.target.value);
                    setCurrentPayoutsPage(1);
                  }}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Sort Order */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-zinc-700">Sort by Date:</label>
                  <button
                    onClick={() => setPayoutSortOrder(payoutSortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-1.5 border border-zinc-300 rounded-lg hover:bg-zinc-50"
                    title={payoutSortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                  >
                    {payoutSortOrder === 'asc' ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Per Page */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-zinc-700">Show:</label>
                  <select
                    value={payoutPerPage}
                    onChange={(e) => {
                      setPayoutPerPage(Number(e.target.value));
                      setCurrentPayoutsPage(1);
                    }}
                    className="px-3 py-1.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleResetPayoutFilters}
                className="px-4 py-2 text-sm text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-50"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Payouts Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Commissions
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Scheduled At
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Paid At
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {isLoadingPayouts ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                        Loading...
                      </td>
                    </tr>
                  ) : payouts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-12 h-12 text-zinc-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-lg font-semibold text-zinc-900 mb-1">No payouts found</p>
                          <p className="text-sm text-zinc-500">
                            {payoutStatusFilter || payoutDateFrom || payoutDateTo
                              ? 'Try adjusting your filters'
                              : 'Payouts will appear here when commissions are batched and processed'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    payouts.map((payout) => (
                      <tr key={payout.id} className="hover:bg-zinc-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                          #{payout.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPayoutStatusBadge(payout.status)}`}>
                            {payout.status ? payout.status.charAt(0).toUpperCase() + payout.status.slice(1) : '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-zinc-900">
                          ${formatCurrency(payout.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-zinc-900">
                          {payout.commission_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                          {formatDate(payout.scheduled_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                          {payout.paid_at ? formatDate(payout.paid_at) : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                          {formatDate(payout.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!isLoadingPayouts && payouts.length > 0 && (
              <div className="px-6 py-4 border-t border-zinc-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-700">
                    Showing <span className="font-medium">{(currentPayoutsPage - 1) * payoutPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPayoutsPage * payoutPerPage, totalPayouts)}
                    </span>{' '}
                    of <span className="font-medium">{totalPayouts}</span> payouts
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPayoutsPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPayoutsPage === 1}
                      className="px-3 py-1.5 text-sm border border-zinc-300 rounded-lg hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPayoutsPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPayoutsPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPayoutsPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPayoutsPage >= totalPayoutsPages - 2) {
                          pageNum = totalPayoutsPages - 4 + i;
                        } else {
                          pageNum = currentPayoutsPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPayoutsPage(pageNum)}
                            className={`px-3 py-1.5 text-sm border rounded-lg ${
                              currentPayoutsPage === pageNum
                                ? 'bg-pink-500 text-white border-pink-500'
                                : 'border-zinc-300 hover:bg-zinc-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPayoutsPage((prev) => Math.min(prev + 1, totalPayoutsPages))}
                      disabled={currentPayoutsPage === totalPayoutsPages}
                      className="px-3 py-1.5 text-sm border border-zinc-300 rounded-lg hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Commissions Tab */}
      {activeTab === 'commissions' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Status</label>
                <select
                  value={commissionStatusFilter}
                  onChange={(e) => {
                    setCommissionStatusFilter(e.target.value as CommissionStatus | '');
                    setCurrentCommissionsPage(1);
                  }}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Payout Filter */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Payout</label>
                <select
                  value={commissionPayoutFilter}
                  onChange={(e) => {
                    setCommissionPayoutFilter(e.target.value);
                    setCurrentCommissionsPage(1);
                  }}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="unpaid">Unpaid Only</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={commissionDateFrom}
                  onChange={(e) => {
                    setCommissionDateFrom(e.target.value);
                    setCurrentCommissionsPage(1);
                  }}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={commissionDateTo}
                  onChange={(e) => {
                    setCommissionDateTo(e.target.value);
                    setCurrentCommissionsPage(1);
                  }}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Sort Order */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-zinc-700">Sort by Date:</label>
                  <button
                    onClick={() => setCommissionSortOrder(commissionSortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-1.5 border border-zinc-300 rounded-lg hover:bg-zinc-50"
                    title={commissionSortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                  >
                    {commissionSortOrder === 'asc' ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Per Page */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-zinc-700">Show:</label>
                  <select
                    value={commissionPerPage}
                    onChange={(e) => {
                      setCommissionPerPage(Number(e.target.value));
                      setCurrentCommissionsPage(1);
                    }}
                    className="px-3 py-1.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleResetCommissionFilters}
                className="px-4 py-2 text-sm text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-50"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Commissions Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Click ID
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Payment Amount
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Payout ID
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {isLoadingCommissions ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                        Loading...
                      </td>
                    </tr>
                  ) : commissions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-12 h-12 text-zinc-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <p className="text-lg font-semibold text-zinc-900 mb-1">No commissions found</p>
                          <p className="text-sm text-zinc-500">
                            {commissionStatusFilter || commissionPayoutFilter || commissionDateFrom || commissionDateTo
                              ? 'Try adjusting your filters'
                              : 'Commissions will appear here when customers make purchases'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    commissions.map((commission) => (
                      <tr key={commission.id} className="hover:bg-zinc-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                          #{commission.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCommissionStatusBadge(commission.status)}`}>
                            {commission.status ? commission.status.charAt(0).toUpperCase() + commission.status.slice(1) : '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-zinc-900">
                          ${formatCurrency(commission.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-zinc-600">
                          {commission.click_id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                          #{commission.payment_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-zinc-900">
                          ${formatCurrency(commission.payment_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                          {commission.payout_id ? `#${commission.payout_id}` : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                          {formatDate(commission.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!isLoadingCommissions && commissions.length > 0 && (
              <div className="px-6 py-4 border-t border-zinc-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-700">
                    Showing <span className="font-medium">{(currentCommissionsPage - 1) * commissionPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentCommissionsPage * commissionPerPage, totalCommissions)}
                    </span>{' '}
                    of <span className="font-medium">{totalCommissions}</span> commissions
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentCommissionsPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentCommissionsPage === 1}
                      className="px-3 py-1.5 text-sm border border-zinc-300 rounded-lg hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalCommissionsPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalCommissionsPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentCommissionsPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentCommissionsPage >= totalCommissionsPages - 2) {
                          pageNum = totalCommissionsPages - 4 + i;
                        } else {
                          pageNum = currentCommissionsPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentCommissionsPage(pageNum)}
                            className={`px-3 py-1.5 text-sm border rounded-lg ${
                              currentCommissionsPage === pageNum
                                ? 'bg-pink-500 text-white border-pink-500'
                                : 'border-zinc-300 hover:bg-zinc-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentCommissionsPage((prev) => Math.min(prev + 1, totalCommissionsPages))}
                      disabled={currentCommissionsPage === totalCommissionsPages}
                      className="px-3 py-1.5 text-sm border border-zinc-300 rounded-lg hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
