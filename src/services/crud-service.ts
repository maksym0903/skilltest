import { apiClient } from './api-client';
import { 
  ApiResponse, 
  PaginatedResponse, 
  ListRequest, 
  GetByIdRequest,
  CreateRequest,
  UpdateRequest,
  DeleteRequest 
} from './types';

// Generic CRUD service class
export class CrudService<T, CreateT = Partial<T>, UpdateT = Partial<T>> {
  constructor(private endpoint: string) {}

  // List all items with pagination and filtering
  async list(params: ListRequest = {}): Promise<PaginatedResponse<T>> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.search) queryParams.append('search', params.search);
    
    // Add filters as JSON string
    if (params.filters) {
      queryParams.append('filters', JSON.stringify(params.filters));
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
    
    return apiClient.get<PaginatedResponse<T>>(url);
  }

  // Get item by ID
  async getById({ id }: GetByIdRequest): Promise<ApiResponse<T>> {
    return apiClient.get<ApiResponse<T>>(`${this.endpoint}/${id}`);
  }

  // Create new item
  async create({ data }: CreateRequest<CreateT>): Promise<ApiResponse<T>> {
    return apiClient.post<ApiResponse<T>>(this.endpoint, data);
  }

  // Update existing item
  async update({ id, data }: UpdateRequest<UpdateT>): Promise<ApiResponse<T>> {
    return apiClient.put<ApiResponse<T>>(`${this.endpoint}/${id}`, data);
  }

  // Partial update (PATCH)
  async partialUpdate({ id, data }: UpdateRequest<UpdateT>): Promise<ApiResponse<T>> {
    return apiClient.patch<ApiResponse<T>>(`${this.endpoint}/${id}`, data);
  }

  // Delete item
  async delete({ id }: DeleteRequest): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  // Bulk operations
  async bulkCreate({ data }: { data: CreateT[] }): Promise<ApiResponse<T[]>> {
    return apiClient.post<ApiResponse<T[]>>(`${this.endpoint}/bulk`, { data });
  }

  async bulkUpdate({ data }: { data: { id: string | number; data: UpdateT }[] }): Promise<ApiResponse<T[]>> {
    return apiClient.put<ApiResponse<T[]>>(`${this.endpoint}/bulk`, { data });
  }

  async bulkDelete({ ids }: { ids: (string | number)[] }): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`${this.endpoint}/bulk`, {
      body: JSON.stringify({ ids })
    });
  }
}

// Note: Individual service instances are not exported as they are not used.
// The app uses specific service classes (AppsService, ReposService, etc.) instead.
