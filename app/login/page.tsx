'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
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
        </div>
      </div>
    </div>
  );
}
