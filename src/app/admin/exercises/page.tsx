"use client"

import { useState, useEffect } from 'react';
import { Unit, difficulty, exerciseType, checkType } from '@/types';
import UnitTitle from '@/components/unitTitle';
import allUnits from '@/hooks/allUnits';
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

  const { 
    formData, 
    setFormData,
    error, 
    loading, 
    handleChange, 
    handleSubmit 
  } = useAdminForm<ExerciseFormData>({
    initialValues,
    endpoint: 'Exercises'
  });

  useEffect(() => {
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

    fetchUnits();
  }, []);

  // Difficulty options
  const difficultyOptions = [
    { value: 0, label: 'Easy' },
    { value: 1, label: 'Medium' },
    { value: 2, label: 'Hard' },
    { value: 3, label: 'Expert' }
  ];

  // Exercise type options
  const typeOptions = [
    { value: 0, label: 'Type 0' },
    { value: 1, label: 'Type 1' },
    { value: 2, label: 'Type 2' },
    { value: 3, label: 'Type 3' },
    { value: 4, label: 'Type 4' }
  ];

  // Check type options
  const checkTypeOptions = [
    { value: 0, label: 'Type 0' },
    { value: 1, label: 'Type 1' },
    { value: 2, label: 'Type 2' }
  ];

  // Unit options
  const unitOptions = units.map(unit => ({
    value: unit.id,
    label: unit.title
  }));

  return (
    <main className="max-w-4xl mx-auto p-6">
      <UnitTitle title="Create New Exercise" />
      
      <form onSubmit={handleSubmit} className="space-y-6">
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