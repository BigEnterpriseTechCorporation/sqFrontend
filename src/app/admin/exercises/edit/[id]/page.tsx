'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Exercise, Unit } from '@/types';
import Editor from '@monaco-editor/react';

const API_URL = 'https://rpi.tail707b9c.ts.net/api/v1';

// Component for editing JSON arrays visually
interface ArrayEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function ArrayEditor({ value, onChange, placeholder }: ArrayEditorProps) {
  // Parse the JSON string to an array, defaulting to empty array if invalid
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [error, setError] = useState('');

  // Parse the JSON string on component mount or when value changes
  useEffect(() => {
    try {
      const parsedValue = value ? JSON.parse(value) : [];
      setItems(Array.isArray(parsedValue) ? parsedValue : []);
      setError('');
    } catch {
      setError('Invalid JSON format');
      setItems([]);
    }
  }, [value]);

  // Update the parent component with the new JSON string
  const updateParent = (updatedItems: string[]) => {
    setItems(updatedItems);
    onChange(JSON.stringify(updatedItems));
  };

  const addItem = () => {
    if (newItem.trim()) {
      const updatedItems = [...items, newItem.trim()];
      updateParent(updatedItems);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    updateParent(updatedItems);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedItems = [...items];
    [updatedItems[index], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[index]];
    updateParent(updatedItems);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-2">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Add new item..."}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>
      
      {items.length > 0 ? (
        <ul className="border border-gray-200 rounded-md divide-y">
          {items.map((item, index) => (
            <li key={index} className="px-4 py-2 flex items-center justify-between">
              <span className="font-mono">{item}</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className={`text-gray-500 hover:text-gray-700 ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                  className={`text-gray-500 hover:text-gray-700 ${index === items.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No items added yet</p>
      )}
    </div>
  );
}

// Component for advanced JSON array editing with key-value pairs
interface OptionsEditorProps {
  value: string;
  onChange: (value: string) => void;
}

function OptionsEditor({ value, onChange }: OptionsEditorProps) {
  // Parse the JSON string to an array of objects, defaulting to empty array if invalid
  const [options, setOptions] = useState<{ text: string, isCorrect: boolean }[]>([]);
  const [newOption, setNewOption] = useState('');
  const [error, setError] = useState('');

  // Parse the JSON string on component mount or when value changes
  useEffect(() => {
    try {
      const parsedValue = value ? JSON.parse(value) : [];
      setOptions(Array.isArray(parsedValue) ? parsedValue : []);
      setError('');
    } catch {
      setError('Invalid JSON format');
      setOptions([]);
    }
  }, [value]);

  // Update the parent component with the new JSON string
  const updateParent = (updatedOptions: { text: string, isCorrect: boolean }[]) => {
    setOptions(updatedOptions);
    onChange(JSON.stringify(updatedOptions));
  };

  const addOption = () => {
    if (newOption.trim()) {
      const updatedOptions = [...options, { text: newOption.trim(), isCorrect: false }];
      updateParent(updatedOptions);
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    updateParent(updatedOptions);
  };

  const toggleCorrect = (index: number) => {
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      isCorrect: !updatedOptions[index].isCorrect,
    };
    updateParent(updatedOptions);
  };

  const moveOption = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === options.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedOptions = [...options];
    [updatedOptions[index], updatedOptions[newIndex]] = [updatedOptions[newIndex], updatedOptions[index]];
    updateParent(updatedOptions);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOption();
    }
  };

  return (
    <div className="space-y-2">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add new option..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={addOption}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>
      
      {options.length > 0 ? (
        <ul className="border border-gray-200 rounded-md divide-y">
          {options.map((option, index) => (
            <li key={index} className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={() => toggleCorrect(index)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className={option.isCorrect ? "font-semibold" : ""}>{option.text}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => moveOption(index, 'up')}
                  disabled={index === 0}
                  className={`text-gray-500 hover:text-gray-700 ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveOption(index, 'down')}
                  disabled={index === options.length - 1}
                  className={`text-gray-500 hover:text-gray-700 ${index === options.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No options added yet</p>
      )}
    </div>
  );
}

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
    let parsedValue: string | number = value;
    
    // Parse numeric values appropriately
    if (['difficulty', 'type', 'checkType'].includes(name)) {
      parsedValue = parseInt(value, 10);
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  // Handle Monaco editor change
  const handleEditorChange = (name: string) => (value: string | undefined) => {
    setFormData(prev => ({ ...prev, [name]: value || '' }));
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

  // Helper to determine if a field should be shown based on exercise type
  const shouldShowField = (field: string, exerciseType: number) => {
    switch (field) {
      case 'options':
        return exerciseType === 0 || exerciseType === 1; // SelectAnswer or FillMissingWords
      case 'queryParts':
        return exerciseType === 1 || exerciseType === 2; // FillMissingWords or ConstructQuery
      case 'solution':
        return true; // Always show solution field
      case 'checkQueries':
        return exerciseType >= 3; // SimpleQuery or ComplexQuery
      default:
        return true;
    }
  };

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
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <Editor
                  height="200px"
                  defaultLanguage="sql"
                  value={formData.schema || ''}
                  onChange={handleEditorChange('schema')}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                  }}
                />
              </div>
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

              {shouldShowField('checkQueries', formData.type || 0) && (
                <>
                  <div>
                    <label htmlFor="checkQueryInsert" className="block text-sm font-medium text-gray-700 mb-1">
                      Check Query (Insert)
                    </label>
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                      <Editor
                        height="150px"
                        defaultLanguage="sql"
                        value={formData.checkQueryInsert || ''}
                        onChange={handleEditorChange('checkQueryInsert')}
                        options={{
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          fontSize: 14,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="checkQuerySelect" className="block text-sm font-medium text-gray-700 mb-1">
                      Check Query (Select)
                    </label>
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                      <Editor
                        height="150px"
                        defaultLanguage="sql"
                        value={formData.checkQuerySelect || ''}
                        onChange={handleEditorChange('checkQuerySelect')}
                        options={{
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          fontSize: 14,
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div>
              <label htmlFor="solutionQuery" className="block text-sm font-medium text-gray-700 mb-1">
                Solution Query (Correct SQL Solution)
              </label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <Editor
                  height="150px"
                  defaultLanguage="sql"
                  value={formData.solutionQuery || ''}
                  onChange={handleEditorChange('solutionQuery')}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                  }}
                />
              </div>
            </div>

            {shouldShowField('queryParts', formData.type || 0) && (
              <div>
                <label htmlFor="queryParts" className="block text-sm font-medium text-gray-700 mb-1">
                  Query Parts (for Fill Missing Words or Construct Query)
                </label>
                <ArrayEditor
                  value={formData.queryParts || ''}
                  onChange={(value: string) => setFormData(prev => ({ ...prev, queryParts: value }))}
                  placeholder="Add a query part..."
                />
              </div>
            )}

            {shouldShowField('options', formData.type || 0) && (
              <div>
                <label htmlFor="options" className="block text-sm font-medium text-gray-700 mb-1">
                  Options (for Select Answer)
                </label>
                {formData.type === 0 ? (
                  <OptionsEditor
                    value={formData.options || ''}
                    onChange={(value: string) => setFormData(prev => ({ ...prev, options: value }))}
                  />
                ) : (
                  <ArrayEditor
                    value={formData.options || ''}
                    onChange={(value: string) => setFormData(prev => ({ ...prev, options: value }))}
                    placeholder="Add an option..."
                  />
                )}
              </div>
            )}

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