import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

export interface RateLimitStatus {
  remainingRequests: number;
  maxRequests: number;
  windowMs: number;
}

export const useSecurity = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus>({
    remainingRequests: 5,
    maxRequests: 5,
    windowMs: 60000
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize CSRF token
  const initializeCSRFToken = useCallback(async () => {
    if (csrfToken) return csrfToken;
    
    setIsLoading(true);
    try {
      const token = await apiClient.getCSRFToken();
      setCsrfToken(token);
      return token;
    } catch (error) {
      console.error('Failed to initialize CSRF token:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [csrfToken]);

  // Update rate limit status
  const updateRateLimitStatus = useCallback(async () => {
    try {
      const status = await apiClient.getRateLimitStatus();
      setRateLimitStatus(status);
      return status;
    } catch (error) {
      console.error('Failed to update rate limit status:', error);
      return rateLimitStatus;
    }
  }, [rateLimitStatus]);

  // Check if user can make a request
  const canMakeRequest = useCallback(() => {
    return rateLimitStatus.remainingRequests > 0;
  }, [rateLimitStatus]);

  // Initialize on mount
  useEffect(() => {
    initializeCSRFToken();
    updateRateLimitStatus();
  }, [initializeCSRFToken, updateRateLimitStatus]);

  return {
    csrfToken,
    rateLimitStatus,
    isLoading,
    canMakeRequest,
    initializeCSRFToken,
    updateRateLimitStatus
  };
};