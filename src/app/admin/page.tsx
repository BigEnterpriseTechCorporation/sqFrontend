"use client"

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToken } from '@/hooks/auth';

// Types
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

export default function AdminPanel() {
  const router = useRouter();
  const { getToken, hasToken } = useToken();
  const [token, setToken] = useState<string | null>(null);
  
  // Data states
  const [stats, setStats] = useState<Stats | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const baseUrl = 'https://rpi.tail707b9c.ts.net/api/v1/';
      
      const statsRes = await fetch(`${baseUrl}admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!statsRes.ok) throw new Error('Failed to fetch stats');
      setStats(await statsRes.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!hasToken()) {
      router.push('/');
      return;
    }
    
    const storedToken = getToken();
    
    // Check if token exists
    if (!storedToken) {
      router.push('/');
      return;
    }
    
    try {
      const payload = storedToken.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      
      if (decodedPayload.role !== 'Admin') {
        router.push('/');
        return;
      }
      
      setToken(storedToken);
    } catch {
      router.push('/');
    }
  }, [router, hasToken, getToken]);
  
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  return (
    <main className="max-w-6xl mx-auto p-6">
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Stats Tab */}
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
          <div className="text-center p-4">No statistics data available. Please try refreshing the page.</div>
        )}
      </div>
    </main>
  );
} 