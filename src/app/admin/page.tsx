"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UnitTitle from '@/components/unitTitle';
import FormField from '@/components/FormField';
import FormSubmitButton from '@/components/FormSubmitButton';
import useAdminForm from '@/hooks/useAdminForm';

// Types
interface UnitFormData {
  title: string;
  description: string;
}

interface User {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Unit {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  ownerId: string;
  ownerName: string;
  isActive: boolean;
  exerciseCount: number;
}

interface Exercise {
  id: string;
  createdAt: string;
  updatedAt: string;
  unitId: string;
  unitTitle: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  isActive: boolean;
  schema: string;
  checkType: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  usersByCreationDate: { date: string; count: number }[];
  totalUnits: number;
  totalExercises: number;
  exercisesByType: Record<string, number>;
  exercisesByDifficulty: Record<string, number>;
}

interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export default function AdminPanel() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'units' | 'exercises' | 'stats' | 'create'>('users');
  
  // Data states
  const [users, setUsers] = useState<PaginatedResponse<User> | null>(null);
  const [units, setUnits] = useState<PaginatedResponse<Unit> | null>(null);
  const [exercises, setExercises] = useState<PaginatedResponse<Exercise> | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  
  // Filters and pagination
  const [userPage, setUserPage] = useState(1);
  const [userRole, setUserRole] = useState<string>('');
  const [userSearch, setUserSearch] = useState<string>('');
  
  const [unitPage, setUnitPage] = useState(1);
  const [unitSearch, setUnitSearch] = useState<string>('');
  
  const [exercisePage, setExercisePage] = useState(1);
  const [exerciseType, setExerciseType] = useState<string>('');
  const [exerciseDifficulty, setExerciseDifficulty] = useState<string>('');
  const [exerciseSearch, setExerciseSearch] = useState<string>('');
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create Unit Form
  const initialValues: UnitFormData = {
    title: '',
    description: ''
  };

  const { 
    formData, 
    error: formError, 
    loading: formLoading, 
    handleChange, 
    handleSubmit 
  } = useAdminForm<UnitFormData>({
    initialValues,
    endpoint: 'Units'
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/');
      return;
    }
    
    try {
      const payload = token?.split('.')[1] || storedToken.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      
      if (decodedPayload.role !== 'Admin') {
        router.push('/');
        return;
      }
      
      setToken(storedToken);
      fetchData(activeTab);
    } catch (error) {
      router.push('/');
    }
  }, [router, activeTab]);
  
  const fetchData = async (tab: string) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rpi.tail707b9c.ts.net/api/v1/';
      
      switch (tab) {
        case 'users':
          const usersUrl = new URL(`${baseUrl}admin/users`);
          if (userRole) usersUrl.searchParams.append('role', userRole);
          if (userSearch) usersUrl.searchParams.append('searchTerm', userSearch);
          usersUrl.searchParams.append('page', userPage.toString());
          
          const usersRes = await fetch(usersUrl.toString(), {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!usersRes.ok) throw new Error('Failed to fetch users');
          setUsers(await usersRes.json());
          break;
          
        case 'units':
          const unitsUrl = new URL(`${baseUrl}admin/units`);
          if (unitSearch) unitsUrl.searchParams.append('searchTerm', unitSearch);
          unitsUrl.searchParams.append('page', unitPage.toString());
          
          const unitsRes = await fetch(unitsUrl.toString(), {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!unitsRes.ok) throw new Error('Failed to fetch units');
          setUnits(await unitsRes.json());
          break;
          
        case 'exercises':
          const exercisesUrl = new URL(`${baseUrl}admin/exercises`);
          if (exerciseType) exercisesUrl.searchParams.append('type', exerciseType);
          if (exerciseDifficulty) exercisesUrl.searchParams.append('difficulty', exerciseDifficulty);
          if (exerciseSearch) exercisesUrl.searchParams.append('searchTerm', exerciseSearch);
          exercisesUrl.searchParams.append('page', exercisePage.toString());
          
          const exercisesRes = await fetch(exercisesUrl.toString(), {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!exercisesRes.ok) throw new Error('Failed to fetch exercises');
          setExercises(await exercisesRes.json());
          break;
          
        case 'stats':
          const statsRes = await fetch(`${baseUrl}admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!statsRes.ok) throw new Error('Failed to fetch stats');
          setStats(await statsRes.json());
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserRole = async (userId: string, newRole: string) => {
    if (!token) return;
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rpi.tail707b9c.ts.net/api/v1/';
      const response = await fetch(`${baseUrl}admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (!response.ok) throw new Error('Failed to update user role');
      fetchData('users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };
  
  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    if (!token) return;
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rpi.tail707b9c.ts.net/api/v1/';
      const response = await fetch(`${baseUrl}admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });
      
      if (!response.ok) throw new Error('Failed to update user status');
      fetchData('users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };
  
  const toggleUnitStatus = async (unitId: string, isActive: boolean) => {
    if (!token) return;
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rpi.tail707b9c.ts.net/api/v1/';
      const response = await fetch(`${baseUrl}admin/units/${unitId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });
      
      if (!response.ok) throw new Error('Failed to update unit status');
      fetchData('units');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };
  
  const deleteUnit = async (unitId: string) => {
    if (!token || !confirm('Are you sure you want to delete this unit?')) return;
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rpi.tail707b9c.ts.net/api/v1/';
      const response = await fetch(`${baseUrl}admin/units/${unitId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to delete unit');
      fetchData('units');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };
  
  const toggleExerciseStatus = async (exerciseId: string, isActive: boolean) => {
    if (!token) return;
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rpi.tail707b9c.ts.net/api/v1/';
      const response = await fetch(`${baseUrl}admin/exercises/${exerciseId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });
      
      if (!response.ok) throw new Error('Failed to update exercise status');
      fetchData('exercises');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };
  
  const deleteExercise = async (exerciseId: string) => {
    if (!token || !confirm('Are you sure you want to delete this exercise?')) return;
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rpi.tail707b9c.ts.net/api/v1/';
      const response = await fetch(`${baseUrl}admin/exercises/${exerciseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to delete exercise');
      fetchData('exercises');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <UnitTitle title="Admin Panel" />
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'units' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('units')}
        >
          Units
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'exercises' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('exercises')}
        >
          Exercises
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'stats' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'create' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('create')}
        >
          Create Unit
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="flex flex-wrap mb-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select 
                className="p-2 border rounded"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input 
                type="text" 
                className="p-2 border rounded"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users..."
              />
            </div>
            
            <div className="flex items-end">
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => fetchData('users')}
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center p-4">Loading...</div>
          ) : users ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">User Name</th>
                      <th className="py-2 px-4 border">Full Name</th>
                      <th className="py-2 px-4 border">Email</th>
                      <th className="py-2 px-4 border">Role</th>
                      <th className="py-2 px-4 border">Status</th>
                      <th className="py-2 px-4 border">Created At</th>
                      <th className="py-2 px-4 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.items.map((user) => (
                      <tr key={user.id}>
                        <td className="py-2 px-4 border">{user.userName}</td>
                        <td className="py-2 px-4 border">{user.fullName}</td>
                        <td className="py-2 px-4 border">{user.email}</td>
                        <td className="py-2 px-4 border">{user.role}</td>
                        <td className="py-2 px-4 border">
                          <span className={`inline-block rounded-full px-2 ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-2 px-4 border">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-2 px-4 border">
                          <div className="flex space-x-2">
                            <select
                              className="p-1 border rounded text-sm"
                              value={user.role}
                              onChange={(e) => updateUserRole(user.id, e.target.value)}
                            >
                              <option value="Member">Member</option>
                              <option value="Admin">Admin</option>
                            </select>
                            
                            <button
                              className={`text-sm px-2 py-1 rounded ${user.isActive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                              onClick={() => toggleUserStatus(user.id, !user.isActive)}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div>
                  Showing page {users.page} of {users.totalPages} ({users.totalCount} total users)
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={!users.hasPreviousPage}
                    onClick={() => {
                      setUserPage(prev => prev - 1);
                      fetchData('users');
                    }}
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={!users.hasNextPage}
                    onClick={() => {
                      setUserPage(prev => prev + 1);
                      fetchData('users');
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-4">No user data available</div>
          )}
        </div>
      )}
      
      {/* Units Tab */}
      {activeTab === 'units' && (
        <div>
          <div className="flex flex-wrap mb-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input 
                type="text" 
                className="p-2 border rounded"
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
                placeholder="Search units..."
              />
            </div>
            
            <div className="flex items-end">
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => fetchData('units')}
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center p-4">Loading...</div>
          ) : units ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Title</th>
                      <th className="py-2 px-4 border">Description</th>
                      <th className="py-2 px-4 border">Owner</th>
                      <th className="py-2 px-4 border">Exercises</th>
                      <th className="py-2 px-4 border">Status</th>
                      <th className="py-2 px-4 border">Created At</th>
                      <th className="py-2 px-4 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {units.items.map((unit) => (
                      <tr key={unit.id}>
                        <td className="py-2 px-4 border">{unit.title}</td>
                        <td className="py-2 px-4 border">{unit.description}</td>
                        <td className="py-2 px-4 border">{unit.ownerName}</td>
                        <td className="py-2 px-4 border">{unit.exerciseCount}</td>
                        <td className="py-2 px-4 border">
                          <span className={`inline-block rounded-full px-2 ${unit.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {unit.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-2 px-4 border">{new Date(unit.createdAt).toLocaleDateString()}</td>
                        <td className="py-2 px-4 border">
                          <div className="flex space-x-2">
                            <button
                              className={`text-sm px-2 py-1 rounded ${unit.isActive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                              onClick={() => toggleUnitStatus(unit.id, !unit.isActive)}
                            >
                              {unit.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            
                            <button
                              className="text-sm px-2 py-1 rounded bg-red-600 text-white"
                              onClick={() => deleteUnit(unit.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div>
                  Showing page {units.page} of {units.totalPages} ({units.totalCount} total units)
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={!units.hasPreviousPage}
                    onClick={() => {
                      setUnitPage(prev => prev - 1);
                      fetchData('units');
                    }}
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={!units.hasNextPage}
                    onClick={() => {
                      setUnitPage(prev => prev + 1);
                      fetchData('units');
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-4">No unit data available</div>
          )}
        </div>
      )}
      
      {/* Exercises Tab */}
      {activeTab === 'exercises' && (
        <div>
          <div className="flex flex-wrap mb-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select 
                className="p-2 border rounded"
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="SimpleQuery">Simple Query</option>
                <option value="ComplexQuery">Complex Query</option>
                <option value="SelectAnswer">Select Answer</option>
                <option value="FillMissingWords">Fill Missing Words</option>
                <option value="ConstructQuery">Construct Query</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select 
                className="p-2 border rounded"
                value={exerciseDifficulty}
                onChange={(e) => setExerciseDifficulty(e.target.value)}
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Normal">Normal</option>
                <option value="Hard">Hard</option>
                <option value="UltraHard">Ultra Hard</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input 
                type="text" 
                className="p-2 border rounded"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                placeholder="Search exercises..."
              />
            </div>
            
            <div className="flex items-end">
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => fetchData('exercises')}
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center p-4">Loading...</div>
          ) : exercises ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Title</th>
                      <th className="py-2 px-4 border">Unit</th>
                      <th className="py-2 px-4 border">Type</th>
                      <th className="py-2 px-4 border">Difficulty</th>
                      <th className="py-2 px-4 border">Status</th>
                      <th className="py-2 px-4 border">Created At</th>
                      <th className="py-2 px-4 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercises.items.map((exercise) => (
                      <tr key={exercise.id}>
                        <td className="py-2 px-4 border">{exercise.title}</td>
                        <td className="py-2 px-4 border">{exercise.unitTitle}</td>
                        <td className="py-2 px-4 border">{exercise.type}</td>
                        <td className="py-2 px-4 border">{exercise.difficulty}</td>
                        <td className="py-2 px-4 border">
                          <span className={`inline-block rounded-full px-2 ${exercise.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {exercise.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-2 px-4 border">{new Date(exercise.createdAt).toLocaleDateString()}</td>
                        <td className="py-2 px-4 border">
                          <div className="flex space-x-2">
                            <button
                              className={`text-sm px-2 py-1 rounded ${exercise.isActive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                              onClick={() => toggleExerciseStatus(exercise.id, !exercise.isActive)}
                            >
                              {exercise.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            
                            <button
                              className="text-sm px-2 py-1 rounded bg-red-600 text-white"
                              onClick={() => deleteExercise(exercise.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div>
                  Showing page {exercises.page} of {exercises.totalPages} ({exercises.totalCount} total exercises)
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={!exercises.hasPreviousPage}
                    onClick={() => {
                      setExercisePage(prev => prev - 1);
                      fetchData('exercises');
                    }}
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={!exercises.hasNextPage}
                    onClick={() => {
                      setExercisePage(prev => prev + 1);
                      fetchData('exercises');
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-4">No exercise data available</div>
          )}
        </div>
      )}
      
      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div>
          {loading ? (
            <div className="text-center p-4">Loading...</div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">User Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded">
                    <div className="text-sm text-gray-500">Total Users</div>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <div className="text-sm text-gray-500">Active Users</div>
                    <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded">
                    <div className="text-sm text-gray-500">Admin Users</div>
                    <div className="text-2xl font-bold">{stats.adminUsers}</div>
                  </div>
                </div>
                
                <h4 className="text-md font-medium mt-6 mb-2">New Users by Date</h4>
                <div className="h-40 bg-gray-50 p-2 rounded">
                  {/* Simple bar chart implementation */}
                  <div className="flex h-full items-end">
                    {stats.usersByCreationDate.map((item, i) => (
                      <div key={i} className="flex-1 mx-1">
                        <div 
                          className="bg-blue-500 rounded-t"
                          style={{ 
                            height: `${(item.count / Math.max(...stats.usersByCreationDate.map(d => d.count))) * 100}%` 
                          }}
                        ></div>
                        <div className="text-xs mt-1 truncate">{new Date(item.date).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Content Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50 p-4 rounded">
                    <div className="text-sm text-gray-500">Total Units</div>
                    <div className="text-2xl font-bold">{stats.totalUnits}</div>
                  </div>
                  <div className="bg-teal-50 p-4 rounded">
                    <div className="text-sm text-gray-500">Total Exercises</div>
                    <div className="text-2xl font-bold">{stats.totalExercises}</div>
                  </div>
                </div>
                
                <h4 className="text-md font-medium mt-6 mb-2">Exercise Types</h4>
                <div className="space-y-2">
                  {Object.entries(stats.exercisesByType).map(([type, count]) => (
                    <div key={type} className="flex items-center">
                      <div className="w-1/3 text-sm">{type}</div>
                      <div className="w-2/3 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${(count / stats.totalExercises) * 100}%` }}
                        ></div>
                      </div>
                      <div className="ml-2 text-sm">{count}</div>
                    </div>
                  ))}
                </div>
                
                <h4 className="text-md font-medium mt-6 mb-2">Exercise Difficulty</h4>
                <div className="space-y-2">
                  {Object.entries(stats.exercisesByDifficulty).map(([difficulty, count]) => (
                    <div key={difficulty} className="flex items-center">
                      <div className="w-1/3 text-sm">{difficulty}</div>
                      <div className="w-2/3 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            difficulty === 'Easy' ? 'bg-green-500' :
                            difficulty === 'Normal' ? 'bg-blue-500' :
                            difficulty === 'Hard' ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${(count / stats.totalExercises) * 100}%` }}
                        ></div>
                      </div>
                      <div className="ml-2 text-sm">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-4">No statistics available</div>
          )}
        </div>
      )}
      
      {/* Create Unit Tab */}
      {activeTab === 'create' && (
        <div>
          <h3 className="text-lg font-medium mb-4">Create New Unit</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
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

            {formError && (
              <div className="text-red-500 text-sm">
                {formError}
              </div>
            )}

            <FormSubmitButton
              loading={formLoading}
              loadingText="Creating..."
              text="Create Unit"
            />
          </form>
        </div>
      )}
    </main>
  );
} 