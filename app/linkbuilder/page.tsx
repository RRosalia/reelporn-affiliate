'use client';

import { useState, useEffect } from 'react';
import { linkBuilderService } from '@/lib/services/LinkBuilderService';
import { AffiliateLink, PaginatedLinksResponse } from '@/lib/types/link';

export default function LinkBuilderPage() {
  const [referenceId, setReferenceId] = useState('');
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [pagination, setPagination] = useState<PaginatedLinksResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Link Builder Modal State
  const [selectedLink, setSelectedLink] = useState<AffiliateLink | null>(null);
  const [showLinkBuilder, setShowLinkBuilder] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [sub1, setSub1] = useState('');
  const [sub2, setSub2] = useState('');
  const [sub3, setSub3] = useState('');
  const [copiedGenerated, setCopiedGenerated] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Link Tester State
  const [testUrl, setTestUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Fetch links on component mount and when page changes
  useEffect(() => {
    fetchLinks(currentPage);
  }, [currentPage]);

  const fetchLinks = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await linkBuilderService.getAllLinks(page);
      setLinks(response.data);
      setPagination(response);
    } catch (err: any) {
      setError(err.message || 'Failed to load links');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const newLink = await linkBuilderService.createLink(
        referenceId ? { reference_id: referenceId } : {}
      );
      setSuccessMessage('Link created successfully!');
      setReferenceId('');

      // Refresh the links list
      await fetchLinks(currentPage);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to create link');
    } finally {
      setIsCreating(false);
    }
  };

  const handleLinkClick = (link: AffiliateLink) => {
    setSelectedLink(link);
    setTargetUrl('/');
    setSub1('');
    setSub2('');
    setSub3('');
    setCopiedGenerated(false);
    setUrlError(null);
    setShowLinkBuilder(true);
  };

  const handleTargetUrlChange = (value: string) => {
    const websiteUrl = pagination?.meta?.website_url;
    if (!websiteUrl) {
      setTargetUrl(value);
      setUrlError(null);
      return;
    }

    // If user pastes a full URL, validate it belongs to our domain
    if (value.startsWith('http://') || value.startsWith('https://')) {
      try {
        const pastedUrl = new URL(value);
        const ourUrl = new URL(websiteUrl);

        if (pastedUrl.origin === ourUrl.origin) {
          // Extract just the path from the pasted URL
          setTargetUrl(pastedUrl.pathname + pastedUrl.search + pastedUrl.hash);
          setUrlError(null);
        } else {
          // Invalid domain - show error
          setUrlError(`Only URLs from ${ourUrl.hostname} are allowed. Please use a valid page path.`);
          return;
        }
      } catch (e) {
        // Invalid URL format
        setUrlError('Invalid URL format. Please enter a valid page path.');
        return;
      }
    } else {
      // Ensure it starts with /
      const path = value.startsWith('/') ? value : `/${value}`;
      setTargetUrl(path);
      setUrlError(null);
    }
  };

  const generateFullLink = () => {
    if (!selectedLink || !targetUrl) return '';

    const websiteUrl = pagination?.meta?.website_url;
    if (!websiteUrl) return '';

    try {
      const baseUrl = new URL(websiteUrl);
      const fullUrl = new URL(targetUrl, baseUrl);

      fullUrl.searchParams.set('ref', selectedLink.reference_id);

      if (sub1) fullUrl.searchParams.set('sub1', sub1);
      if (sub2) fullUrl.searchParams.set('sub2', sub2);
      if (sub3) fullUrl.searchParams.set('sub3', sub3);

      return fullUrl.toString();
    } catch (e) {
      return '';
    }
  };

  const copyGeneratedLink = async () => {
    const fullLink = generateFullLink();
    if (!fullLink) return;

    try {
      await navigator.clipboard.writeText(fullLink);
      setCopiedGenerated(true);
      setTimeout(() => setCopiedGenerated(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLinkId(id);
      setTimeout(() => setCopiedLinkId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleValidateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testUrl.trim()) return;

    setIsValidating(true);
    setValidationError(null);
    setValidationResult(null);

    try {
      const result = await linkBuilderService.validateLink(testUrl);
      setValidationResult(result);
    } catch (err: any) {
      setValidationError(err.message || 'Failed to validate link');
    } finally {
      setIsValidating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Link Builder</h1>
        <p className="text-zinc-600">Create and manage your affiliate tracking links</p>

        {/* Info Box */}
        {pagination?.meta?.website_url && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-1">Tip: Link to any page</p>
                <p className="text-sm text-blue-700 mb-2">
                  You can link to any page on <span className="font-semibold">{pagination.meta.website_url}</span>,
                  just add your parameter <code className="px-1.5 py-0.5 bg-blue-100 rounded text-blue-900 font-mono text-xs">?ref=your-reference-id</code> at the end.
                </p>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Advanced tracking:</span> You can also include optional sub-parameters
                  (<code className="px-1.5 py-0.5 bg-blue-100 rounded text-blue-900 font-mono text-xs">sub1</code>,{' '}
                  <code className="px-1.5 py-0.5 bg-blue-100 rounded text-blue-900 font-mono text-xs">sub2</code>,{' '}
                  <code className="px-1.5 py-0.5 bg-blue-100 rounded text-blue-900 font-mono text-xs">sub3</code>) to track additional campaign information.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Link Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Create New Link</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Link Creation */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">Quick Link</h3>
            <form onSubmit={handleCreateLink}>
              <div className="mb-4">
                <label htmlFor="referenceId" className="block text-sm font-medium text-zinc-700 mb-2">
                  Reference ID (Optional)
                </label>
                <input
                  type="text"
                  id="referenceId"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  placeholder="e.g., summer2025"
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  disabled={isCreating}
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Leave empty to auto-generate
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Link'}
              </button>
            </form>
          </div>

          {/* Link Tester */}
          <div className="border-l border-zinc-200 pl-6">
            <h3 className="text-sm font-semibold text-zinc-700 mb-3">Test Link</h3>
            <form onSubmit={handleValidateLink}>
              <div className="mb-4">
                <label htmlFor="testUrl" className="block text-sm font-medium text-zinc-700 mb-2">
                  Paste Link to Verify
                </label>
                <input
                  type="url"
                  id="testUrl"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="https://example.com?ref=..."
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  disabled={isValidating}
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Verify link belongs to you
                </p>
              </div>

              {/* Validation Error (Network/API errors) */}
              {validationError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="text-sm text-red-700">{validationError}</p>
                </div>
              )}

              {/* Validation Result */}
              {validationResult && (
                <div className="mb-4 space-y-2">
                  {/* Valid/Invalid Status */}
                  {validationResult.valid ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium text-green-800">Valid affiliate link</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <p className="text-sm font-medium text-red-800">Invalid link</p>
                    </div>
                  )}

                  {/* Errors */}
                  {validationResult.errors && validationResult.errors.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <ul className="text-sm text-red-800 space-y-1">
                        {validationResult.errors.map((error: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-600 mt-0.5">•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Warnings */}
                  {validationResult.warnings && validationResult.warnings.length > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <ul className="text-sm text-yellow-800 space-y-1">
                        {validationResult.warnings.map((warning: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-yellow-600 mt-0.5">⚠</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Info */}
                  {validationResult.info && validationResult.info.length > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <ul className="text-sm text-blue-800 space-y-1">
                        {validationResult.info.map((info: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">ℹ</span>
                            <span>{info}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isValidating || !testUrl.trim()}
                className="w-full bg-zinc-600 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? 'Testing...' : 'Test Link'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-900">Your Links</h2>
          {pagination && (
            <span className="text-sm text-zinc-500">
              {pagination.meta.total} total link{pagination.meta.total !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="mt-4 text-zinc-500">Loading links...</p>
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
            <p className="font-semibold text-zinc-900 mb-1">No links yet</p>
            <p className="text-sm text-zinc-500">Create your first affiliate link above to get started</p>
          </div>
        ) : (
          <>
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
                    <tr
                      key={link.id}
                      onClick={() => handleLinkClick(link)}
                      className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-zinc-900">{link.reference_id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-zinc-600 truncate max-w-md">{link.url}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(link.url, link.id);
                            }}
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
            </div>

            {/* Pagination */}
            {pagination && pagination.meta.last_page > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-zinc-500">
                  Showing {pagination.meta.from} to {pagination.meta.to} of {pagination.meta.total} links
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.links.prev}
                    className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center px-4 py-2 text-sm font-medium text-zinc-700">
                    Page {pagination.meta.current_page} of {pagination.meta.last_page}
                  </div>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.links.next}
                    className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Link Builder Modal */}
      {showLinkBuilder && selectedLink && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900">Build Your Link</h2>
                  <p className="text-sm text-zinc-600 mt-1">
                    Reference ID: <span className="font-mono font-semibold text-pink-600">{selectedLink.reference_id}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowLinkBuilder(false)}
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Target URL Input */}
                <div>
                  <label htmlFor="targetUrl" className="block text-sm font-medium text-zinc-700 mb-2">
                    Target Page Path
                  </label>
                  <div className={`flex items-center border rounded-lg overflow-hidden ${urlError ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-500' : 'border-zinc-300 focus-within:ring-2 focus-within:ring-pink-500'} focus-within:border-transparent`}>
                    <div className="px-4 py-2 bg-zinc-100 text-zinc-600 text-sm font-mono border-r border-zinc-300 flex-shrink-0">
                      {pagination?.meta?.website_url || 'https://example.com'}
                    </div>
                    <input
                      type="text"
                      id="targetUrl"
                      value={targetUrl}
                      onChange={(e) => handleTargetUrlChange(e.target.value)}
                      placeholder="/pricing"
                      className="flex-1 px-4 py-2 focus:outline-none"
                    />
                  </div>
                  {urlError ? (
                    <p className="mt-1 text-xs text-red-600">
                      {urlError}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-zinc-500">
                      Enter the page path (e.g., /pricing, /features). You can also paste a full URL from our domain.
                    </p>
                  )}
                </div>

                {/* Sub Parameters */}
                <div className="p-4 bg-zinc-50 rounded-lg">
                  <p className="text-sm font-medium text-zinc-900 mb-3">
                    Advanced Tracking Parameters (Optional)
                  </p>
                  <p className="text-xs text-zinc-600 mb-3">
                    Add up to 3 custom parameters to track campaign details like source, medium, or campaign name.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor="sub1" className="block text-xs font-medium text-zinc-700 mb-1">
                        Sub Parameter 1
                      </label>
                      <input
                        type="text"
                        id="sub1"
                        value={sub1}
                        onChange={(e) => setSub1(e.target.value)}
                        placeholder="e.g., facebook, email, instagram"
                        className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="sub2" className="block text-xs font-medium text-zinc-700 mb-1">
                        Sub Parameter 2
                      </label>
                      <input
                        type="text"
                        id="sub2"
                        value={sub2}
                        onChange={(e) => setSub2(e.target.value)}
                        placeholder="e.g., banner, story, post"
                        className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="sub3" className="block text-xs font-medium text-zinc-700 mb-1">
                        Sub Parameter 3
                      </label>
                      <input
                        type="text"
                        id="sub3"
                        value={sub3}
                        onChange={(e) => setSub3(e.target.value)}
                        placeholder="e.g., january, q1, winter-sale"
                        className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Generated Link Preview & Copy */}
                {targetUrl && !urlError && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-green-900">Your Generated Link:</p>
                      <button
                        onClick={copyGeneratedLink}
                        disabled={!!urlError}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-green-700 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {copiedGenerated ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-green-800 font-mono break-all">
                      {generateFullLink()}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLinkBuilder(false)}
                    className="px-6 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
