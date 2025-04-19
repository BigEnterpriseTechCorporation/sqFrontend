import { useState } from 'react';
import { API } from '@/utils/api';
import { User } from '@/types';

export default function useUpdateFullName() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateFullName = async (newFullName: string, password: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Call the API to update user's full name
      const response = await API.auth.updateUser<User>(token, {
        fullName: newFullName,
        currentPassword: password
      });

      setSuccess('Full name updated successfully');
      return response;
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
    success
  };
} 