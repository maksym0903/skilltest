import { apiClient } from './api-client';
import { Repository, ReposApiResponse } from './types';

// Repos service for handling repository-related API calls
export class ReposService {
  // Get all repositories
  static async getRepos(): Promise<ReposApiResponse> {
    try {
      const response = await apiClient.get<ReposApiResponse>('/api/repos');
      return response;
    } catch (error) {
      console.error('Error fetching repos:', error);
      throw error;
    }
  }

  // Get repository by ID
  static async getRepoById(id: string): Promise<{ success: boolean; data?: Repository; message?: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; data?: Repository; message?: string }>(`/api/repos/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching repo ${id}:`, error);
      throw error;
    }
  }


  // Create a new repository
  static async createRepo(repoData: {
    name: string;
    description?: string;
    isPrivate: boolean; // true = private, false = public
    appId?: string; // Optional app ID
  }): Promise<Repository> {
    try {
      const response = await apiClient.post<{ success: boolean; data: Repository; message?: string }>('/api/repos', repoData);
      return response.data;
    } catch (error) {
      console.error('Error creating repo:', error);
      throw error;
    }
  }


  // Delete a repository
  static async deleteRepo(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message?: string }>(`/api/repos/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting repo ${id}:`, error);
      throw error;
    }
  }

  // Get organization names
  static async getOrganizationNames(): Promise<{ organization_names: string[]; total: number }> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { organization_names: string[]; total: number };
        message?: string;
      }>('/api/repos/organizations/names');
      return response.data;
    } catch (error) {
      console.error('Error fetching organization names:', error);
      throw error;
    }
  }
}

// Export a default instance for convenience
export default ReposService;
