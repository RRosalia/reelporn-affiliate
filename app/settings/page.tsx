'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/lib/services/ProfileService';
import { countryService } from '@/lib/services/CountryService';
import { Country } from '@/lib/types/country';

export default function SettingsPage() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [telegram, setTelegram] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProfileData();
    loadCountries();

    // Click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const profile = await profileService.getProfile();
      setCompanyName(profile.company_name || '');
      setNotificationEmail(profile.email || '');
      setContactPerson(profile.contact_person || '');
      setPhone(profile.phone || '');
      setWebsite(profile.website || '');
      setTelegram(profile.telegram || '');
      setAddress(profile.address || '');
      setSelectedCountryId(profile.lc_country_id);
    } catch (error: any) {
      setSaveMessage(error.message || 'Failed to load profile data.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCountries = async () => {
    try {
      const countryList = await countryService.getAllCountries();
      setCountries(countryList);
    } catch (error) {
      console.error('Failed to load countries:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCountryId) {
      setSaveMessage('Please select a country.');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      await profileService.updateProfile({
        company_name: companyName,
        email: notificationEmail,
        lc_country_id: selectedCountryId,
        contact_person: contactPerson || undefined,
        phone: phone || undefined,
        website: website || undefined,
        telegram: telegram || undefined,
        address: address || undefined,
      });

      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
      setIsEditing(false);
    } catch (error: any) {
      setSaveMessage(error.message || 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadProfileData();
  };

  const getSelectedCountry = () => {
    return countries.find(c => c.id === selectedCountryId);
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.official_name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.iso_alpha_2.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-900">Account Information</h2>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Affiliate ID
            </label>
            <input
              type="text"
              value={user?.id || ''}
              disabled
              className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-zinc-50 text-zinc-600 cursor-not-allowed"
            />
            <p className="mt-2 text-xs text-zinc-500">
              Your unique affiliate identifier
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-zinc-300 rounded-lg ${
                isEditing
                  ? 'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                  : 'bg-zinc-50 text-zinc-600 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-zinc-300 rounded-lg ${
                isEditing
                  ? 'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                  : 'bg-zinc-50 text-zinc-600 cursor-not-allowed'
              }`}
            />
            <p className="mt-2 text-xs text-zinc-500">
              This is your contact email. To change your login email, navigate to <a href="/settings/security" className="text-pink-600 hover:text-pink-700 font-medium">Security Settings</a>.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Contact Person
            </label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Enter contact person name"
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-zinc-300 rounded-lg ${
                isEditing
                  ? 'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                  : 'bg-zinc-50 text-zinc-600 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-zinc-300 rounded-lg ${
                isEditing
                  ? 'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                  : 'bg-zinc-50 text-zinc-600 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-zinc-300 rounded-lg ${
                isEditing
                  ? 'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                  : 'bg-zinc-50 text-zinc-600 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Telegram
            </label>
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="@username or telegram link"
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-zinc-300 rounded-lg ${
                isEditing
                  ? 'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                  : 'bg-zinc-50 text-zinc-600 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Address <span className="text-zinc-500 text-xs">(optional)</span>
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              rows={3}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-zinc-300 rounded-lg ${
                isEditing
                  ? 'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                  : 'bg-zinc-50 text-zinc-600 cursor-not-allowed'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Country / Region
            </label>
            <div className="relative" ref={countryDropdownRef}>
              <button
                type="button"
                onClick={() => isEditing && setShowCountryDropdown(!showCountryDropdown)}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-zinc-300 rounded-lg text-left flex items-center justify-between ${
                  isEditing
                    ? 'hover:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                    : 'bg-zinc-50 text-zinc-600 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-2">
                  {getSelectedCountry() ? (
                    <>
                      <span>{getSelectedCountry()!.flag_emoji.utf8}</span>
                      <span>{getSelectedCountry()!.name}</span>
                    </>
                  ) : (
                    <span className="text-zinc-400">Select a country</span>
                  )}
                </span>
                {isEditing && (
                  <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {showCountryDropdown && isEditing && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-zinc-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                  <div className="p-2 border-b border-zinc-200">
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Search countries..."
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCountries.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-zinc-500">No countries found</div>
                    ) : (
                      filteredCountries.map((country) => (
                        <button
                          key={country.id}
                          type="button"
                          onClick={() => {
                            setSelectedCountryId(country.id);
                            setShowCountryDropdown(false);
                            setCountrySearch('');
                          }}
                          className={`w-full px-4 py-2 text-left hover:bg-pink-50 flex items-center gap-2 ${
                            selectedCountryId === country.id ? 'bg-pink-50 text-pink-700' : 'text-zinc-900'
                          }`}
                        >
                          <span>{country.flag_emoji.utf8}</span>
                          <span className="text-sm">{country.name}</span>
                          <span className="text-xs text-zinc-500">({country.iso_alpha_2})</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {saveMessage && (
            <div className={`p-3 rounded-lg text-sm ${
              saveMessage.includes('success')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {saveMessage}
            </div>
          )}

          {isEditing && (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-zinc-300 text-zinc-700 font-medium rounded-lg hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-6">Account Status</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-zinc-100">
            <div>
              <p className="font-medium text-zinc-900">Account Status</p>
              <p className="text-sm text-zinc-500">Your account is currently active</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Active
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-zinc-100">
            <div>
              <p className="font-medium text-zinc-900">Commission Rate</p>
              <p className="text-sm text-zinc-500">Your current commission percentage</p>
            </div>
            <span className="text-2xl font-bold text-pink-600">40%</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-zinc-100">
            <div>
              <p className="font-medium text-zinc-900">Cookie Duration</p>
              <p className="text-sm text-zinc-500">How long leads are tracked (a lead is someone you send to the platform but did not create an account)</p>
            </div>
            <span className="text-lg font-semibold text-zinc-900">60 days</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-zinc-900">Customer Duration</p>
              <p className="text-sm text-zinc-500">You receive money forever for every customer you attract to the platform</p>
            </div>
            <span className="text-lg font-semibold text-green-600">Lifetime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
