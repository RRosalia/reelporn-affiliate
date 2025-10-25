'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white p-16 flex-col justify-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-32 h-32 border-4 border-zinc-700 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 border-4 border-zinc-700 rounded-full translate-x-32 translate-y-32"></div>

        <div className="relative z-10">
          <h1 className="text-pink-500 text-2xl font-semibold mb-8">reelporn.ai</h1>
          <h2 className="text-5xl font-bold leading-tight mb-6">
            Join the<br />
            Hottest Affiliate<br />
            Program
          </h2>
          <p className="text-xl text-zinc-300 mb-8">
            Earn 40% commission on all paid customers.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-white font-semibold">Generous Commission</p>
                <p className="text-zinc-400 text-sm">Earn 40% on every paying customer you refer</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-white font-semibold">60-Day Cookie</p>
                <p className="text-zinc-400 text-sm">Your referrals are tracked for 60 days</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-white font-semibold">Real-Time Tracking</p>
                <p className="text-zinc-400 text-sm">Monitor your earnings and performance instantly</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - CTA Section */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-pink-500 text-2xl font-semibold">reelporn.ai</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">
              Welcome to Our Affiliate Program
            </h2>
            <p className="text-zinc-600 text-lg leading-relaxed mb-6">
              Start earning today by promoting reelporn.ai. Get access to exclusive marketing materials,
              real-time analytics, and dedicated support to maximize your earnings.
            </p>

            {/* Mobile Features */}
            <div className="lg:hidden space-y-3 mb-6">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-zinc-700">40% commission on paid customers</p>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-zinc-700">60-day cookie tracking</p>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-zinc-700">Real-time tracking & analytics</p>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-zinc-900 mb-3">How It Works</h3>
              <ol className="space-y-2 text-zinc-600 text-sm">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white text-xs font-bold mr-3 flex-shrink-0">1</span>
                  <span>Sign up for a free affiliate account</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white text-xs font-bold mr-3 flex-shrink-0">2</span>
                  <span>Get your unique referral links and promotional materials</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white text-xs font-bold mr-3 flex-shrink-0">3</span>
                  <span>Share your links with your audience</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white text-xs font-bold mr-3 flex-shrink-0">4</span>
                  <span>Earn 40% commission for every paying customer within 60 days</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/register" className="block">
              <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition-colors">
                Create Free Account
              </button>
            </Link>
            <Link href="/login" className="block">
              <button className="w-full bg-white hover:bg-zinc-50 text-zinc-900 font-semibold py-3 rounded-lg border-2 border-zinc-900 transition-colors">
                Sign In
              </button>
            </Link>
          </div>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Join hundreds of affiliates already earning with reelporn.ai
          </p>
        </div>
      </div>
    </div>
  );
}
