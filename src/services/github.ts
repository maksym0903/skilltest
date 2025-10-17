import { apiClient } from './api-client';

// GitHub connection status response types
export interface GitHubStatusData {
  connected: boolean;
  github_username?: string;
  github_id?: number;
  login_url?: string;
}

export interface GitHubStatusResponse {
  success: boolean;
  message: string;
  data: GitHubStatusData;
}

// GitHub service for handling GitHub-related API calls
export class GitHubService {
  // Get GitHub connection status
  static async getConnectionStatus(): Promise<GitHubStatusResponse> {
    try {
      const response = await apiClient.get<GitHubStatusResponse>('/api/repos/auth/github/status');
      return response;
    } catch (error) {
      console.error('Error fetching GitHub connection status:', error);
      throw error;
    }
  }

  // Connect to GitHub (redirect to login URL)
  static async connectToGitHub(loginUrl: string): Promise<void> {
    try {
      // Open the login URL in the same window
      window.location.href = loginUrl;
    } catch (error) {
      console.error('Error connecting to GitHub:', error);
      throw error;
    }
  }
}

// Export a default instance for convenience
export default GitHubService;
