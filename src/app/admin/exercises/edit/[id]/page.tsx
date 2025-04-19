'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Exercise, Unit, difficulty, exerciseType, checkType } from '@/types';

const API_URL = 'https://rpi.tail707b9c.ts.net/api/v1';

export default function EditExercise() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [units, setUnits] = useState<Unit[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Exercise>>({
    title: '',
    description: '',
    unitId: '',
    schema: '',
    difficulty: 0,
    type: 0,
    checkType: 0,
    checkQueryInsert: '',
    checkQuerySelect: '',
    solutionQuery: '',
    options: '',
    queryParts: '',
  });

  // Fetch exercise data and units
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const [exerciseResponse, unitsResponse] = await Promise.all([
          axios.get(`${API_URL}/exercises/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/units`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        // Initialize form with exercise data
        setFormData({
          ...exerciseResponse.data,
        });
        
        setUnits(unitsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load exercise data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, router]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: any = value;
    
    // Parse numeric values appropriately
    if (['difficulty', 'type', 'checkType'].includes(name)) {
      parsedValue = parseInt(value, 10);
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      if (!formData.title?.trim() || !formData.unitId) {
        setError('Title and unit are required fields');
        setIsSubmitting(false);
        return;
      }

      await axios.put(`${API_URL}/exercises/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccessMessage('Exercise updated successfully!');
      
      // Navigate back to exercises list after successful update
      setTimeout(() => {
        router.push('/admin/exercises');
      }, 2000);
    } catch (err) {
      console.error('Error updating exercise:', err);
      setError('Failed to update exercise. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    router.push('/admin/exercises');
  };

  // Difficulty levels (matching backend Difficulty enum)
  const difficultyLevels = [
    { value: 0, label: 'Easy' },
    { value: 1, label: 'Normal' },
    { value: 2, label: 'Hard' },
    { value: 3, label: 'Expert' }
  ];

  // Exercise types (matching backend ExerciseType enum)
  const exerciseTypes = [
    { value: 0, label: 'Select Answer' },
    { value: 1, label: 'Fill Missing Words' }, 
    { value: 2, label: 'Construct Query' },
    { value: 3, label: 'Simple Query' },
    { value: 4, label: 'Complex Query' }
  ];

  // Check types (matching backend CheckType enum)
  const checkTypes = [
    { value: 0, label: 'Compare' },
    { value: 1, label: 'Result' },
    { value: 2, label: 'Custom' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Exercise</h1>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Back to Exercises
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 mb-6 rounded relative" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mb-6 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="unitId" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  id="unitId"
                  name="unitId"
                  value={formData.unitId || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a unit</option>
                  {units.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty || 0}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {difficultyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Exercise Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type || 0}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {exerciseTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="schema" className="block text-sm font-medium text-gray-700 mb-1">
                Schema (SQL)
              </label>
              <textarea
                id="schema"
                name="schema"
                value={formData.schema || ''}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                placeholder="CREATE TABLE..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="checkType" className="block text-sm font-medium text-gray-700 mb-1">
                  Check Type
                </label>
                <select
                  id="checkType"
                  name="checkType"
                  value={formData.checkType || 0}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {checkTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div></div>

              <div>
                <label htmlFor="checkQueryInsert" className="block text-sm font-medium text-gray-700 mb-1">
                  Check Query (Insert)
                </label>
                <textarea
                  id="checkQueryInsert"
                  name="checkQueryInsert"
                  value={formData.checkQueryInsert || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="INSERT INTO..."
                />
              </div>

              <div>
                <label htmlFor="checkQuerySelect" className="block text-sm font-medium text-gray-700 mb-1">
                  Check Query (Select)
                </label>
                <textarea
                  id="checkQuerySelect"
                  name="checkQuerySelect"
                  value={formData.checkQuerySelect || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="SELECT..."
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="solutionQuery" className="block text-sm font-medium text-gray-700 mb-1">
                Solution Query (Correct SQL Solution)
              </label>
              <textarea
                id="solutionQuery"
                name="solutionQuery"
                value={formData.solutionQuery || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                placeholder="SELECT * FROM..."
              />
            </div>

            <div>
              <label htmlFor="queryParts" className="block text-sm font-medium text-gray-700 mb-1">
                Query Parts (JSON for Fill Missing Words or Construct Query)
              </label>
              <textarea
                id="queryParts"
                name="queryParts"
                value={formData.queryParts || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                placeholder="[{...}]"
              />
            </div>

            <div>
              <label htmlFor="options" className="block text-sm font-medium text-gray-700 mb-1">
                Options (JSON for Select Answer)
              </label>
              <textarea
                id="options"
                name="options"
                value={formData.options || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                placeholder="[{...}]"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save Exercise'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 