const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : 'http://localhost:8080';

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private csrfToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Get CSRF token from server
  private async getCSRFToken(): Promise<string> {
    if (this.csrfToken) {
      return this.csrfToken;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/csrf-token`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get CSRF token');
      }

      const data = await response.json();
      this.csrfToken = data.token || '';
      return this.csrfToken;
    } catch (error) {
      console.error('CSRF token error:', error);
      throw new Error('Request failed. Please refresh page.');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      // Add comprehensive security headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        ...(options.headers as Record<string, string>)
      };

      // Add CSRF token for state-changing operations
      if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method)) {
        const token = await this.getCSRFToken();
        headers['X-CSRF-Token'] = token;
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
        data = { message: 'Request processed' };
      }

      if (!response.ok) {
        // Return generic error messages to prevent information disclosure
        let errorMessage = 'Request failed. Please try again.';
        
        if (response.status === 429) {
          errorMessage = 'Too many requests. Please try again later.';
        } else if (response.status === 403) {
          errorMessage = 'Invalid request. Please refresh page.';
        } else if (response.status === 400) {
          errorMessage = 'Invalid input provided.';
        } else if (response.status >= 500) {
          errorMessage = 'An error occurred. Please try again later.';
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
      
      // Re-throw the error with the generic message
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