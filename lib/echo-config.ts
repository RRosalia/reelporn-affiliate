import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for Echo
if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}

let echoInstance: Echo | null = null;

/**
 * Initialize Laravel Echo with Reverb configuration
 */
export function initializeEcho(token?: string): Echo {
  if (typeof window === 'undefined') {
    // Return a dummy instance on server-side
    return {} as Echo;
  }

  const config: any = {
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT) : 8080,
    wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT) : 8080,
    forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
  };

  // Add auth configuration if token is provided
  if (token) {
    config.authEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`;
    config.auth = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
  }

  // Disconnect existing instance if it exists
  if (echoInstance) {
    echoInstance.disconnect();
  }

  echoInstance = new Echo(config);

  // Make Echo available globally
  (window as any).Echo = echoInstance;

  return echoInstance;
}

/**
 * Get the current Echo instance
 */
export function getEcho(): Echo | null {
  return echoInstance;
}

/**
 * Reinitialize Echo with authentication token
 * Call this after user logs in
 */
export function reinitializeEchoWithAuth(token: string): Echo {
  return initializeEcho(token);
}

/**
 * Disconnect Echo
 * Call this when user logs out
 */
export function disconnectEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
    if (typeof window !== 'undefined') {
      (window as any).Echo = null;
    }
  }
}

// Initialize Echo without auth on module import (for public channels)
if (typeof window !== 'undefined') {
  initializeEcho();
}

// TypeScript declarations
declare global {
  interface Window {
    Echo: Echo | null;
    Pusher: typeof Pusher;
  }
}

export default echoInstance;
