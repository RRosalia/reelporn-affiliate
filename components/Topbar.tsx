'use client';

import { useState } from 'react';

export default function Topbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement actual dark mode functionality
    // This could involve adding/removing a class to the html element
    // or using a context to manage theme state
  };

  const handleHelp = () => {
    // TODO: Open help modal or redirect to help page
    window.open('https://help.reelporn.ai', '_blank');
  };

  return (
    <div className="h-16 bg-white border-b border-zinc-200 flex items-center justify-end px-6 gap-4">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? (
          // Sun icon for light mode
          <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          // Moon icon for dark mode
          <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Help Button */}
      <button
        onClick={handleHelp}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-700"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">Help</span>
      </button>
    </div>
  );
}
