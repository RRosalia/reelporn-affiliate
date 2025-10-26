'use client';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { configureEcho } from '@laravel/echo-react';

// Extend Window interface to include Pusher and Echo
declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>;
  }
}

// Make Pusher available globally for Echo
if (typeof window !== 'undefined') {
  window.Pusher = Pusher;
}

/**
 * Initialize Laravel Echo configuration
 * This must be called BEFORE any useEcho hooks are used
 */
let echoConfigured = false;

interface EchoConfig {
  broadcaster: 'reverb' | 'pusher' | 'ably' | 'socket.io' | 'null';
  key: string;
  wsHost: string;
  wsPort: number;
  wssPort: number;
  forceTLS: boolean;
  enabledTransports: string[];
  authEndpoint: string;
  auth?: {
    headers: {
      Authorization: string;
    };
  };
}

interface EchoConnector {
  pusher?: {
    connection: {
      bind: (event: string, callback: (error: Error) => void) => void;
    };
  };
}

/**
 * Echo Channel interface
 */
export interface EchoChannel {
  listen: (event: string, callback: (data: unknown) => void) => EchoChannel;
  listenForWhisper: (event: string, callback: (data: unknown) => void) => EchoChannel;
  notification: (callback: (data: unknown) => void) => EchoChannel;
  stopListening: (event: string) => EchoChannel;
}

export function initializeEcho(authToken?: string | null) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
  const authEndpoint = `${apiUrl}/broadcasting/auth`;

  // Disconnect existing Echo instance if reconfiguring with auth
  if (echoConfigured && window.Echo) {
    window.Echo.disconnect();
  }

  const baseConfig = {
    broadcaster: 'reverb' as const,
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'app-key',
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
    wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT) : 8080,
    wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT) : 8080,
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: authEndpoint, // Always set authEndpoint
  };

  // Add authorization headers if we have a token
  const echoConfig = authToken ? {
    ...baseConfig,
    authorizer: (channel: any) => {
      return {
        authorize: (socketId: string, callback: Function) => {
          fetch(authEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Auth failed: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              callback(null, data);
            })
            .catch((error) => {
              console.error('[Echo] Authorization error:', error);
              callback(error, null);
            });
        },
      };
    },
  } : baseConfig;

  // Configure @laravel/echo-react package
  // @ts-expect-error - configureEcho types are overly strict, but this config is valid
  configureEcho(echoConfig);

  // Create Echo instance and attach to window
  const echoInstance = new Echo<any>(echoConfig);
  window.Echo = echoInstance;

  echoConfigured = true;

  // Add connection event listeners for error tracking
  const connector = echoInstance.connector as EchoConnector;
  if (connector?.pusher) {
    connector.pusher.connection.bind('error', (error: Error) => {
      console.error('[Echo] WebSocket error:', error);
    });
  }

  return echoInstance;
}

/**
 * Get the current Echo instance
 */
export function getEcho(): Echo<any> | null {
  return typeof window !== 'undefined' ? window.Echo : null;
}

/**
 * Reinitialize Echo with authentication token
 * Call this after user logs in
 */
export function reinitializeEchoWithAuth(token: string): Echo<any> {
  return initializeEcho(token);
}

/**
 * Disconnect Echo
 * Call this when user logs out
 */
export function disconnectEcho(): void {
  if (typeof window !== 'undefined' && window.Echo) {
    window.Echo.disconnect();
  }
}

// Initialize Echo immediately when this module is imported (without auth)
if (typeof window !== 'undefined' && !echoConfigured) {
  initializeEcho();
}
