import { apiClient } from './api-client';
import { EnvironmentsApiResponse, Environment } from './types';

export const environmentsService = {
  /**
   * Get all environments with pagination and search
   */
  async getEnvironments(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<EnvironmentsApiResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.per_page) {
      searchParams.append('per_page', params.per_page.toString());
    }
    if (params?.search) {
      searchParams.append('search', params.search);
    }

    const queryString = searchParams.toString();
    const url = `/api/environments${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<EnvironmentsApiResponse>(url);
  },


  /**
   * Get environment by ID
   */
  async getEnvironmentById(id: string): Promise<{ success: boolean; data?: Environment; message?: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; data?: Environment; message?: string }>(`/api/environments/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching environment ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new environment
   */
  async createEnvironment(data: Partial<Environment>): Promise<{ success: boolean; data: Environment; message?: string }> {
    const response = await apiClient.post<{ success: boolean; data: Environment; message?: string }>('/api/environments', data);
    return response;
  },


  /**
   * Delete an environment
   */
  async deleteEnvironment(id: string): Promise<void> {
    await apiClient.delete(`/api/environments/${id}`);
  }
};
