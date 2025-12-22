import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Clock, AlertTriangle } from 'lucide-react';
import { useSecurity } from '@/hooks/use-security';

interface SecurityStatusProps {
  showRateLimit?: boolean;
  showCSRF?: boolean;
}

export const SecurityStatus = ({ showRateLimit = true, showCSRF = true }: SecurityStatusProps) => {
  const { rateLimitStatus, canMakeRequest, isLoading } = useSecurity();

  if (!showRateLimit && !showCSRF) return null;

  return (
    <div className="space-y-2">
      {showRateLimit && (
        <Alert className={canMakeRequest() ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <div className="flex items-center gap-2">
            {canMakeRequest() ? (
              <Shield className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className="text-sm">
              {isLoading ? (
                'Checking security status...'
              ) : canMakeRequest() ? (
                <span className="text-green-700">
                  Rate limit: {rateLimitStatus.remainingRequests}/{rateLimitStatus.maxRequests} requests remaining
                </span>
              ) : (
                <span className="text-red-700">
                  Rate limit exceeded. Please wait before trying again.
                </span>
              )}
            </AlertDescription>
          </div>
        </Alert>
      )}
      
      {showCSRF && (
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-700">
            CSRF protection is active
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};