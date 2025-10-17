import { apiClient } from './api-client';
import { AppsApiResponse, DeployRequest, DeployResponse, Application } from './types';

// Apps service for handling application-related API calls
export class AppsService {
  // Get all applications
  static async getApps(): Promise<AppsApiResponse> {
    try {
      const response = await apiClient.get<AppsApiResponse>('/api/apps');
      return response;
    } catch (error) {
      console.error('Error fetching apps:', error);
      throw error;
    }
  }

  // Get application by ID
  static async getAppById(id: string): Promise<{ success: boolean; data?: Application; message?: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; data?: Application; message?: string }>(`/api/apps/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching app ${id}:`, error);
      throw error;
    }
  }

  // Create a new application
  static async createApp(appData: {
    name: string;
    description: string;
    org?: string;
    repo_id?: string;
    creation_type: 'create_new' | 'adopt_app';
  }): Promise<{ success: boolean; data?: Application; message?: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; data?: Application; message?: string }>('/api/apps', appData);
      return response;
    } catch (error) {
      console.error('Error creating app:', error);
      throw error;
    }
  }


  // Update an application
  static async updateApp(id: string, updateData: {
    repo_id?: string;
    env_id?: string;
    [key: string]: unknown;
  }): Promise<{ success: boolean; data?: Application; message?: string }> {
    try {
      const response = await apiClient.patch<{ success: boolean; data?: Application; message?: string }>(`/api/apps/${id}`, updateData);
      return response;
    } catch (error) {
      console.error(`Error updating app ${id}:`, error);
      throw error;
    }
  }

  // Delete an application
  static async deleteApp(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message?: string }>(`/api/apps/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting app ${id}:`, error);
      throw error;
    }
  }

  // Deploy an application
  static async deployApp(
    appId: string, 
    environmentId: string, 
    repoId: string,
    buildSettings: { buildCommand: string; baseDirectory: string } = { buildCommand: "npm run build", baseDirectory: "dist" },
    environmentVariables: Record<string, string> = { NODE_ENV: "production" },
    customHeaders: Record<string, string> = {}
  ): Promise<DeployResponse> {
    try {
      const deployRequest: DeployRequest = {
        app_id: appId,
        environment_id: environmentId,
        repo_id: repoId,
        build_settings: buildSettings,
        environment_variables: environmentVariables,
        custom_headers: customHeaders
      };

      const response = await apiClient.post<DeployResponse>(`/api/apps/${appId}/deploy`, deployRequest);
      return response;
    } catch (error) {
      console.error(`Error deploying app ${appId}:`, error);
      throw error;
    }
  }

  // Open/access an application
  static async openApp(id: string): Promise<{ success: boolean; url?: string; message?: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; url?: string; message?: string }>(`/api/apps/${id}/open`);
      return response;
    } catch (error) {
      console.error(`Error opening app ${id}:`, error);
      throw error;
    }
  }
}

// Export a default instance for convenience
export default AppsService;
