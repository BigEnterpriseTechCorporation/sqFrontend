import { useState, useEffect } from 'react';
import { Exercise } from '@/types';
import { API } from '@/utils/api';

/**
 * Type for exercise progress information
 */
export interface ExerciseProgressInfo {
  exerciseId: string;
  isCompleted: boolean;
  attempts: number;
}

/**
 * Custom hook to fetch progress information for exercises
 * Provides loading state and a map of exercise progress by ID
 */
export function useExercisesProgress() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, ExerciseProgressInfo>>({});
  
  // Fetch solved exercises and build a progress map on component mount
  useEffect(() => {
    async function fetchExercisesProgress() {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          return;
        }
        
        // Fetch solved exercises
        const solvedExercises = await API.solutions.getSolved<Exercise[]>(token);
        
        // Build a map of exercise progress information
        const newProgressMap: Record<string, ExerciseProgressInfo> = {};
        
        // Mark solved exercises as completed
        if (Array.isArray(solvedExercises)) {
          solvedExercises.forEach(exercise => {
            newProgressMap[exercise.id] = {
              exerciseId: exercise.id,
              isCompleted: true,
              attempts: 0 // We don't have attempt count from the API initially
            };
          });
        }
        
        // Store the progress map in state
        setProgressMap(newProgressMap);
      } catch (err) {
        console.error('Failed to fetch exercises progress:', err);
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchExercisesProgress();
  }, []);
  
  return { loading, error, progressMap };
} 