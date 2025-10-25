import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getEcho } from '@/lib/echo-config';

/**
 * Hook to subscribe to user's private channel
 * Automatically subscribes to `user.{userId}` channel
 */
export function useUserChannel() {
  const { user } = useAuth();
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!user?.id) {
      setChannel(null);
      return;
    }

    const echo = getEcho();
    if (!echo) {
      console.warn('Echo is not initialized');
      return;
    }

    // Subscribe to private user channel
    const userChannel = echo.private(`user.${user.id}`);
    setChannel(userChannel);

    // Cleanup: leave channel when component unmounts
    return () => {
      if (userChannel) {
        echo.leave(`user.${user.id}`);
      }
    };
  }, [user?.id]);

  return channel;
}
