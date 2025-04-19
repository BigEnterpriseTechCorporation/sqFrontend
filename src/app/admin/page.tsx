"use client"

import { useState, useEffect } from 'react';
import UnitTitle from '@/components/unitTitle';
import useAdminForm from '@/hooks/useAdminForm';
import FormField from '@/components/FormField';
import FormSubmitButton from '@/components/FormSubmitButton';
import PaginationControls from '@/components/PaginationControls';
import { Unit } from '@/types';
import allUnits from '@/hooks/allUnits';

interface UnitFormData {
  title: string;
  description: string;
}

export default function AdminUnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch units function
  const fetchUnits = async () => {
    setFetchLoading(true);
    setFetchError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFetchError('No authentication token found');
        return;
      }
      const response = await allUnits({ token });
      setUnits(response);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to fetch units');
    } finally {
      setFetchLoading(false);
    }
  };

  const initialValues: UnitFormData = {
    title: '',
    description: ''
  };

  const { 
    formData, 
    error, 
    loading,
    handleChange, 
    handleSubmit,
    handleDelete
  } = useAdminForm<UnitFormData>({
    initialValues,
    endpoint: 'Units',
    onSuccess: fetchUnits
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <UnitTitle title="Create New Unit" />
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Unit Details</h2>
        
        <FormField
          id="title"
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
        />

        <FormField
          id="description"
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          type="textarea"
        />

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <FormSubmitButton
          loading={loading}
          loadingText="Creating..."
          text="Create Unit"
        />
      </form>
      
      {/* Existing Units List */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Existing Units</h2>
        
        {fetchError ? (
          <div className="text-red-500 text-sm mb-4">
            {fetchError}
          </div>
        ) : null}
        
        {fetchLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : units.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No units found</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {units.map((unit) => (
              <li key={unit.id} className="py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-md font-medium">{unit.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {unit.description.length > 100 
                      ? unit.description.substring(0, 100) + '...' 
                      : unit.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="mr-4">Created: {new Date(unit.createdAt).toLocaleDateString()}</span>
                    <span>Exercises: {unit.exerciseCount}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(unit.id)}
                  disabled={loading}
                  className="ml-4 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <PaginationControls
        currentPage="Units"
        nextPage={{
          name: "Exercises",
          href: "/admin/exercises"
        }}
      />
    </main>
  );
} 