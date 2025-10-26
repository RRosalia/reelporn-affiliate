'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { postbackService } from '@/lib/services/PostbackService';
import { Postback, PostbackMethod, PostbackEvent } from '@/lib/types/postback';

export default function PostbacksPage() {
  const router = useRouter();
  const [postbacks, setPostbacks] = useState<Postback[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState<string | null>(null);

  // Form state
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<PostbackMethod>('GET');
  const [selectedEvents, setSelectedEvents] = useState<PostbackEvent[]>([]);
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }]);
  const [bodyParams, setBodyParams] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPostbacks();
  }, []);

  const fetchPostbacks = async () => {
    setIsLoading(true);
    try {
      const data = await postbackService.getAllPostbacks();
      setPostbacks(data);
    } catch (err: any) {
      console.error('Failed to fetch postbacks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventToggle = (event: PostbackEvent) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter(e => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const handleRemoveHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const handleAddBodyParam = () => {
    setBodyParams([...bodyParams, { key: '', value: '' }]);
  };

  const handleRemoveBodyParam = (index: number) => {
    setBodyParams(bodyParams.filter((_, i) => i !== index));
  };

  const handleBodyParamChange = (index: number, field: 'key' | 'value', value: string) => {
    const newBodyParams = [...bodyParams];
    newBodyParams[index][field] = value;
    setBodyParams(newBodyParams);
  };

  const resetForm = () => {
    setUrl('');
    setMethod('GET');
    setSelectedEvents([]);
    setHeaders([{ key: '', value: '' }]);
    setBodyParams([{ key: '', value: '' }]);
    setError(null);
  };

  const handleCreatePostback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert headers to string array format "Key: Value"
      const filteredHeaders = headers
        .filter(h => h.key.trim() !== '' && h.value.trim() !== '')
        .map(h => `${h.key}: ${h.value}`);

      // Convert body params to object
      const bodyObject = method === 'POST'
        ? bodyParams.reduce((acc, param) => {
            if (param.key.trim() !== '') {
              acc[param.key] = param.value;
            }
            return acc;
          }, {} as Record<string, string>)
        : undefined;

      await postbackService.createPostback({
        url,
        method,
        events: selectedEvents,
        headers: filteredHeaders.length > 0 ? filteredHeaders : undefined,
        body: bodyObject && Object.keys(bodyObject).length > 0 ? bodyObject : undefined,
      });

      setShowCreateModal(false);
      resetForm();
      await fetchPostbacks();
    } catch (err: any) {
      setError(err.message || 'Failed to create postback');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleTogglePostback = async (id: string) => {
    try {
      await postbackService.togglePostback(id);
      await fetchPostbacks();
    } catch (err: any) {
      console.error('Failed to toggle postback:', err);
    }
  };


  const copySecret = async (secret: string, id: string) => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopiedSecret(id);
      setTimeout(() => setCopiedSecret(null), 2000);
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Postback URLs</h1>
        <p className="text-zinc-600">Configure webhook endpoints to receive real-time event notifications</p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1 text-sm text-blue-800">
            <p className="font-medium mb-1">How Postbacks Work</p>
            <p>We'll send HTTP requests to your configured URLs when events occur (clicks, registrations, conversions). Each request includes a secret key for verification and event data as parameters.</p>
          </div>
        </div>
      </div>

      {/* Postbacks List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-900">Your Postbacks</h2>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Create Postback
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="mt-4 text-zinc-500">Loading postbacks...</p>
          </div>
        ) : postbacks.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="font-semibold text-zinc-900 mb-1">No postbacks yet</p>
            <p className="text-sm text-zinc-500">Create your first postback to start receiving event notifications</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">URL</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">Method</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">Events</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">Secret</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-700">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {postbacks.map((postback) => (
                  <tr
                    key={postback.id}
                    onClick={() => router.push(`/settings/postback/${postback.id}`)}
                    className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-4">
                      <span className="text-sm text-zinc-900 truncate max-w-xs block">{postback.url}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-zinc-100 text-zinc-700">
                        {postback.method}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {postback.events.map((event) => (
                          <span
                            key={event}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-zinc-600 font-mono">{postback.secret.substring(0, 8)}...</code>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copySecret(postback.secret, postback.id);
                          }}
                          className="text-pink-600 hover:text-pink-700"
                          title="Copy secret"
                        >
                          {copiedSecret === postback.id ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePostback(postback.id);
                        }}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          postback.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {postback.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/settings/postback/${postback.id}`);
                          }}
                          className="text-pink-600 hover:text-pink-700 p-1"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <PostbackModal
          title="Create Postback"
          url={url}
          method={method}
          selectedEvents={selectedEvents}
          headers={headers}
          bodyParams={bodyParams}
          isSubmitting={isSubmitting}
          error={error}
          onUrlChange={setUrl}
          onMethodChange={setMethod}
          onEventToggle={handleEventToggle}
          onHeaderChange={handleHeaderChange}
          onAddHeader={handleAddHeader}
          onRemoveHeader={handleRemoveHeader}
          onBodyParamChange={handleBodyParamChange}
          onAddBodyParam={handleAddBodyParam}
          onRemoveBodyParam={handleRemoveBodyParam}
          onSubmit={handleCreatePostback}
          onClose={() => {
            setShowCreateModal(false);
            resetForm();
          }}
        />
      )}

    </div>
  );
}

// Modal Component
interface PostbackModalProps {
  title: string;
  url: string;
  method: PostbackMethod;
  selectedEvents: PostbackEvent[];
  headers: Array<{ key: string; value: string }>;
  bodyParams: Array<{ key: string; value: string }>;
  isSubmitting: boolean;
  error: string | null;
  onUrlChange: (url: string) => void;
  onMethodChange: (method: PostbackMethod) => void;
  onEventToggle: (event: PostbackEvent) => void;
  onHeaderChange: (index: number, field: 'key' | 'value', value: string) => void;
  onAddHeader: () => void;
  onRemoveHeader: (index: number) => void;
  onBodyParamChange: (index: number, field: 'key' | 'value', value: string) => void;
  onAddBodyParam: () => void;
  onRemoveBodyParam: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

function PostbackModal({
  title,
  url,
  method,
  selectedEvents,
  headers,
  bodyParams,
  isSubmitting,
  error,
  onUrlChange,
  onMethodChange,
  onEventToggle,
  onHeaderChange,
  onAddHeader,
  onRemoveHeader,
  onBodyParamChange,
  onAddBodyParam,
  onRemoveBodyParam,
  onSubmit,
  onClose,
}: PostbackModalProps) {
  const events: PostbackEvent[] = ['click', 'registration', 'conversion'];
  const [focusedInput, setFocusedInput] = React.useState<HTMLInputElement | null>(null);

  const placeholders = [
    { name: '{click_id}', description: 'Unique click identifier - UUID generated by our system' },
    { name: '{affiliate_id}', description: 'Your affiliate ID' },
    { name: '{ref}', description: 'Your reference/link ID' },
    { name: '{country}', description: 'User country code (ISO 3166-1 alpha-2)' },
    { name: '{event}', description: 'Event type (click/registration/conversion)' },
    { name: '{commission}', description: 'Commission amount in cents - only for conversion events' },
    { name: '{timestamp}', description: 'Event timestamp (ISO 8601 with timezone)' },
    { name: '{sub1}', description: 'Custom sub-parameter 1' },
    { name: '{sub2}', description: 'Custom sub-parameter 2' },
    { name: '{sub3}', description: 'Custom sub-parameter 3' },
  ];

  const insertPlaceholder = (placeholder: string) => {
    if (!focusedInput) return;

    const start = focusedInput.selectionStart || 0;
    const end = focusedInput.selectionEnd || 0;
    const currentValue = focusedInput.value;
    const newValue = currentValue.substring(0, start) + placeholder + currentValue.substring(end);

    // Trigger the onChange event
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    nativeInputValueSetter?.call(focusedInput, newValue);

    const event = new Event('input', { bubbles: true });
    focusedInput.dispatchEvent(event);

    // Set cursor position after the inserted placeholder
    setTimeout(() => {
      focusedInput.focus();
      focusedInput.setSelectionRange(start + placeholder.length, start + placeholder.length);
    }, 0);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={onSubmit}>
            {/* Available Placeholders */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">Available Placeholders</h3>
              <p className="text-xs text-blue-700 mb-3">
                Click on any placeholder to insert it into the focused input field:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-blue-300">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-blue-900">Placeholder</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-blue-900">Description</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-blue-900">Example Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer" onMouseDown={(e) => { e.preventDefault(); insertPlaceholder('{click_id}'); }}>
                      <td className="py-2 px-3">
                        <code className="text-xs bg-white px-2 py-1 rounded border border-blue-300 font-mono text-blue-900">
                          {'{click_id}'}
                        </code>
                      </td>
                      <td className="py-2 px-3 text-xs text-blue-800">
                        <div>
                          <div>Unique click identifier (UUID)</div>
                          <div className="text-[11px] text-blue-700 mt-0.5 italic">Generated by our system</div>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs text-blue-700 font-mono">550e8400-e29b-41d4-a716-446655440000</td>
                    </tr>
                    <tr className="border-b border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer" onMouseDown={(e) => { e.preventDefault(); insertPlaceholder('{affiliate_id}'); }}>
                      <td className="py-2 px-3">
                        <code className="text-xs bg-white px-2 py-1 rounded border border-blue-300 font-mono text-blue-900">
                          {'{affiliate_id}'}
                        </code>
                      </td>
                      <td className="py-2 px-3 text-xs text-blue-800">Your affiliate ID</td>
                      <td className="py-2 px-3 text-xs text-blue-700 font-mono">12345</td>
                    </tr>
                    <tr className="border-b border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer" onMouseDown={(e) => { e.preventDefault(); insertPlaceholder('{ref}'); }}>
                      <td className="py-2 px-3">
                        <code className="text-xs bg-white px-2 py-1 rounded border border-blue-300 font-mono text-blue-900">
                          {'{ref}'}
                        </code>
                      </td>
                      <td className="py-2 px-3 text-xs text-blue-800">Your reference/link ID</td>
                      <td className="py-2 px-3 text-xs text-blue-700 font-mono">link-001</td>
                    </tr>
                    <tr className="border-b border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer" onMouseDown={(e) => { e.preventDefault(); insertPlaceholder('{country}'); }}>
                      <td className="py-2 px-3">
                        <code className="text-xs bg-white px-2 py-1 rounded border border-blue-300 font-mono text-blue-900">
                          {'{country}'}
                        </code>
                      </td>
                      <td className="py-2 px-3 text-xs text-blue-800">User country code (ISO 3166-1 alpha-2)</td>
                      <td className="py-2 px-3 text-xs text-blue-700 font-mono">US, GB, FR, DE</td>
                    </tr>
                    <tr className="border-b border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer" onMouseDown={(e) => { e.preventDefault(); insertPlaceholder('{event}'); }}>
                      <td className="py-2 px-3">
                        <code className="text-xs bg-white px-2 py-1 rounded border border-blue-300 font-mono text-blue-900">
                          {'{event}'}
                        </code>
                      </td>
                      <td className="py-2 px-3 text-xs text-blue-800">Event type</td>
                      <td className="py-2 px-3 text-xs text-blue-700 font-mono">click, registration, conversion</td>
                    </tr>
                    <tr className="border-b border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer" onMouseDown={(e) => { e.preventDefault(); insertPlaceholder('{commission}'); }}>
                      <td className="py-2 px-3">
                        <code className="text-xs bg-white px-2 py-1 rounded border border-blue-300 font-mono text-blue-900">
                          {'{commission}'}
                        </code>
                      </td>
                      <td className="py-2 px-3 text-xs text-blue-800">
                        <div>
                          <div>Commission amount in cents</div>
                          <div className="text-[11px] text-blue-700 mt-0.5 italic">Only available for conversion events</div>
                          <div className="text-[11px] text-blue-700 mt-0.5 italic">Always sent in cents (e.g., $12.99 = 1299)</div>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs text-blue-700 font-mono">1299, 2500, 599</td>
                    </tr>
                    <tr className="border-b border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer" onMouseDown={(e) => { e.preventDefault(); insertPlaceholder('{timestamp}'); }}>
                      <td className="py-2 px-3">
                        <code className="text-xs bg-white px-2 py-1 rounded border border-blue-300 font-mono text-blue-900">
                          {'{timestamp}'}
                        </code>
                      </td>
                      <td className="py-2 px-3 text-xs text-blue-800">Event timestamp (ISO 8601 with timezone)</td>
                      <td className="py-2 px-3 text-xs text-blue-700 font-mono">2025-10-25T14:30:00+00:00</td>
                    </tr>
                    <tr className="border-b border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer" onMouseDown={(e) => { e.preventDefault(); insertPlaceholder('{sub1}'); }}>
                      <td className="py-2 px-3">
                        <code className="text-xs bg-white px-2 py-1 rounded border border-blue-300 font-mono text-blue-900">
                          {'{sub1}'}
                        </code>
                      </td>
                      <td className="py-2 px-3 text-xs text-blue-800">Custom sub-parameter 1</td>
                      <td className="py-2 px-3 text-xs text-blue-700 font-mono">campaign-a</td>
                    </tr>
                    <tr className="border-b border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer" onMouseDown={(e) => { e.preventDefault(); insertPlaceholder('{sub2}'); }}>
                      <td className="py-2 px-3">
                        <code className="text-xs bg-white px-2 py-1 rounded border border-blue-300 font-mono text-blue-900">
                          {'{sub2}'}
                        </code>
                      </td>
                      <td className="py-2 px-3 text-xs text-blue-800">Custom sub-parameter 2</td>
                      <td className="py-2 px-3 text-xs text-blue-700 font-mono">source-123</td>
                    </tr>
                    <tr className="hover:bg-blue-100 transition-colors cursor-pointer" onMouseDown={(e) => { e.preventDefault(); insertPlaceholder('{sub3}'); }}>
                      <td className="py-2 px-3">
                        <code className="text-xs bg-white px-2 py-1 rounded border border-blue-300 font-mono text-blue-900">
                          {'{sub3}'}
                        </code>
                      </td>
                      <td className="py-2 px-3 text-xs text-blue-800">Custom sub-parameter 3</td>
                      <td className="py-2 px-3 text-xs text-blue-700 font-mono">variation-b</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* URL */}
            <div className="mb-4">
              <label htmlFor="url" className="block text-sm font-medium text-zinc-700 mb-2">
                Postback URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                onFocus={(e) => setFocusedInput(e.target)}
                placeholder="https://example.com/postback?click_id={click_id}&event={event}"
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                disabled={isSubmitting}
                required
                pattern="https://.*"
                maxLength={500}
              />
              <p className="mt-1 text-xs text-zinc-500">
                <span className="text-red-600 font-medium">Must be HTTPS with SSL enabled.</span> Use placeholders like {'{click_id}'} for dynamic data.
              </p>
            </div>

            {/* Method */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                HTTP Method <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                {(['GET', 'POST'] as PostbackMethod[]).map((m) => (
                  <label key={m} className="flex items-center">
                    <input
                      type="radio"
                      name="method"
                      value={m}
                      checked={method === m}
                      onChange={() => onMethodChange(m)}
                      className="mr-2"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-zinc-700">{m}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Events */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Events <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {events.map((event) => (
                  <label
                    key={event}
                    className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-colors ${
                      selectedEvents.includes(event)
                        ? 'bg-pink-50 border-pink-500 text-pink-700'
                        : 'bg-white border-zinc-300 text-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event)}
                      onChange={() => onEventToggle(event)}
                      className="mr-2"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm font-medium capitalize">{event}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-zinc-500">Select at least one event to track</p>
            </div>

            {/* Headers */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Custom Headers (Optional)
              </label>
              <div className="space-y-2">
                {headers.map((header, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={header.key}
                      onChange={(e) => onHeaderChange(index, 'key', e.target.value)}
                      onFocus={(e) => setFocusedInput(e.target)}
                      placeholder="Header-Name"
                      className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                      disabled={isSubmitting}
                    />
                    <input
                      type="text"
                      value={header.value}
                      onChange={(e) => onHeaderChange(index, 'value', e.target.value)}
                      onFocus={(e) => setFocusedInput(e.target)}
                      placeholder="Value (can use placeholders)"
                      className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                      disabled={isSubmitting}
                    />
                    {headers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemoveHeader(index)}
                        className="text-red-600 hover:text-red-700 p-2"
                        disabled={isSubmitting}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={onAddHeader}
                className="mt-2 text-sm text-pink-600 hover:text-pink-700 font-medium"
                disabled={isSubmitting}
              >
                + Add Header
              </button>
              <p className="mt-1 text-xs text-zinc-500">Add custom HTTP headers (e.g., Authorization, X-Custom-Header)</p>
            </div>

            {/* POST Body Parameters */}
            {method === 'POST' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  POST Body Parameters (Optional)
                </label>
                <div className="space-y-2">
                  {bodyParams.map((param, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={param.key}
                        onChange={(e) => onBodyParamChange(index, 'key', e.target.value)}
                        onFocus={(e) => setFocusedInput(e.target)}
                        placeholder="Parameter Name"
                        className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        disabled={isSubmitting}
                      />
                      <input
                        type="text"
                        value={param.value}
                        onChange={(e) => onBodyParamChange(index, 'value', e.target.value)}
                        onFocus={(e) => setFocusedInput(e.target)}
                        placeholder="Value (can use placeholders)"
                        className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                        disabled={isSubmitting}
                      />
                      {bodyParams.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onRemoveBodyParam(index)}
                          className="text-red-600 hover:text-red-700 p-2"
                          disabled={isSubmitting}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={onAddBodyParam}
                  className="mt-2 text-sm text-pink-600 hover:text-pink-700 font-medium"
                  disabled={isSubmitting}
                >
                  + Add Body Parameter
                </button>
                <p className="mt-1 text-xs text-zinc-500">These will be sent as JSON in the POST request body</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || selectedEvents.length === 0}
                className="px-6 py-2 text-sm font-medium bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Postback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
