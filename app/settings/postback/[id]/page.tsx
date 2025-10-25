'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { postbackService } from '@/lib/services/PostbackService';
import { Postback } from '@/lib/types/postback';

export default function PostbackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postbackId = params.id as string;

  const [postback, setPostback] = useState<Postback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    fetchPostback();
  }, [postbackId]);

  const fetchPostback = async () => {
    setIsLoading(true);
    try {
      const allPostbacks = await postbackService.getAllPostbacks();
      const found = allPostbacks.find(p => p.id === postbackId);
      setPostback(found || null);
    } catch (err: any) {
      console.error('Failed to fetch postback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleConfirm = async () => {
    if (!postback) return;

    setIsToggling(true);
    try {
      await postbackService.togglePostback(postback.id);
      setShowToggleModal(false);
      await fetchPostback();
    } catch (err: any) {
      console.error('Failed to toggle postback:', err);
      alert('Failed to toggle postback. Please try again.');
    } finally {
      setIsToggling(false);
    }
  };

  const openToggleModal = () => {
    setShowToggleModal(true);
  };

  const closeToggleModal = () => {
    setShowToggleModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!postback || deleteConfirmation !== 'DELETE') return;

    setIsDeleting(true);
    try {
      await postbackService.deletePostback(postback.id);
      router.push('/settings/postback');
    } catch (err: any) {
      console.error('Failed to delete postback:', err);
      alert('Failed to delete postback. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = () => {
    setDeleteConfirmation('');
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteConfirmation('');
    setShowDeleteModal(false);
  };

  const copyToClipboard = async (text: string, type: 'secret' | 'url') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'secret') {
        setCopiedSecret(true);
        setTimeout(() => setCopiedSecret(false), 2000);
      } else {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <p className="mt-4 text-zinc-500">Loading postback...</p>
        </div>
      </div>
    );
  }

  if (!postback) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-zinc-900 font-semibold mb-2">Postback not found</p>
          <button
            onClick={() => router.push('/settings/postback')}
            className="text-pink-600 hover:text-pink-700 text-sm"
          >
            ← Back to Postbacks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/settings/postback')}
          className="text-zinc-600 hover:text-zinc-900 text-sm mb-4 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Postbacks
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Postback Details</h1>
            <p className="text-zinc-600">View and manage your postback configuration</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openDeleteModal}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-1">Postback Status</p>
                <p className="text-xs text-zinc-500">
                  {postback.is_active
                    ? 'This postback is currently active and receiving events'
                    : 'This postback is currently inactive and not receiving events'}
                </p>
              </div>
              <button
                onClick={openToggleModal}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  postback.is_active
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-zinc-300 hover:bg-zinc-400 text-zinc-700'
                }`}
              >
                {postback.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <span className="font-medium">Tip:</span> You can temporarily deactivate this postback without deleting it.
                When inactive, no event notifications will be sent to your endpoint. Click the button above to toggle the status.
              </p>
            </div>
          </div>
        </div>

        {/* URL Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Endpoint Configuration</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Postback URL</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-mono text-zinc-900 break-all">
                  {postback.url}
                </code>
                <button
                  onClick={() => copyToClipboard(postback.url, 'url')}
                  className="text-pink-600 hover:text-pink-700 p-2"
                  title="Copy URL"
                >
                  {copiedUrl ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">HTTP Method</label>
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-700">
                {postback.method}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Events</label>
              <div className="flex flex-wrap gap-2">
                {postback.events.map((event) => (
                  <span
                    key={event}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 capitalize"
                  >
                    {event}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Security</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Secret Key</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-mono text-zinc-900">
                  {postback.secret}
                </code>
                <button
                  onClick={() => copyToClipboard(postback.secret, 'secret')}
                  className="text-pink-600 hover:text-pink-700 p-2"
                  title="Copy secret"
                >
                  {copiedSecret ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-medium text-amber-900 mb-1">How to verify postback requests</p>
                  <p className="text-xs text-amber-800">
                    We send the secret key in the <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">Signature</code> HTTP header with every postback request.
                    Compare this header value with your secret key to verify that the request is coming from us and not a third party.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Headers Section */}
        {postback.headers && postback.headers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Custom Headers</h2>
            <div className="space-y-2">
              {postback.headers.map((header, index) => (
                <div key={index} className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <code className="text-sm font-mono text-zinc-900">{header}</code>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* POST Body Section */}
        {postback.body && Object.keys(postback.body).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">POST Body Parameters</h2>
            <div className="space-y-2">
              {Object.entries(postback.body).map(([key, value]) => (
                <div key={key} className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-700">{key}:</span>
                    <code className="text-sm font-mono text-zinc-900">{value}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Created</label>
              <p className="text-sm text-zinc-900">{formatDate(postback.created_at)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Last Updated</label>
              <p className="text-sm text-zinc-900">{formatDate(postback.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Confirmation Modal */}
      {showToggleModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-zinc-900">
                {postback.is_active ? 'Deactivate Postback' : 'Activate Postback'}
              </h2>
              <button
                onClick={closeToggleModal}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-zinc-700 mb-4">
                {postback.is_active
                  ? 'Are you sure you want to deactivate this postback? When inactive, no event notifications will be sent to your endpoint.'
                  : 'Are you sure you want to activate this postback? Once active, event notifications will be sent to your endpoint.'}
              </p>
              <code className="block px-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-sm font-mono text-zinc-900 break-all">
                {postback.url}
              </code>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeToggleModal}
                className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                disabled={isToggling}
              >
                Cancel
              </button>
              <button
                onClick={handleToggleConfirm}
                disabled={isToggling}
                className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  postback.is_active
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isToggling ? 'Processing...' : postback.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-zinc-900">Delete Postback</h2>
              <button
                onClick={closeDeleteModal}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900 mb-1">Warning: This action cannot be undone</p>
                    <p className="text-sm text-red-800">
                      Deleting this postback will permanently remove it from your account. You will no longer receive notifications for tracked events.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-zinc-700 mb-2">
                  You are about to delete the postback:
                </p>
                <code className="block px-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-sm font-mono text-zinc-900 break-all">
                  {postback.url}
                </code>
              </div>

              <div>
                <label htmlFor="deleteConfirm" className="block text-sm font-medium text-zinc-700 mb-2">
                  Type <span className="font-bold text-red-600">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  id="deleteConfirm"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isDeleting}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                className="px-6 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Postback'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
