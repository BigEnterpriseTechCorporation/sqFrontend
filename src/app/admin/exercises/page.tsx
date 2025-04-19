"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/constants';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Exercise, Unit, difficulty, exerciseType, checkType } from '@/types';

export default function ExercisesAdmin() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [selectedTab, setSelectedTab] = useState<'list' | 'create'>('list');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    unitId: '',
    schema: '',
    difficulty: 1, // Default to Normal
    type: 0, // Default to Simple Query
    checkType: 0, // Default to Compare
    checkQueryInsert: '',
    checkQuerySelect: '',
    solutionQuery: '',
    options: '',
    queryParts: '',
  });

  // Fetch exercises and units
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

        const [exercisesResponse, unitsResponse] = await Promise.all([
          axios.get(`${API_URL}/exercises`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/units`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        const exercisesWithUnits = await Promise.all(
          exercisesResponse.data.map(async (exercise: Exercise) => {
            try {
              const unitResponse = await axios.get(`${API_URL}/units/${exercise.unitId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              return { ...exercise, unit: unitResponse.data };
            } catch (err) {
              return exercise;
            }
          })
        );

        setExercises(exercisesWithUnits);
        setUnits(unitsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load exercises and units. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  // Filter exercises based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredExercises(exercises);
      return;
    }

    const filtered = exercises.filter(exercise => 
      exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.unit?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [searchTerm, exercises]);

  // Filter exercises by unit
  useEffect(() => {
    if (!selectedUnitId) {
      setFilteredExercises(exercises);
      return;
    }

    const filtered = exercises.filter(exercise => exercise.unitId === selectedUnitId);
    setFilteredExercises(filtered);
  }, [selectedUnitId, exercises]);

  // Handle input change for create form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: any = value;
    
    // Parse numeric values appropriately
    if (['difficulty', 'type', 'checkType'].includes(name)) {
      parsedValue = parseInt(value, 10);
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  // Handle create exercise
  const handleCreateExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      if (!formData.title.trim() || !formData.unitId) {
        setCreateError('Title and unit are required fields');
        setIsCreating(false);
        return;
      }

      const response = await axios.post(`${API_URL}/exercises`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Get the unit details for the created exercise
      const unitResponse = await axios.get(`${API_URL}/units/${formData.unitId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Add the new exercise with unit info to the list
      setExercises(prev => [
        ...prev, 
        { ...response.data, unit: unitResponse.data }
      ]);
      
      setSuccessMessage('Exercise created successfully!');
      setFormData({
        title: '',
        description: '',
        unitId: '',
        schema: '',
        difficulty: 1,
        type: 0,
        checkType: 0,
        checkQueryInsert: '',
        checkQuerySelect: '',
        solutionQuery: '',
        options: '',
        queryParts: '',
      });
      
      // Automatically switch to list tab after successful creation
      setTimeout(() => {
        setSelectedTab('list');
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      console.error('Error creating exercise:', err);
      setCreateError('Failed to create exercise. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle delete exercise
  const handleDeleteExercise = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exercise? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      await axios.delete(`${API_URL}/exercises/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove the deleted exercise from the list
      setExercises(prev => prev.filter(exercise => exercise.id !== id));
      setSuccessMessage('Exercise deleted successfully!');
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      console.error('Error deleting exercise:', err);
      setError('Failed to delete exercise. Please try again.');
    }
  };

  // Go to edit exercise page
  const handleEditExercise = (id: string) => {
    router.push(`/admin/exercises/edit/${id}`);
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setSelectedTab('list')}
              className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                selectedTab === 'list'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Exercise List
            </button>
            <button
              onClick={() => setSelectedTab('create')}
              className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                selectedTab === 'create'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Exercise
            </button>
          </nav>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 mt-4 rounded relative" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mt-4 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Exercise List Tab */}
        {selectedTab === 'list' && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
              <div className="w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                >
                  <option value="">All Units</option>
                  {units.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center my-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No exercises found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredExercises.map((exercise) => (
                      <tr key={exercise.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{exercise.title}</div>
                          <div className="text-sm text-gray-500">{exercise.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {exercise.unit?.title || "Unknown Unit"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {exerciseTypes.find(t => t.value === exercise.type)?.label || "Unknown"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditExercise(exercise.id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExercise(exercise.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Create Exercise Tab */}
        {selectedTab === 'create' && (
          <div className="p-6">
            <form onSubmit={handleCreateExercise}>
              {createError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mb-4 rounded relative" role="alert">
                  <span className="block sm:inline">{createError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
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
                    value={formData.unitId}
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
                    value={formData.difficulty}
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
                    value={formData.type}
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

              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="schema" className="block text-sm font-medium text-gray-700 mb-1">
                  Schema (SQL)
                </label>
                <textarea
                  id="schema"
                  name="schema"
                  value={formData.schema}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="CREATE TABLE..."
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="checkType" className="block text-sm font-medium text-gray-700 mb-1">
                  Check Type
                </label>
                <select
                  id="checkType"
                  name="checkType"
                  value={formData.checkType}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="checkQueryInsert" className="block text-sm font-medium text-gray-700 mb-1">
                    Check Query (Insert)
                  </label>
                  <textarea
                    id="checkQueryInsert"
                    name="checkQueryInsert"
                    value={formData.checkQueryInsert}
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
                    value={formData.checkQuerySelect}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    placeholder="SELECT..."
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="solutionQuery" className="block text-sm font-medium text-gray-700 mb-1">
                  Solution Query (Correct SQL Solution)
                </label>
                <textarea
                  id="solutionQuery"
                  name="solutionQuery"
                  value={formData.solutionQuery}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="SELECT * FROM..."
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="queryParts" className="block text-sm font-medium text-gray-700 mb-1">
                  Query Parts (JSON for Fill Missing Words or Construct Query)
                </label>
                <textarea
                  id="queryParts"
                  name="queryParts"
                  value={formData.queryParts}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="[{...}]"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="options" className="block text-sm font-medium text-gray-700 mb-1">
                  Options (JSON for Select Answer)
                </label>
                <textarea
                  id="options"
                  name="options"
                  value={formData.options}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="[{...}]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedTab('list')}
                  className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isCreating ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isCreating ? 'Creating...' : 'Create Exercise'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 