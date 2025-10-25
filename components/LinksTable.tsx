'use client';

import { useState } from 'react';
import { AffiliateLink } from '@/lib/types/link';

interface LinksTableProps {
  links: AffiliateLink[];
  isLoading?: boolean;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export default function LinksTable({
  links,
  isLoading = false,
  showViewAll = false,
  onViewAll
}: LinksTableProps) {
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLinkId(id);
      setTimeout(() => setCopiedLinkId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        <p className="mt-4 text-zinc-500">Loading links...</p>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
        </div>
        <p className="font-semibold text-zinc-900 mb-1">No links yet</p>
        <p className="text-sm text-zinc-500">Create your first affiliate link to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">Reference ID</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">URL</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">Clicks</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">Created</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
              <td className="py-4 px-4">
                <span className="font-mono text-sm text-zinc-900">{link.reference_id}</span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-600 truncate max-w-md">{link.url}</span>
                  <button
                    onClick={() => copyToClipboard(link.url, link.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded transition-colors flex-shrink-0"
                    title="Copy link"
                  >
                    {copiedLinkId === link.id ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-zinc-900 font-medium">{link.clicks_count}</span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-zinc-500">{formatDate(link.created_at)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showViewAll && onViewAll && (
        <div className="mt-4 text-center">
          <button
            onClick={onViewAll}
            className="text-pink-500 hover:text-pink-600 text-sm font-medium"
          >
            View all links →
          </button>
        </div>
      )}
    </div>
  );
}
