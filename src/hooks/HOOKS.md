# Data Fetching Hooks Documentation

## Overview

The application uses a set of custom hooks to standardize data fetching from the API. These hooks encapsulate common patterns for authentication, error handling, and data transformation.

## Authentication Hooks

### `login(userData: userLogin): Promise<token>`

Authenticates a user with the backend and returns a JWT token.

**Parameters:**
- `userData: userLogin` - User credentials (username and password)

**Returns:**
- `Promise<token>` - JWT token for the authenticated user

**Example:**
```typescript
import login from '@/hooks/login';

async function handleLogin(username: string, password: string) {
  try {
    const token = await login({ username, password });
    localStorage.setItem('token', token);
    // Redirect user or update state
  } catch (error) {
    // Handle authentication error
  }
}
```

### `register(userData: userRegister): Promise<token>`

Creates a new user account and returns a JWT token.

**Parameters:**
- `userData: userRegister` - User registration data (username, password, fullName)

**Returns:**
- `Promise<token>` - JWT token for the newly registered user

**Example:**
```typescript
import register from '@/hooks/register';

async function handleRegister(userData: userRegister) {
  try {
    const token = await register(userData);
    localStorage.setItem('token', token);
    // Redirect user or update state
  } catch (error) {
    // Handle registration error
  }
}
```

### `self(formData: {token: token}): Promise<User>`

Retrieves the current user's profile information.

**Parameters:**
- `formData: {token: token}` - Object containing the JWT token

**Returns:**
- `Promise<User>` - User profile information

**Example:**
```typescript
import self from '@/hooks/self';

async function getUserProfile() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    return await self({ token });
  } catch (error) {
    // Handle error
    return null;
  }
}
```

## Content Hooks

### `allUnits(formData: {token: token}): Promise<Unit[]>`

Fetches all available units.

**Parameters:**
- `formData: {token: token}` - Object containing the JWT token

**Returns:**
- `Promise<Unit[]>` - Array of unit objects

**Example:**
```typescript
import allUnits from '@/hooks/allUnits';

async function fetchUnits() {
  const token = localStorage.getItem('token');
  if (!token) return [];
  
  try {
    return await allUnits({ token });
  } catch (error) {
    console.error('Failed to fetch units:', error);
    return [];
  }
}
```

### `unitAndExercises(formData: {token: token, id: string}): Promise<UnitWithExercises>`

Fetches a specific unit with all its exercises.

**Parameters:**
- `formData: {token: token, id: string}` - Object containing the JWT token and unit ID

**Returns:**
- `Promise<UnitWithExercises>` - Unit with its exercises array

**Example:**
```typescript
import unitAndExercises from '@/hooks/unitAndExercises';

async function fetchUnitWithExercises(unitId: string) {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    return await unitAndExercises({ token, id: unitId });
  } catch (error) {
    console.error(`Failed to fetch unit ${unitId}:`, error);
    return null;
  }
}
```

### `allExercises(formData: {token: token}): Promise<Exercise[]>`

Fetches all exercises across all units.

**Parameters:**
- `formData: {token: token}` - Object containing the JWT token

**Returns:**
- `Promise<Exercise[]>` - Array of all exercises

**Example:**
```typescript
import allExercises from '@/hooks/allExercises';

async function fetchAllExercises() {
  const token = localStorage.getItem('token');
  if (!token) return [];
  
  try {
    return await allExercises({ token });
  } catch (error) {
    console.error('Failed to fetch exercises:', error);
    return [];
  }
}
```

### `exercise(formData: {token: token, id: string}): Promise<Exercise>`

Fetches a specific exercise by ID.

**Parameters:**
- `formData: {token: token, id: string}` - Object containing the JWT token and exercise ID

**Returns:**
- `Promise<Exercise>` - Exercise details

**Example:**
```typescript
import exercise from '@/hooks/exercise';

async function fetchExercise(exerciseId: string) {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    return await exercise({ token, id: exerciseId });
  } catch (error) {
    console.error(`Failed to fetch exercise ${exerciseId}:`, error);
    return null;
  }
}
```

## Admin Hooks

### `useAdminForm<T>(config: UseAdminFormProps<T>): UseAdminFormResult<T>`

A comprehensive hook for handling admin forms, submissions, and deletions.

**Parameters:**
- `config: UseAdminFormProps<T>` - Configuration object with:
  - `initialValues: T` - Initial form values
  - `endpoint: 'Units' | 'Exercises'` - API endpoint
  - `onSuccess?: () => void` - Optional success callback

**Returns:**
- `UseAdminFormResult<T>` - Object containing:
  - `formData: T` - Current form state
  - `setFormData: React.Dispatch<React.SetStateAction<T>>` - Form state setter
  - `error: string | null` - Error message if any
  - `loading: boolean` - Loading state
  - `handleChange: (e: React.ChangeEvent<...>) => void` - Input change handler
  - `handleSubmit: (e: React.FormEvent) => Promise<void>` - Form submit handler
  - `handleDelete: (id: string) => Promise<boolean>` - Delete function

**Example:**
```typescript
import useAdminForm from '@/hooks/useAdminForm';

function AdminUnitForm() {
  const { 
    formData, 
    error, 
    loading, 
    handleChange, 
    handleSubmit,
    handleDelete
  } = useAdminForm({
    initialValues: { title: '', description: '' },
    endpoint: 'Units',
    onSuccess: () => console.log('Operation successful')
  });
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Implementation Details

All hooks leverage the centralized API utility (`src/utils/api.ts`) for making HTTP requests, ensuring consistent:

1. Authentication - JWT tokens are properly included in requests
2. Error handling - Errors are caught and processed consistently
3. Response processing - Responses are properly typed and transformed
4. Logging - API calls and errors are logged consistently

## Best Practices

1. Always check for token existence before making authenticated requests
2. Handle errors appropriately at the component level
3. Provide helpful error messages to users
4. Implement loading states for better UX
5. Use TypeScript for proper type safety 