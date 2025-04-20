# Super Query Hooks System

This document provides a detailed explanation of the custom React hooks used in the Super Query application. The hooks are organized by feature area to maintain a clean and maintainable codebase.

## Overview

The hooks system is divided into four main categories:

1. **Authentication Hooks** (`/src/hooks/auth/`): user authentication functionality
2. **User Hooks** (`/src/hooks/user/`): user profile management
3. **Content Hooks** (`/src/hooks/content/`): content fetching and manipulation
4. **Admin Hooks** (`/src/hooks/admin/`): administrative functionality

## Authentication Hooks

Located in `/src/hooks/auth/`

### login.ts

Handles user login functionality.

```typescript
import { token } from "@/types";

// Response interface for login API
interface LoginResponse {
  token: string;
}

/**
 * Login hook for user authentication
 * @param formData Object containing username and password
 * @returns JWT token on successful authentication
 */
export default async function login(formData: {
  userName: string;
  password: string;
}): Promise<token> {
  try {
    const response = await fetch('https://rpi.tail707b9c.ts.net/api/v1/Auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data: LoginResponse = await response.json();
    return data.token;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
```

### register.ts

Handles user registration functionality.

```typescript
import { token } from "@/types";

// Response interface for registration API
interface RegisterResponse {
  token: string;
}

/**
 * Registration hook for creating new user accounts
 * @param formData Object containing user registration data
 * @returns JWT token on successful registration
 */
export default async function register(formData: {
  fullName: string;
  userName: string;
  password: string;
}): Promise<token> {
  try {
    const response = await fetch('https://rpi.tail707b9c.ts.net/api/v1/Auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    const data: RegisterResponse = await response.json();
    return data.token;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}
```

### self.ts

Retrieves the current user's profile information.

```typescript
import { token, User } from "@/types";

/**
 * Fetch current user profile information
 * @param formData Object containing authentication token
 * @returns User object with profile information
 */
export default async function self(formData: { token: token }): Promise<User> {
  try {
    const response = await fetch('https://rpi.tail707b9c.ts.net/api/v1/Account/profile', {
      headers: {
        'Authorization': `Bearer ${formData.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
}
```

## User Hooks

Located in `/src/hooks/user/`

### useChangePassword.ts

Manages password change functionality.

```typescript
import { useState } from 'react';

export default function useChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('https://rpi.tail707b9c.ts.net/api/v1/Account/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to change password');
      }
      
      setSuccess('Password changed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changePassword,
    isLoading,
    error,
    success,
    clearMessages: () => {
      setError(null);
      setSuccess(null);
    }
  };
}
```

### useUpdateUsername.ts

Manages username update functionality.

```typescript
import { useState } from 'react';
import self from '@/hooks/auth/self';
import { User } from '@/types';

export default function useUpdateUsername() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateUsername = async (
    username: string, 
    password: string
  ): Promise<User> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('https://rpi.tail707b9c.ts.net/api/v1/Account/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: username,
          currentPassword: password
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update username');
      }
      
      // Refresh user data
      const userData = await self({ token });
      setSuccess('Username updated successfully');
      return userData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update username';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUsername,
    isLoading,
    error,
    success,
    clearMessages: () => {
      setError(null);
      setSuccess(null);
    }
  };
}
```

### useUpdateFullName.ts

Manages full name update functionality.

```typescript
import { useState } from 'react';
import self from '@/hooks/auth/self';
import { User } from '@/types';

export default function useUpdateFullName() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateFullName = async (
    fullName: string, 
    password: string
  ): Promise<User> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('https://rpi.tail707b9c.ts.net/api/v1/Account/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          currentPassword: password
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update full name');
      }
      
      // Refresh user data
      const userData = await self({ token });
      setSuccess('Full name updated successfully');
      return userData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update full name';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateFullName,
    isLoading,
    error,
    success,
    clearMessages: () => {
      setError(null);
      setSuccess(null);
    }
  };
}
```

## Content Hooks

Located in `/src/hooks/content/`

### allUnits.ts

Fetches all available learning units.

```typescript
import { token, Unit } from "@/types";
import { API } from "@/utils/api";

/**
 * Fetch all available units
 * @param formData Object containing authentication token
 * @returns Array of Unit objects
 */
export default async function allUnits(formData: { token: token }): Promise<Unit[]> {
  try {
    return await API.units.getAll<Unit[]>(formData.token);
  } catch (error) {
    console.error('Units fetch error:', error);
    throw error;
  }
}
```

### unitAndExercises.ts

Fetches a specific unit with its exercises.

```typescript
import { token, UnitWithExercises, Exercise } from "@/types";
import { API } from "@/utils/api";

/**
 * Fetch a specific unit with all its exercises
 * @param formData Object containing token and unit ID
 * @returns Unit with exercises array
 */
export default async function unitAndExercises(
  formData: { token: token, id: string }
): Promise<UnitWithExercises> {
  try {
    // First, get the basic unit information
    const unit = await API.units.getById<UnitWithExercises>(formData.token, formData.id);
    
    // Then, get the exercises for this unit
    try {
      const exercises = await API.exercises.getByUnitId<Exercise[]>(formData.token, formData.id);
      
      // Return a combined object
      return {
        ...unit,
        exercises: Array.isArray(exercises) ? exercises : []
      };
    } catch {
      // If we can't get exercises, return the unit with an empty exercises array
      console.warn(`Couldn't load exercises for unit ${formData.id}`);
      return {
        ...unit,
        exercises: []
      };
    }
  } catch (error) {
    console.error('Unit and exercises fetch error:', error);
    throw error;
  }
}
```

### exercise.ts

Fetches a specific exercise.

```typescript
import { token, Exercise } from "@/types";
import { API } from "@/utils/api";

/**
 * Fetch a specific exercise by ID
 * @param formData Object containing token and exercise ID
 * @returns Exercise object
 */
export default async function exerciseFetch(
  formData: { token: token, id: string }
): Promise<Exercise> {
  try {
    return await API.exercises.getById<Exercise>(formData.token, formData.id);
  } catch (error) {
    console.error('Exercise fetch error:', error);
    throw error;
  }
}
```

This hook is particularly important as it's used in both exercise interfaces:

1. In the standard SQL editor interface, it fetches exercise data which is then checked for difficulty level:
   ```typescript
   // In src/app/exercises/[id]/page.tsx
   const response = await exerciseFetch({ token, id });
   
   // Redirect to quiz page for easy level exercises (difficulty === 0)
   if (response.difficulty === 0) {
     router.push(`/exercises/quiz?id=${response.id}`);
     return;
   }
   
   setExercise(response);
   ```

2. In the quiz interface, it fetches the exercise data based on the ID from URL parameters:
   ```typescript
   // In src/app/exercises/quiz/page.tsx
   const exerciseId = searchParams.get('id');
   // ...
   const response = await exerciseFetch({ token, id: exerciseId });
   setExercise(response);
   
   // Parse options from exercise data
   if (response.options) {
     try {
       const parsedOptions = JSON.parse(response.options);
       setOptions(parsedOptions);
     } catch (error) {
       console.error("Error parsing options:", error);
     }
   }
   ```

### userProgress.ts

Fetches user progress statistics.

```typescript
import { token, UserProgress } from "@/types";
import { API } from "@/utils/api";

/**
 * Fetch user progress statistics
 * @param formData Object containing JWT token
 * @returns User progress data
 */
export default async function userProgress(
  formData: { token: token }
): Promise<UserProgress> {
  try {
    return await API.solutions.getStats<UserProgress>(formData.token);
  } catch (error) {
    console.error('Progress stats fetch error:', error);
    throw error;
  }
}
```

## Admin Hooks

Located in `/src/hooks/admin/`

### checkAdmin.ts

Verifies if the current user has admin permissions.

```typescript
import { token } from "@/types";

interface UserResponse {
  role: string;
}

/**
 * Check if current user has admin permissions
 * @param formData Object containing authentication token
 * @returns Boolean indicating admin status
 */
export default async function checkAdmin(
  formData: { token: token }
): Promise<boolean> {
  try {
    const response = await fetch('https://rpi.tail707b9c.ts.net/api/v1/Account/profile', {
      headers: {
        'Authorization': `Bearer ${formData.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to check admin status');
    }
    
    const user: UserResponse = await response.json();
    return user.role === 'Admin';
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}
```

### useAdminForm.ts

Manages form state for admin operations.

```typescript
import { useState } from 'react';
import { UnitData, ExerciseData } from "@/types";
import { API } from "@/utils/api";

interface UseAdminFormProps<T extends UnitData | ExerciseData> {
  initialData?: T;
  onSubmit: (data: T) => Promise<void>;
}

interface UseAdminFormResult<T> {
  data: T;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  handleChange: (name: keyof T, value: unknown) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

/**
 * Custom hook for managing admin forms
 * @param props Form configuration
 * @returns Form management utilities
 */
export default function useAdminForm<T extends UnitData | ExerciseData>(
  props: UseAdminFormProps<T>
): UseAdminFormResult<T> {
  const [data, setData] = useState<T>(props.initialData || {} as T);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (name: keyof T, value: unknown) => {
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await props.onSubmit(data);
      setSuccess('Saved successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setData(props.initialData || {} as T);
    setError(null);
    setSuccess(null);
  };

  return {
    data,
    isLoading,
    error,
    success,
    handleChange,
    handleSubmit,
    resetForm
  };
}
```

## Best Practices

1. **Consistent Error Handling**: All hooks should handle errors consistently and provide meaningful error messages

2. **State Management**: Use the useState hook for managing loading states, error messages, and success notifications

3. **Authentication**: Always check for the presence of a token before making authenticated requests

4. **API Consistency**: Use the centralized API utilities from `utils/api.ts` for making requests when possible

5. **Parameter Naming**: Use consistent parameter naming across hooks (e.g., `formData` for the input object)

6. **Return Types**: Provide proper TypeScript return types for all hooks

7. **Documentation**: Use JSDoc comments to document hook parameters and return values 