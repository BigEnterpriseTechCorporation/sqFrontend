/**
 * Centralized API utility for making HTTP requests to the backend
 */

const API_BASE_URL = 'https://rpi.tail707b9c.ts.net/api/v1';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

interface ApiOptions {
  method: HttpMethod;
  endpoint: string;
  token: string;
  body?: any;
}

export async function apiRequest<T>({ method, endpoint, token, body }: ApiOptions): Promise<T> {
  try {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': '*/*'
    };

    const config: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    };

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`HTTP error! Status: ${response.status}. ${errorText}`);
    }

    // For DELETE requests or endpoints that don't return data
    if (method === HttpMethod.DELETE || response.status === 204) {
      return {} as T;
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Common API endpoints with typed returns
export const API = {
  // Authentication
  auth: {
    login: <T>(token: string, data: {userName:string, password:string}) =>
      apiRequest<T>({ method: HttpMethod.POST, endpoint: 'Account/login', token, body: data }),
    register: <T>(token: string, data: { userName:string, password:string, fullName:string }) =>
      apiRequest<T>({ method: HttpMethod.POST, endpoint: 'Account/register', token, body: data }),
    self: <T>(token: string) => 
      apiRequest<T>({ method: HttpMethod.GET, endpoint: 'Account/self', token }),
    updateUsername: <T>(token: string, data: { userName: string, currentPassword: string, }) =>
      apiRequest<T>({ method: HttpMethod.PUT, endpoint: 'Account/profile', token, body: data }),
    updateUser: <T>(token: string, data: {userName:string,fullName:string, currentPassword: string, newPassword?: string }) =>
      apiRequest<T>({ method: HttpMethod.PUT, endpoint: 'Account/profile', token, body: data })
  },
  
  // Units
  units: {
    getAll: <T>(token: string) => 
      apiRequest<T>({ method: HttpMethod.GET, endpoint: 'Units', token }),
    getById: <T>(token: string, id: string) => 
      apiRequest<T>({ method: HttpMethod.GET, endpoint: `Units/${id}`, token }),
    create: <T>(token: string, data: any) => 
      apiRequest<T>({ method: HttpMethod.POST, endpoint: 'Units', token, body: data }),
    delete: <T>(token: string, id: string) => 
      apiRequest<T>({ method: HttpMethod.DELETE, endpoint: `Units/${id}`, token }),
    getLikes: <T>(token: string, unitId: string) =>
      apiRequest<T>({ method: HttpMethod.GET, endpoint: `Units/${unitId}/likes`, token }),
    toggleLike: <T>(token: string, unitId: string) =>
      apiRequest<T>({ method: HttpMethod.POST, endpoint: `Units/${unitId}/likes`, token })
  },
  
  // Exercises
  exercises: {
    getByUnitId: <T>(token: string, unitId: string) => 
      apiRequest<T>({ method: HttpMethod.GET, endpoint: `Units/${unitId}/exercises`, token }),
    getById: <T>(token: string, id: string) => 
      apiRequest<T>({ method: HttpMethod.GET, endpoint: `Exercises/${id}`, token }),
    create: <T>(token: string, data: any) => 
      apiRequest<T>({ method: HttpMethod.POST, endpoint: 'Exercises', token, body: data }),
    delete: <T>(token: string, id: string) => 
      apiRequest<T>({ method: HttpMethod.DELETE, endpoint: `Exercises/${id}`, token }),
    getSolution: <T>(token: string, id: string) => 
      apiRequest<T>({ method: HttpMethod.GET, endpoint: `Exercises/${id}/solution`, token }),
    getProgress: <T>(token: string, id: string) => 
      apiRequest<T>({ method: HttpMethod.GET, endpoint: `Exercises/${id}/progress`, token })
  },
  
  // Exercise Solutions and Progress
  solutions: {
    submit: <T>(token: string, exerciseId: string, data: any) =>
      apiRequest<T>({ method: HttpMethod.POST, endpoint: `ExerciseSolutions/${exerciseId}`, token, body: data }),
    getStats: <T>(token: string) =>
      apiRequest<T>({ method: HttpMethod.GET, endpoint: 'ExerciseSolutions/stats', token }),
    getSolved: <T>(token: string) =>
      apiRequest<T>({ method: HttpMethod.GET, endpoint: 'ExerciseSolutions/solved', token }),
    getUnsolved: <T>(token: string) =>
      apiRequest<T>({ method: HttpMethod.GET, endpoint: 'ExerciseSolutions/unsolved', token })
  }
}; 