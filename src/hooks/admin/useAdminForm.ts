import { useState } from 'react';
import { API } from '@/utils/api';
import type { UnitData, ExerciseData } from '@/utils/api';

interface UseAdminFormProps<T extends UnitData | ExerciseData> {
  initialValues: T;
  endpoint: 'Units' | 'Exercises';
  onSuccess?: () => void;
}

interface UseAdminFormResult<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  error: string | null;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleDelete: (id: string) => Promise<boolean>;
}

/**
 * Custom hook for handling form state and API interactions in admin forms
 * Works with both Units and Exercises endpoints
 */
export default function useAdminForm<T extends UnitData | ExerciseData>({ 
  initialValues, 
  endpoint,
  onSuccess 
}: UseAdminFormProps<T>): UseAdminFormResult<T> {
  const [formData, setFormData] = useState<T>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Submit form data to create a new item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Use the appropriate API method based on the endpoint
      if (endpoint === 'Units') {
        await API.units.create(token, formData as UnitData);
      } else if (endpoint === 'Exercises') {
        await API.exercises.create(token, formData as ExerciseData);
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

  // Delete an item by ID
  const handleDelete = async (id: string): Promise<boolean> => {
    if (!window.confirm(`Are you sure you want to delete this ${endpoint.slice(0, -1)}?`)) {
      return false;
    }
    
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Use the appropriate API method based on the endpoint
      if (endpoint === 'Units') {
        await API.units.delete(token, id);
      } else if (endpoint === 'Exercises') {
        await API.exercises.delete(token, id);
      }

      alert(`${endpoint.slice(0, -1)} deleted successfully!`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to delete ${endpoint.toLowerCase()}`);
      return false;
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
    handleSubmit,
    handleDelete
  };
} 