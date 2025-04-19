# API Utility Documentation

## Overview

The API utility (`src/utils/api.ts`) provides a centralized interface for making HTTP requests to the backend. It standardizes error handling, authentication, and response processing.

## Core Functions

### `apiRequest<T>(options: ApiOptions): Promise<T>`

A generic function that handles all HTTP requests to the API.

**Parameters:**
- `options: ApiOptions` - Configuration for the request
  - `method: HttpMethod` - HTTP method (GET, POST, PUT, DELETE)
  - `endpoint: string` - API endpoint path
  - `token: string` - JWT authentication token
  - `body?: any` - Optional request body for POST and PUT requests

**Returns:**
- `Promise<T>` - Promise resolving to the response data with type T

**Error Handling:**
- Throws error for non-2xx responses
- Includes response status and error text in thrown errors
- Logs errors to console with endpoint information

## API Interface

The API utility exposes a structured interface for accessing different parts of the API:

### Authentication

```typescript
auth: {
  login: <T>(token: string, data: any) => Promise<T>,
  register: <T>(token: string, data: any) => Promise<T>,
  self: <T>(token: string) => Promise<T>
}
```

- **login** - Authenticates a user and returns a token
- **register** - Creates a new user account and returns a token
- **self** - Gets the current user profile information

### Units

```typescript
units: {
  getAll: <T>(token: string) => Promise<T>,
  getById: <T>(token: string, id: string) => Promise<T>,
  create: <T>(token: string, data: any) => Promise<T>,
  delete: <T>(token: string, id: string) => Promise<T>
}
```

- **getAll** - Retrieves all units
- **getById** - Gets a specific unit by ID
- **create** - Creates a new unit
- **delete** - Deletes a unit by ID

### Exercises

```typescript
exercises: {
  getByUnitId: <T>(token: string, unitId: string) => Promise<T>,
  getById: <T>(token: string, id: string) => Promise<T>,
  create: <T>(token: string, data: any) => Promise<T>,
  delete: <T>(token: string, id: string) => Promise<T>
}
```

- **getByUnitId** - Gets all exercises for a specific unit
- **getById** - Gets a specific exercise by ID
- **create** - Creates a new exercise
- **delete** - Deletes an exercise by ID

## Usage Examples

### Fetching Data with Type Safety

```typescript
import { API } from '@/utils/api';
import { Unit } from '@/types';

async function fetchUnits(token: string): Promise<Unit[]> {
  try {
    return await API.units.getAll<Unit[]>(token);
  } catch (error) {
    console.error('Failed to fetch units:', error);
    throw error;
  }
}
```

### Creating Data

```typescript
import { API } from '@/utils/api';

async function createUnit(token: string, unitData: any): Promise<void> {
  try {
    await API.units.create(token, unitData);
    console.log('Unit created successfully');
  } catch (error) {
    console.error('Failed to create unit:', error);
    throw error;
  }
}
```

### Deleting Data

```typescript
import { API } from '@/utils/api';

async function deleteExercise(token: string, exerciseId: string): Promise<boolean> {
  try {
    await API.exercises.delete(token, exerciseId);
    return true;
  } catch (error) {
    console.error('Failed to delete exercise:', error);
    return false;
  }
}
```

## Error Handling

The API utility provides consistent error handling:

1. Non-2xx HTTP responses are converted to errors
2. Error messages include HTTP status and response body when available
3. All errors are logged to the console
4. Original errors are propagated to callers for further handling

## Best Practices

1. Always provide explicit types when calling API methods
2. Handle errors appropriately at the call site
3. Use the API utility for all backend communication
4. For authentication endpoints (login/register), use an empty string as the token 