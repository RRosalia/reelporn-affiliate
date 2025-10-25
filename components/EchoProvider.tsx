'use client';

import { useEffect } from 'react';
import '@/lib/echo-config'; // Initialize Echo on import

/**
 * Client-side component to ensure Echo is initialized
 */
export default function EchoProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Echo is already initialized via the import above
    // This component just ensures the import happens on the client side
    console.log('Echo initialized');
  }, []);

  return <>{children}</>;
}
