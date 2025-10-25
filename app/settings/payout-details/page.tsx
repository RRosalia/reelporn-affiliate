'use client';

import { useState, useEffect } from 'react';
import PayoutService from '@/lib/services/PayoutService';
import { PayoutOption, PaymentMethod, WireTransferDetails, PaypalDetails, WiseDetails } from '@/lib/types/payout';

export default function PayoutDetailsPage() {
  const [payouts, setPayouts] = useState<PayoutOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('paypal');
  const [showForm, setShowForm] = useState(false);

  // Paypal/Wise fields
  const [email, setEmail] = useState('');

  // Wire transfer fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [iban, setIban] = useState('');
  const [swiftCode, setSwiftCode] = useState('');

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      setIsLoading(true);
      const data = await PayoutService.getAllPayouts();
      setPayouts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setFirstName('');
    setLastName('');
    setBusinessName('');
    setCity('');
    setState('');
    setAddress('');
    setZipCode('');
    setIban('');
    setSwiftCode('');
    setSelectedMethod('paypal');
    setShowForm(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    setSuccessMessage('');

    try {
      let details: WireTransferDetails | PaypalDetails | WiseDetails;

      if (selectedMethod === 'wire') {
        details = {
          first_name: firstName,
          last_name: lastName,
          business_name: businessName || undefined,
          city,
          state: state || undefined,
          address,
          zip_code: zipCode,
          iban,
          swift_code: swiftCode,
        };
      } else {
        details = { email };
      }

      await PayoutService.createPayout({
        method: selectedMethod,
        details,
      });

      setSuccessMessage('Payout option created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      resetForm();
      fetchPayouts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setError('');
      await PayoutService.setDefaultPayout(id);
      fetchPayouts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteConfirmId(id);
    setDeleteConfirmation('');
  };

  const closeDeleteModal = () => {
    setDeleteConfirmId(null);
    setDeleteConfirmation('');
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation !== 'DELETE' || !deleteConfirmId) return;

    setIsDeleting(true);
    setError('');

    try {
      await PayoutService.deletePayout(deleteConfirmId);
      setSuccessMessage('Payout option deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      closeDeleteModal();
      fetchPayouts();
    } catch (err: any) {
      setError(err.message);
      closeDeleteModal();
    } finally {
      setIsDeleting(false);
    }
  };

  const getPayoutLabel = (payout: PayoutOption): string => {
    if (payout.method === 'paypal') {
      return `PayPal - ${(payout.details as PaypalDetails).email}`;
    } else if (payout.method === 'wise') {
      return `Wise - ${(payout.details as WiseDetails).email}`;
    } else {
      const details = payout.details as WireTransferDetails;
      return `Wire Transfer - ${details.first_name} ${details.last_name}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          {successMessage}
        </div>
      )}

      {/* Existing Payout Options */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Payout Options</h2>
            <p className="text-sm text-zinc-600 mt-1">Manage your payment methods</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors"
          >
            {showForm ? 'Cancel' : 'Add Payout Option'}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-zinc-500">Loading payout options...</div>
        ) : payouts.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            No payout options configured yet. Add one to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {payouts.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg hover:border-pink-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="default_payout"
                    checked={payout.is_default}
                    onChange={() => handleSetDefault(payout.id)}
                    className="w-4 h-4 text-pink-500 focus:ring-pink-500"
                  />
                  <div>
                    <p className="font-medium text-zinc-900">{getPayoutLabel(payout)}</p>
                    {payout.is_default && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200 mt-1">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => openDeleteModal(payout.id)}
                  className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 border border-red-300 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Payout Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Add New Payout Option</h3>

          <form onSubmit={handleCreate} className="space-y-4">
            {/* Payment Method Selector */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['paypal', 'wise', 'wire'] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setSelectedMethod(method)}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-colors capitalize ${
                      selectedMethod === method
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-zinc-300 bg-white text-zinc-700 hover:border-pink-300'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Paypal/Wise Fields */}
            {(selectedMethod === 'paypal' || selectedMethod === 'wise') && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={`Enter your ${selectedMethod === 'paypal' ? 'PayPal' : 'Wise'} email`}
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Wire Transfer Fields */}
            {selectedMethod === 'wire' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Business Name <span className="text-zinc-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      State <span className="text-zinc-500">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      IBAN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      required
                      placeholder="GB29 NWBK 6016 1331 9268 19"
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      SWIFT/BIC Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={swiftCode}
                      onChange={(e) => setSwiftCode(e.target.value)}
                      required
                      placeholder="NWBKGB2L"
                      className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Add Payout Option'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-zinc-900 mb-2">Delete Payout Option</h2>
            <p className="text-zinc-600 mb-4">
              This action cannot be undone. Type <strong>DELETE</strong> to confirm.
            </p>

            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-4"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Payout Option'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
