'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 2FA state
  const [show2FAScreen, setShow2FAScreen] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

  // Check if 2FA is required on page load
  useEffect(() => {
    const require2FA = localStorage.getItem('require_2fa');
    const urlRequire2FA = searchParams.get('require2fa');

    if (require2FA === 'true' || urlRequire2FA === 'true') {
      setShow2FAScreen(true);
      setError('Two-factor authentication is required. Please enter your 6-digit code.');
      localStorage.removeItem('require_2fa'); // Clean up
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);

      // After successful login, check if 2FA is required
      const verifyResponse = await axiosInstance.get('/auth/verify-2fa');
      const { two_factor_required } = verifyResponse.data.data;

      if (two_factor_required) {
        setShow2FAScreen(true);
        setLoading(false);
      } else {
        // No 2FA required, redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      // Check for 2FA error header
      if (err.response?.status === 400 && err.response?.headers?.['x-authentication-error'] === '2fa-missing') {
        setShow2FAScreen(true);
        setLoading(false);
      } else {
        setError(err.response?.data?.message || 'Invalid credentials');
        setLoading(false);
      }
    }
  };

  const handle2FASubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsVerifying2FA(true);

    try {
      const response = await axiosInstance.post('/auth/verify-2fa', {
        code: twoFACode,
      });

      const { token } = response.data.data;

      // Update token in localStorage
      localStorage.setItem('token', token);

      // Fetch user profile with new token
      const profileResponse = await axiosInstance.get('/account/profile');
      const userData = profileResponse.data.data;
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid 2FA code');
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const handleBackToLogin = () => {
    // Clear any 2FA flags
    localStorage.removeItem('require_2fa');

    setShow2FAScreen(false);
    setTwoFACode('');
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShow2FAScreen(false);
    setTwoFACode('');
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Welcome Back Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white p-16 flex-col justify-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-32 h-32 border-4 border-zinc-700 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 border-4 border-zinc-700 rounded-full translate-x-32 translate-y-32"></div>

        <div className="relative z-10">
          <h1 className="text-pink-500 text-2xl font-semibold mb-8">reelporn.ai</h1>
          <h2 className="text-5xl font-bold leading-tight mb-6">
            Welcome<br />
            Back!
          </h2>
          <p className="text-xl text-zinc-300 mb-8">
            Sign in to access your affiliate dashboard.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <p className="text-white font-semibold">Track Your Performance</p>
                <p className="text-zinc-400 text-sm">Monitor clicks, conversions, and earnings in real-time</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <p className="text-white font-semibold">Access Marketing Tools</p>
                <p className="text-zinc-400 text-sm">Get your referral links and promotional materials</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-white font-semibold">Manage Your Earnings</p>
                <p className="text-zinc-400 text-sm">View your commissions and payout history</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-pink-500 text-2xl font-semibold">reelporn.ai</h1>
          </div>

          {!show2FAScreen ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-zinc-900 mb-2">
                  Sign in to your account
                </h2>
                <p className="text-zinc-600">
                  Welcome back! Please enter your credentials.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-900 mb-1">
                Password*
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter your password"
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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

                <div className="text-center pt-4">
                  <p className="text-sm text-zinc-600">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-medium text-pink-500 hover:text-pink-600">
                      Register here
                    </Link>
                  </p>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="mb-8">
                <button
                  onClick={handleBackToLogin}
                  className="text-pink-500 hover:text-pink-600 flex items-center gap-2 mb-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to login
                </button>
                <h2 className="text-3xl font-bold text-zinc-900 mb-2">
                  Two-Factor Authentication
                </h2>
                <p className="text-zinc-600">
                  Enter the 6-digit code from your authenticator app.
                </p>
              </div>

              <form onSubmit={handle2FASubmit} className="space-y-5">
                <div>
                  <label htmlFor="twoFACode" className="block text-sm font-medium text-zinc-900 mb-1">
                    Authentication Code*
                  </label>
                  <input
                    id="twoFACode"
                    name="twoFACode"
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value)}
                    className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-center text-2xl tracking-widest"
                    placeholder="000000"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className={`rounded-lg p-4 border ${
                    error.includes('Two-factor authentication is required')
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <p className={`text-sm ${
                      error.includes('Two-factor authentication is required')
                        ? 'text-blue-800'
                        : 'text-red-800'
                    }`}>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying2FA}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying2FA ? 'Verifying...' : 'Verify'}
                </button>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-sm text-zinc-600 hover:text-zinc-900"
                  >
                    Don't have access? <span className="font-medium text-pink-500 hover:text-pink-600">Logout</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
