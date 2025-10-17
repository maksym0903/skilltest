// Generic API response types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common CRUD operation types
export interface CreateRequest<T = unknown> {
  data: T;
}

export interface UpdateRequest<T = unknown> {
  id: string | number;
  data: Partial<T>;
}

export interface DeleteRequest {
  id: string | number;
}

export interface GetByIdRequest {
  id: string | number;
}

export interface ListRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}

// Example entity types (you can modify these based on your actual data models)
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Repository {
  id: string;
  name: string;
  org: string;
  description?: string;
  isPrivate: number; // 0 = public, 1 = private
  status: 'active' | 'inactive' | 'archived';
  branches: string[];
  owner: string;
  defaultBranch: string;
  alias?: string;
  createdAt: number; // timestamp
  environment?: string;
  url?: string; // Repository URL from API response
  app_ids?: string[]; // Array of linked application IDs
  apps?: Array<{
    id: string;
    name: string;
  }>; // Array of linked application objects
}

// Repos API response type
export interface ReposApiResponse {
  success: boolean;
  data: Repository[];
  count: number;
}

export interface Application {
  id: string;
  name: string;
  org?: string | null;
  description?: string;
  status?: string;
  template?: string;
  include_auth?: boolean;
  creation_type?: 'create_new' | 'adopt_app';
  owner_id?: string;
  repo_id?: string; // Repository ID
  repo_name?: string; // Direct repository name from API
  repository?: {
    id: string;
    name: string;
    full_name?: string;
    url?: string;
    org?: string | null;
    is_private?: boolean;
    status?: string;
    app_ids?: string[];
  };
  repositories?: Array<{
    id: string;
    name: string;
    full_name?: string;
    url?: string;
    org?: string | null;
    is_private?: boolean;
    status?: string;
  }>;
  env_id?: string; // Environment ID
  environment?: {
    id: string;
    name: string;
    status?: string;
    branch?: string;
  };
  environments?: Array<{
    id: string;
    name: string;
    status?: string;
    branch?: string;
    subdomain?: string;
    amplify_app_url?: string | null;
    custom_domain?: string | null;
    domain_status?: string | null;
  }>;
  team_members?: unknown[];
  environment_count?: number;
  team_member_count?: number;
  amplify_app_id?: string | null;
  deployed_url?: string | null;
  last_deployment_id?: string | null;
  last_deployment_status?: string | null;
  last_amplify_job_id?: string | null;
  base_domain?: string | null;
  domain_association_id?: string | null;
  domain_status?: string | null;
  custom_certificate_arn?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Apps API response type matching your API structure
export interface AppsApiResponse {
  success: boolean;
  data: Application[];
  count: number;
}

export interface Domain {
  id?: string;
  domain: string; // API returns 'domain' field, not 'name'
  name?: string; // Keep for backward compatibility
  status: 'active' | 'inactive' | 'pending' | 'available';
  ssl_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  app_id?: string;
  environment_id?: string;
  certificate_arn?: string;
  accountId: string; // API returns 'accountId' field
  accountID?: string; // Keep for backward compatibility
  hosted_zone_id: string; // API returns 'hosted_zone_id' field
  available: boolean; // API returns 'available' field
  dns_records?: Array<{
    type: string;
    name: string;
    value: string;
    ttl: number;
  }>;
}

// Domains API response type
export interface DomainsApiResponse {
  success: boolean;
  data: Domain[];
  count: number;
}

// AWS Account related types
export interface AwsAccount {
  id: string;
  accountId: string;
  name: string;
  region: string;
  registrationMethod: string;
  permissions: {
    policies: string[];
    level: string;
  };
  status: string;
  created_at: string;
  created_by: string;
  account_aliases: string[];
}

// Deployment related types
export interface DeployRequest {
  app_id: string;
  environment_id: string;
  repo_id: string;
  build_settings: {
    buildCommand: string;
    baseDirectory: string;
  };
  environment_variables: Record<string, string>;
  custom_headers: Record<string, string>;
}

export interface DeployResponse {
  success: boolean;
  message: string;
  data: {
    deployment_id: string;
    app_id: string;
    environment_id: string;
    repo_id: string;
    branch: string;
    status: string;
    amplify_job_id: string;
    deployed_url: string;
    amplify_app_id: string;
  };
}

// Environment related types
export interface Environment {
  id: string;
  app_id: string;
  name: string;
  amplify_app_id: string | null;
  amplify_app_url: string | null;
  auto_redeploy: boolean;
  aws_account_id: string;
  branch: string;
  created_at: string;
  current_version: string | null;
  custom_domain: string | null;
  dns_records: unknown[];
  domain_status: string | null;
  last_deployment_id: string | null;
  ssl_certificate_id: string | null;
  status: string;
  subdomain: string;
  updated_at: string;
  version_history: unknown[];
  apps?: Array<{
    id: string;
    name: string;
  }>; // Array of linked application objects
}

// Environment API response type matching the provided format
export interface EnvironmentsApiResponse {
  success: boolean;
  data: Environment[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    has_more: boolean;
  };
}

// Error response type
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}
