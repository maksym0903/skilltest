# API Infrastructure

This directory contains the complete API infrastructure for making authenticated requests to your backend services.

## 🏗️ Architecture Overview

### **Authentication Flow**
1. **User authenticates** via AWS Cognito
2. **JWT ID Token** is automatically attached to all API requests
3. **Backend validates** the token and processes the request
4. **Response** is returned with proper error handling

### **File Structure**
```
src/services/
├── api-client.ts       # Core API client with JWT authentication
├── crud-service.ts     # Generic CRUD operations
├── types.ts           # TypeScript interfaces
├── api-utils.ts       # Utility functions
├── example-usage.ts   # Usage examples
└── index.ts          # Main exports
```

## 🚀 Quick Start

### 1. **Basic API Call**
```typescript
import { apiClient } from '@/services';

// GET request with automatic JWT token
const data = await apiClient.get('/users');
```

### 2. **CRUD Operations**
```typescript
import { repositoriesService } from '@/services';

// Create
const newRepo = await repositoriesService.create({
  data: { name: 'my-repo', description: 'A new repository' }
});

// Read
const repo = await repositoriesService.getById({ id: '123' });

// Update
const updatedRepo = await repositoriesService.update({
  id: '123',
  data: { description: 'Updated description' }
});

// Delete
await repositoriesService.delete({ id: '123' });
```

### 3. **List with Pagination**
```typescript
const response = await repositoriesService.list({
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  search: 'react',
  filters: { isPublic: true }
});
```

## 🔧 Configuration

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

### Backend Requirements
Your backend should expect:
- **Authorization header**: `Bearer <jwt-id-token>`
- **Content-Type**: `application/json`
- **Response format**: `{ data: T, message?: string, success: boolean }`

## 📝 API Response Format

### **Success Response**
```json
{
  "data": { /* your data */ },
  "message": "Operation successful",
  "success": true
}
```

### **Paginated Response**
```json
{
  "data": [/* array of items */],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "success": true
}
```

### **Error Response**
```json
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": { /* additional error info */ }
}
```

## 🛠️ Available Services

| Service | Endpoint | Description |
|---------|----------|-------------|
| `repositoriesService` | `/repositories` | Repository management |
| `applicationsService` | `/applications` | Application management |
| `domainsService` | `/domains` | Domain management |
| `awsAccountsService` | `/aws-accounts` | AWS account management |

## 🔄 Error Handling

The API client automatically handles common HTTP errors:

- **401**: Authentication required
- **403**: Permission denied
- **404**: Resource not found
- **409**: Conflict (duplicate)
- **422**: Validation error
- **429**: Rate limited
- **500**: Server error

```typescript
import { handleApiError } from '@/services';

try {
  const data = await apiClient.get('/endpoint');
} catch (error) {
  const message = handleApiError(error);
  console.error(message); // User-friendly error message
}
```

## 🔐 Security Features

- **Automatic JWT token attachment**
- **Token refresh handling**
- **Request/response sanitization**
- **CSRF protection ready**
- **Rate limiting support**

## 📋 Usage Examples

See `example-usage.ts` for comprehensive examples of:
- Basic CRUD operations
- Bulk operations
- Pagination and filtering
- Error handling
- Custom requests

## 🚨 Important Notes

1. **Authentication**: All requests automatically include JWT tokens
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Error Handling**: Consistent error handling across all services
4. **Retry Logic**: Built-in retry mechanism for failed requests
5. **Validation**: Input validation and sanitization utilities

## 🔄 Extending the API

### Adding New Services
```typescript
import { CrudService } from './crud-service';

export const newService = new CrudService('new-endpoint');
```

### Custom API Calls
```typescript
import { apiClient } from './api-client';

// Custom endpoint
const data = await apiClient.post('/custom-endpoint', { custom: 'data' });
```

This infrastructure provides a robust, type-safe, and maintainable way to interact with your backend APIs while ensuring proper authentication and error handling.
