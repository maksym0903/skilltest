import { apiClient } from './api-client';
import { AwsAccount } from './types';

// AWS Accounts API response type
export interface AwsAccountsApiResponse {
  success: boolean;
  data: AwsAccount[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
  };
}

// AWS Accounts service for handling AWS account-related API calls
export class AwsAccountsService {
  // Get all AWS accounts
  static async getAwsAccounts(): Promise<AwsAccountsApiResponse> {
    try {
      const response = await apiClient.get<AwsAccountsApiResponse>('/api/aws-accounts');
      return response;
    } catch (error) {
      console.error('Error fetching AWS accounts:', error);
      throw error;
    }
  }


  // Create a new AWS account
  static async createAwsAccount(accountData: {
    name: string;
    accountId: string;
    region: string;
    registrationMethod?: string;
    accessKeyId: string;
    secretAccessKey: string;
    permissions?: {
      level?: string;
      [key: string]: unknown;
    };
  }): Promise<AwsAccount> {
    try {
      const response = await apiClient.post<{ success: boolean; data: AwsAccount }>('/api/aws-accounts', accountData);
      return response.data;
    } catch (error) {
      console.error('Error creating AWS account:', error);
      throw error;
    }
  }


  // Delete an AWS account
  static async deleteAwsAccount(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message?: string }>(`/api/aws-accounts/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting AWS account ${id}:`, error);
      throw error;
    }
  }

}

// Export a default instance for convenience
export default AwsAccountsService;
