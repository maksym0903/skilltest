import { apiClient } from './api-client';
import { DomainsApiResponse, Domain } from './types';

// Domains service for handling domain-related API calls
export class DomainsService {
  // Get all domains
  static async getDomains(): Promise<DomainsApiResponse> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { domains: Domain[] };
        message?: string;
      }>('/api/domains/available');
      
      // Transform the response to match our expected structure and add unique IDs
      const domainsWithIds = response.data.domains.map((domain, index) => ({
        ...domain,
        id: `domain-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));
      
      return {
        success: response.success,
        data: domainsWithIds,
        count: domainsWithIds.length
      };
    } catch (error) {
      console.error('Error fetching domains:', error);
      throw error;
    }
  }

  // Get domain by ID
  static async getDomainById(id: string): Promise<{ success: boolean; data?: Domain; message?: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; data?: Domain; message?: string }>(`/api/domains/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching domain ${id}:`, error);
      throw error;
    }
  }

  // Register domains
  static async registerDomains(domainData: {
    userId: string;
    domains: Array<{
      domainName: string;
      accountId: string;
    }>;
    actions?: string[];
    types?: string[];
  }): Promise<{ success: boolean; data?: Domain; message?: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; data?: Domain; message?: string }>('/api/domains/register', domainData);
      return response;
    } catch (error) {
      console.error('Error registering domains:', error);
      throw error;
    }
  }

  // Create a new domain (legacy method for backward compatibility)
  static async createDomain(domainData: {
    name: string;
    app_id?: string;
    environment_id?: string;
    certificate_arn?: string;
  }): Promise<{ success: boolean; data?: Domain; message?: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; data?: Domain; message?: string }>('/api/domains', domainData);
      return response;
    } catch (error) {
      console.error('Error creating domain:', error);
      throw error;
    }
  }

  // Update a domain
  static async updateDomain(id: string, updateData: {
    name?: string;
    status?: string;
    ssl_enabled?: boolean;
    certificate_arn?: string;
    [key: string]: unknown;
  }): Promise<{ success: boolean; data?: Domain; message?: string }> {
    try {
      const response = await apiClient.patch<{ success: boolean; data?: Domain; message?: string }>(`/api/domains/${id}`, updateData);
      return response;
    } catch (error) {
      console.error(`Error updating domain ${id}:`, error);
      throw error;
    }
  }

  // Delete a domain
  static async deleteDomain(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message?: string }>(`/api/domains/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting domain ${id}:`, error);
      throw error;
    }
  }

  // Associate domain with application
  static async associateDomain(
    domainId: string,
    appId: string,
    environmentId: string,
    config: {
      certificateType: 'amplify' | 'custom';
      certificateArn?: string;
      enablePreviewSubdomains: boolean;
      previewPattern?: string;
      environmentMappings: Array<{
        environmentId: string;
        environmentName: string;
        amplifyBranch: string;
        subdomainPrefix: string;
      }>;
    }
  ): Promise<{ success: boolean; message?: string; data?: Domain }> {
    try {
      const response = await apiClient.post<{ success: boolean; message?: string; data?: Domain }>(
        `/api/domains/${domainId}/associate`,
        {
          app_id: appId,
          environment_id: environmentId,
          ...config
        }
      );
      return response;
    } catch (error) {
      console.error(`Error associating domain ${domainId}:`, error);
      throw error;
    }
  }

  // Disassociate domain from application
  static async disassociateDomain(domainId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message?: string }>(`/api/domains/${domainId}/disassociate`);
      return response;
    } catch (error) {
      console.error(`Error disassociating domain ${domainId}:`, error);
      throw error;
    }
  }

  // Get DNS records for domain
  static async getDnsRecords(domainId: string): Promise<{ success: boolean; data?: unknown[]; message?: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; data?: unknown[]; message?: string }>(`/api/domains/${domainId}/dns-records`);
      return response;
    } catch (error) {
      console.error(`Error fetching DNS records for domain ${domainId}:`, error);
      throw error;
    }
  }
}

// Export a default instance for convenience
export default DomainsService;
