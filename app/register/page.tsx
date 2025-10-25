'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SearchableSelect from '@/components/SearchableSelect';
import { countryService } from '@/lib/services/CountryService';
import { Country } from '@/lib/types/country';
import { gtmTrackLead, gtmTrackRegistrationCompleted } from '@/lib/gtm';

function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState<string | number>('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(true);

  const { register } = useAuth();
  const router = useRouter();

  // Fetch countries from API using service
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await countryService.getAllCountries();
        setCountries(data);
      } catch (err) {
        console.error('Failed to fetch countries:', err);
        setError('Failed to load countries. Please refresh the page.');
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Track lead event in GTM
    gtmTrackLead({
      email,
      first_name: firstName,
      last_name: lastName,
      country_id: country,
    });

    setLoading(true);

    try {
      await register(firstName, lastName, email, country);

      // Track registration completion in GTM
      gtmTrackRegistrationCompleted({
        email,
        first_name: firstName,
        last_name: lastName,
      });

      // Redirect to dashboard with success parameter
      router.push('/dashboard?registration_success=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white p-16 flex-col justify-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-32 h-32 border-4 border-zinc-700 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 border-4 border-zinc-700 rounded-full translate-x-32 translate-y-32"></div>

        <div className="relative z-10">
          <h1 className="text-pink-500 text-2xl font-semibold mb-8">reelporn.ai</h1>
          <h2 className="text-5xl font-bold leading-tight mb-6">
            Welcome to the<br />
            Hottest Affiliate<br />
            Program
          </h2>
          <p className="text-xl text-zinc-300">
            Earn 40% on all paid customers.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">
              Complete your account
            </h2>
            <p className="text-zinc-600">
              Please fill out the form to complete your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-zinc-900 mb-1">
                  First name*
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g. John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-zinc-900 mb-1">
                  Last name*
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g. Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-900 mb-1">
                Email*
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Country / Region */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-zinc-900 mb-1">
                Country / Region*
              </label>
              <SearchableSelect
                id="country"
                name="country"
                value={country}
                onChange={(value) => setCountry(value)}
                options={countries.map((c) => ({
                  value: c.id,
                  label: c.name,
                  emoji: c.flag_emoji.img,
                }))}
                placeholder={loadingCountries ? 'Loading countries...' : 'Select a country'}
                disabled={loadingCountries}
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Creating account...' : 'Continue'}
            </button>

            <div className="text-center pt-4">
              <p className="text-sm text-zinc-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-pink-500 hover:text-pink-600">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return <RegisterForm />;
}
