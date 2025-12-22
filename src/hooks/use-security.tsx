import { useState, useCallback } from 'react';

const REQUEST_LIMIT = 5; // 5 requests per minute
const WINDOW_MS = 60000; // 1 minute

export const useSecurity = () => {
  const [requestTimes, setRequestTimes] = useState<number[]>([]);

  const canMakeRequest = useCallback(() => {
    const now = Date.now();
    const validRequests = requestTimes.filter(time => now - time < WINDOW_MS);
    
    if (validRequests.length >= REQUEST_LIMIT) {
      return false;
    }
    
    setRequestTimes([...validRequests, now]);
    return true;
  }, [requestTimes]);

  return { canMakeRequest };
};