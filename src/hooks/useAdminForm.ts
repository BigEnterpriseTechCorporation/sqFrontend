import { useState } from 'react';

interface UseAdminFormProps<T> {
  initialValues: T;
  endpoint: string;
  onSuccess?: () => void;
}

/**
 * Custom hook for handling admin form state, submission, and errors
 */
export default function useAdminForm<T>({ 
  initialValues, 
  endpoint,
  onSuccess 
}: UseAdminFormProps<T>) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'difficulty' || name === 'type' || name === 'checkType' 
        ? parseInt(value) 
        : value
    }));
  };

  // Submit form data to API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`https://rpi.tail707b9c.ts.net/api/v1/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create ${endpoint.toLowerCase()}`);
      }

      const data = await response.json();
      
      // Only update token if it's explicitly provided in the response
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Reset form on success
      setFormData(initialValues);
      alert(`${endpoint.slice(0, -1)} created successfully!`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to create ${endpoint.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    error,
    loading,
    handleChange,
    handleSubmit
  };
} 