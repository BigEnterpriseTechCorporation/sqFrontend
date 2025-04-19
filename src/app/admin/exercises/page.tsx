"use client"

import { useState, useEffect } from 'react';
import { Unit, difficulty, exerciseType, checkType, Exercise } from '@/types';
import UnitTitle from '@/components/unitTitle';
import allUnits from '@/hooks/allUnits';
import allExercises from '@/hooks/allExercises';
import useAdminForm from '@/hooks/useAdminForm';
import FormField from '@/components/FormField';
import FormSubmitButton from '@/components/FormSubmitButton';
import PaginationControls from '@/components/PaginationControls';

interface ExerciseFormData {
  unitId: string;
  title: string;
  description: string;
  difficulty: difficulty;
  type: exerciseType;
  schema: string;
  checkType: checkType;
  checkQueryInsert: string;
  checkQuerySelect: string;
  options: string;
  queryParts: string;
}

export default function AdminExercisesPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const initialValues: ExerciseFormData = {
    unitId: '',
    title: '',
    description: '',
    difficulty: 0,
    type: 0,
    schema: '',
    checkType: 0,
    checkQueryInsert: '',
    checkQuerySelect: '',
    options: '',
    queryParts: ''
  };

  // Fetch units function
  const fetchUnits = async () => {
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
    }
  };

  // Fetch exercises function
  const fetchExercises = async () => {
    setFetchLoading(true);
    setFetchError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFetchError('No authentication token found');
        return;
      }
      const response = await allExercises({ token });
      setExercises(response);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to fetch exercises');
    } finally {
      setFetchLoading(false);
    }
  };

  const { 
    formData, 
    setFormData,
    error, 
    loading, 
    handleChange, 
    handleSubmit,
    handleDelete
  } = useAdminForm<ExerciseFormData>({
    initialValues,
    endpoint: 'Exercises',
    onSuccess: fetchExercises
  });

  useEffect(() => {
    fetchUnits();
  }, []);
  
  useEffect(() => {
    if (units.length > 0) {
      fetchExercises();
    }
  }, [units]);

  // Difficulty options
  const difficultyOptions = [
    { value: 0, label: 'Easy' },
    { value: 1, label: 'Medium' },
    { value: 2, label: 'Hard' },
    { value: 3, label: 'Ultra-hard' }
  ];

  // Exercise type options
  const typeOptions = [
    { value: 0, label: 'SelectAnswer' },
    { value: 1, label: 'FillMissingWords' },
    { value: 2, label: 'ConstructQuery' },
    { value: 3, label: 'SimpleQuery' },
    { value: 4, label: 'ComplexQuery' }
  ];

  // Check type options
  const checkTypeOptions = [
    { value: 0, label: 'Compare' },
    { value: 1, label: 'Select' },
    { value: 2, label: 'InsertAndSelect' },
  ];

  // Unit options
  const unitOptions = units.map(unit => ({
    value: unit.id,
    label: unit.title
  }));
  
  // Get difficulty label
  const getDifficultyLabel = (difficultyValue: number): string => {
    const option = difficultyOptions.find(opt => opt.value === difficultyValue);
    return option ? option.label : 'Unknown';
  };
  
  // Get exercise type label
  const getTypeLabel = (typeValue: number): string => {
    const option = typeOptions.find(opt => opt.value === typeValue);
    return option ? option.label : 'Unknown';
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <UnitTitle title="Create New Exercise" />
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Exercise Details</h2>
        
        <FormField
          id="unitId"
          name="unitId"
          label="Unit"
          value={formData.unitId}
          onChange={handleChange}
          type="select"
          options={unitOptions}
        />

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

        <FormField
          id="difficulty"
          name="difficulty"
          label="Difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          type="select"
          options={difficultyOptions}
        />

        <FormField
          id="type"
          name="type"
          label="Type"
          value={formData.type}
          onChange={handleChange}
          type="select"
          options={typeOptions}
        />

        <FormField
          id="schema"
          name="schema"
          label="Schema"
          value={formData.schema}
          onChange={handleChange}
          type="textarea"
          monospace={true}
        />

        <FormField
          id="checkType"
          name="checkType"
          label="Check Type"
          value={formData.checkType}
          onChange={handleChange}
          type="select"
          options={checkTypeOptions}
        />

        <FormField
          id="checkQueryInsert"
          name="checkQueryInsert"
          label="Check Query Insert"
          value={formData.checkQueryInsert}
          onChange={handleChange}
          type="textarea"
          monospace={true}
        />

        <FormField
          id="checkQuerySelect"
          name="checkQuerySelect"
          label="Check Query Select"
          value={formData.checkQuerySelect}
          onChange={handleChange}
          type="textarea"
          monospace={true}
        />

        <FormField
          id="options"
          name="options"
          label="Options"
          value={formData.options}
          onChange={handleChange}
          type="textarea"
          monospace={true}
        />

        <FormField
          id="queryParts"
          name="queryParts"
          label="Query Parts"
          value={formData.queryParts}
          onChange={handleChange}
          type="textarea"
          monospace={true}
        />

        {(error || fetchError) && (
          <div className="text-red-500 text-sm">
            {error || fetchError}
          </div>
        )}

        <FormSubmitButton
          loading={loading}
          loadingText="Creating..."
          text="Create Exercise"
        />
      </form>
      
      {/* Existing Exercises List */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Existing Exercises</h2>
        
        {fetchLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : exercises.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No exercises found</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {exercises.map((exercise) => {
              const unitName = units.find(u => u.id === exercise.unitId)?.title || 'Unknown Unit';
              
              return (
                <li key={exercise.id} className="py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium">{exercise.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {exercise.description.length > 80 
                        ? exercise.description.substring(0, 80) + '...' 
                        : exercise.description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs mt-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">{unitName}</span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                        {getTypeLabel(exercise.type)}
                      </span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                        {getDifficultyLabel(exercise.difficulty)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(exercise.id)}
                    disabled={loading}
                    className="ml-4 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      
      <PaginationControls
        currentPage="Exercises"
        previousPage={{
          name: "Units",
          href: "/admin"
        }}
      />
    </main>
  );
} 