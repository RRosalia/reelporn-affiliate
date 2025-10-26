'use client';

import { useEffect, useState } from 'react';
import { clickService } from '@/lib/services/ClickService';
import { Click, ClickFilters } from '@/lib/types/click';
import { getCountryFlag } from '@/lib/utils/countryFlags';

export default function ClicksPage() {
  const [clicks, setClicks] = useState<Click[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClicks, setTotalClicks] = useState(0);

  // Filter states
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [perPage, setPerPage] = useState(15);

  useEffect(() => {
    fetchClicks();
  }, [currentPage, dateFrom, dateTo, sortOrder, perPage]);

  const fetchClicks = async () => {
    setIsLoading(true);
    try {
      const filters: ClickFilters = {
        page: currentPage,
        per_page: perPage,
        sort_by: 'created_at',
        sort_order: sortOrder,
      };

      if (dateFrom) filters.from = dateFrom;
      if (dateTo) filters.to = dateTo;

      const response = await clickService.getAll(filters);
      setClicks(response.data);
      setTotalPages(response.meta.last_page);
      setTotalClicks(response.meta.total);
    } catch (error) {
      console.error('Failed to fetch clicks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setDateFrom('');
    setDateTo('');
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

  const maskIP = (ip: string) => {
    // Already masked from backend, but just in case
    return ip;
  };

  const truncateUserAgent = (ua: string, maxLength: number = 50) => {
    if (ua.length <= maxLength) return ua;
    return ua.substring(0, maxLength) + '...';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Clicks</h1>
        <p className="text-zinc-600 mb-3">
          Track all clicks from your affiliate links
        </p>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-purple-900 mb-1">What is a Click?</h3>
              <p className="text-sm text-purple-800">
                A click is recorded when a user clicks your affiliate link and visits the landing page. Each click is tracked with IP address, country, device information, and custom parameters to help you measure your campaign performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                  Click ID
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  IP / Country
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  User Agent
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  External Data
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    Loading...
                  </td>
                </tr>
              ) : clicks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-zinc-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                      <p className="text-lg font-semibold text-zinc-900 mb-1">No clicks found</p>
                      <p className="text-sm text-zinc-500">
                        {dateFrom || dateTo
                          ? 'Try adjusting your filters'
                          : 'Start promoting your affiliate links to see clicks here'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                clicks.map((click) => (
                  <tr key={click.click_id} className="hover:bg-zinc-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-zinc-900">
                      {click.click_id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                      <div className="flex items-center gap-2">
                        {click.country && (
                          <span className="text-lg" title={click.country}>
                            {getCountryFlag(click.country)}
                          </span>
                        )}
                        <span>{maskIP(click.ip_address)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-900" title={click.user_agent}>
                      {truncateUserAgent(click.user_agent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                      {click.external_data ? (
                        <div className="flex flex-col gap-1">
                          {click.external_data.sub1 && (
                            <span className="text-xs">
                              <span className="font-medium">sub1:</span> {click.external_data.sub1}
                            </span>
                          )}
                          {click.external_data.sub2 && (
                            <span className="text-xs">
                              <span className="font-medium">sub2:</span> {click.external_data.sub2}
                            </span>
                          )}
                          {click.external_data.sub3 && (
                            <span className="text-xs">
                              <span className="font-medium">sub3:</span> {click.external_data.sub3}
                            </span>
                          )}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                      {click.user_id ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs font-medium">
                          #{click.user_id}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                      {formatDate(click.expiration_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                      {formatDate(click.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && clicks.length > 0 && (
          <div className="px-6 py-4 border-t border-zinc-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-700">
                Showing <span className="font-medium">{(currentPage - 1) * perPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * perPage, totalClicks)}
                </span>{' '}
                of <span className="font-medium">{totalClicks}</span> clicks
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
