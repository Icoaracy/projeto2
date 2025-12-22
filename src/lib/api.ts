const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : 'http://localhost:8080';

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
  token?: string;
}

class ApiClient {
  private baseUrl: string;
  private csrfToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Generate CSRF token for state-changing requests
  private generateCSRFToken(): string {
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    // Fallback for SSR
    return Math.random().toString(36).substring(2, 34);
  }

  // Get CSRF token from server
  async getCSRFToken(): Promise<string> {
    try {
      const response = await this.get<{ token: string }>('/api/csrf');
      if (response.success && response.token) {
        this.csrfToken = response.token;
        return response.token;
      }
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }
    
    // Fallback to client-side generation
    if (!this.csrfToken) {
      this.csrfToken = this.generateCSRFToken();
    }
    return this.csrfToken;
  }

  // Check rate limit status
  async getRateLimitStatus(): Promise<{ remainingRequests: number; maxRequests: number; windowMs: number }> {
    try {
      const response = await this.get('/api/rate-limit');
      if (response.success) {
        return {
          remainingRequests: response.remainingRequests || 0,
          maxRequests: response.maxRequests || 5,
          windowMs: response.windowMs || 60000
        };
      }
    } catch (error) {
      console.error('Failed to get rate limit status:', error);
    }
    
    return { remainingRequests: 5, maxRequests: 5, windowMs: 60000 };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      // Add comprehensive security headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        ...options.headers,
      };

      // Add CSRF token for state-changing operations
      if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method)) {
        if (!this.csrfToken) {
          await this.getCSRFToken();
        }
        if (this.csrfToken) {
          headers['X-CSRF-Token'] = this.csrfToken;
        }
      }

      const response = await fetch(url, {
        headers,
        mode: 'same-origin',
        credentials: 'same-origin',
        redirect: 'error',
        ...options,
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: response.statusText };
      }

      if (!response.ok) {
        // Handle different error scenarios with generic messages
        let errorMessage = 'Request failed';
        
        if (response.status === 429) {
          errorMessage = 'Please wait before trying again';
        } else if (response.status === 403) {
          errorMessage = 'Request failed';
        } else if (response.status === 400) {
          errorMessage = 'Please check your input';
        } else if (response.status >= 500) {
          errorMessage = 'Service temporarily unavailable';
        }
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', {
        endpoint,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  // Method to clear CSRF token if needed
  clearCSRFToken(): void {
    this.csrfToken = null;
  }
}

export const apiClient = new ApiClient();