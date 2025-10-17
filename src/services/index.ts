// Export all services and utilities
export { apiClient, ApiClient } from './api-client';
export { ApiError } from './api-client';

export { CrudService } from './crud-service';

export * from './types';

// Export domain service
export { DomainsService } from './domains';

// Re-export commonly used types for convenience
export type {
  ApiResponse,
  PaginatedResponse,
  ListRequest,
  GetByIdRequest,
  CreateRequest,
  UpdateRequest,
  DeleteRequest,
  User,
  Repository,
  Application,
  Domain,
  AwsAccount,
  ErrorResponse
} from './types';
