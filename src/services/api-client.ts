'use client';

import { fetchAuthSession } from 'aws-amplify/auth';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Custom error class for API errors
export class ApiError<T = unknown> extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: T
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API client class with JWT authentication
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL || '') {
    if (!baseURL) {
      throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
    }
    this.baseURL = baseURL;
    console.log('API Client initialized with base URL:', this.baseURL);
  }

  // Get the current JWT token from Cognito
  private async getAuthToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession({ forceRefresh: false });
      return session.tokens?.idToken?.toString() || null;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  // Create headers with authentication
  private async createHeaders(customHeaders: Record<string, string> = {}): Promise<Record<string, string>> {
    const token = await this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('Making API request to:', url);
    const headers = await this.createHeaders(options.headers as Record<string, string>);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      if (!response.ok) {
        const errorData = isJson ? await response.json() : await response.text();
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      // Return parsed JSON or text based on content type
      return isJson ? await response.json() : (await response.text()) as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred',
        0,
        error
      );
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for custom instances
export { ApiClient };
