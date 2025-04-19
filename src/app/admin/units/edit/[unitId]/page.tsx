"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/constants';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';

type Unit = {
  id: string;
  title: string;
  description: string;
};

export default function EditUnit() {
  const router = useRouter();
  const params = useParams();
  const unitId = params.unitId as string;
  
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUnit();
  }, [unitId]);

  async function fetchUnit() {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/units/${unitId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const unit = response.data;
      setFormData({
        title: unit.title || '',
        description: unit.description || ''
      });
    } catch (err) {
      console.error('Error fetching unit:', err);
      setError('Failed to load unit. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFormData(prev => ({ ...prev, description: value }));
    }
  };

  const handleUpdateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      await axios.put(`${API_URL}/units/${unitId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccessMessage('Unit updated successfully!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error updating unit:', err);
      setFormError('Failed to update unit. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Unit</h1>
        <Link
          href="/admin/units"
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Units
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mb-6 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 mb-6 rounded relative" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mb-4 rounded relative" role="alert">
              <span className="block sm:inline">{formError}</span>
            </div>
          )}
          
          <form onSubmit={handleUpdateUnit}>
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
            
            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Markdown)
              </label>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border border-gray-300 rounded-md" style={{ height: "300px" }}>
                  <Editor
                    height="300px"
                    defaultLanguage="markdown"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    options={{
                      minimap: { enabled: false },
                      lineNumbers: 'off',
                      scrollBeyondLastLine: false,
                      wordWrap: 'on'
                    }}
                  />
                </div>
                <div className="border border-gray-300 rounded-md p-4 overflow-auto" style={{ height: "300px" }}>
                  <div className="text-sm text-gray-500 mb-2">Preview:</div>
                  <div className="prose prose-sm max-w-none">
                    {formData.description ? (
                      <ReactMarkdown>{formData.description}</ReactMarkdown>
                    ) : (
                      <p className="text-gray-400 italic">Enter markdown in the editor to see a preview here...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
              <Link
                href="/admin/units"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Unit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 