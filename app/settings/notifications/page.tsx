'use client';

import { useState } from 'react';

export default function NotificationsPage() {
  const [emailNotifications, setEmailNotifications] = useState({
    conversions: true,
    payouts: true,
    weeklyReport: false,
    monthlyReport: true,
  });

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">Email Notifications</h2>
        <p className="text-sm text-zinc-600 mb-6">
          Choose which email notifications you want to receive
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-zinc-100">
            <div>
              <p className="font-medium text-zinc-900">Conversion Notifications</p>
              <p className="text-sm text-zinc-500">Get notified when you make a new conversion</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications.conversions}
                onChange={(e) => setEmailNotifications({ ...emailNotifications, conversions: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-zinc-100">
            <div>
              <p className="font-medium text-zinc-900">Payout Notifications</p>
              <p className="text-sm text-zinc-500">Get notified when payouts are processed</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications.payouts}
                onChange={(e) => setEmailNotifications({ ...emailNotifications, payouts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-zinc-100">
            <div>
              <p className="font-medium text-zinc-900">Weekly Report</p>
              <p className="text-sm text-zinc-500">Receive a weekly summary of your performance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications.weeklyReport}
                onChange={(e) => setEmailNotifications({ ...emailNotifications, weeklyReport: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-zinc-900">Monthly Report</p>
              <p className="text-sm text-zinc-500">Receive a monthly summary of your performance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications.monthlyReport}
                onChange={(e) => setEmailNotifications({ ...emailNotifications, monthlyReport: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
            </label>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-200">
          <button
            type="button"
            className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
