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

  // Generate CSRF token for state-changing requests
  private generateCSRFToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
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
          this.csrfToken = this.generateCSRFToken();
        }
        headers['X-CSRF-Token'] = this.csrfToken;
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
        // Handle rate limiting specifically
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before trying again.');
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
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