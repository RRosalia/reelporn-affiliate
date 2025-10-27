'use client';

import { useEffect, useState } from 'react';
import { leadService } from '@/lib/services/LeadService';
import { Lead, LeadFilters } from '@/lib/types/lead';
import { getCountryFlag } from '@/lib/utils/countryFlags';
import { formatCurrency } from '@/lib/utils/currency';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  // Filter states
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [status, setStatus] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [perPage, setPerPage] = useState(15);

  useEffect(() => {
    fetchLeads();
  }, [currentPage, dateFrom, dateTo, status, sortOrder, perPage]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const filters: LeadFilters = {
        page: currentPage,
        per_page: perPage,
        sort_by: 'created_at',
        sort_order: sortOrder,
      };

      if (dateFrom) filters.from = dateFrom;
      if (dateTo) filters.to = dateTo;
      if (status) filters.status = status;

      const response = await leadService.getAll(filters);
      setLeads(response.data);
      setTotalPages(response.meta.last_page);
      setTotalLeads(response.meta.total);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setDateFrom('');
    setDateTo('');
    setStatus('');
    setSortOrder('desc');
    setPerPage(15);
    setCurrentPage(1);
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Leads</h1>
        <p className="text-zinc-600 mb-3">
          Track all clicks and leads from your affiliate links
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-green-900 mb-1">What is a Lead?</h3>
              <p className="text-sm text-green-800">
                A lead is created when a user who clicked your affiliate link signs up or submits their information. This shows genuine interest from potential customers. Leads become customers when they make a purchase or subscribe.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Sort Order */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-zinc-700">Sort by Date:</label>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 border border-zinc-300 rounded-lg hover:bg-zinc-50"
                title={sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
              >
                {sortOrder === 'asc' ? (
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
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
            onClick={handleResetFilters}
            className="px-4 py-2 text-sm text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-50"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Total Commission
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Signed Up At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    Loading...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-zinc-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-lg font-semibold text-zinc-900 mb-1">No leads found</p>
                      <p className="text-sm text-zinc-500">
                        {dateFrom || dateTo
                          ? 'Try adjusting your filters'
                          : 'Start promoting your affiliate links to see leads here'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                      #{lead.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-900">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusBadgeColor(lead.status)}`}>
                        {lead.status ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1) : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                      ${formatCurrency(lead.total_commission_earned)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                      {lead.country ? (
                        <span className="text-lg" title={lead.country}>
                          {getCountryFlag(lead.country)}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                      {formatDate(lead.signed_up_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && leads.length > 0 && (
          <div className="px-6 py-4 border-t border-zinc-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-700">
                Showing <span className="font-medium">{(currentPage - 1) * perPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * perPage, totalLeads)}
                </span>{' '}
                of <span className="font-medium">{totalLeads}</span> leads
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border border-zinc-300 rounded-lg hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 text-sm border rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-green-500 text-white border-green-500'
                            : 'border-zinc-300 hover:bg-zinc-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border border-zinc-300 rounded-lg hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
