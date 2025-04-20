import { useState, useEffect, useRef } from 'react';
import { Exercise } from '@/types';
import { ExerciseProgress } from '@/types/api';
import exerciseFetch from './exercise';
import { useToken } from '@/hooks/auth';

/**
 * Type definition for user statistics
 * Tracks completion progress across all exercises
 */
type UserStats = {
  completedExercises: number;
  totalExercises: number;
  overallProgress: number;
} | null;

/**
 * useExercise Hook
 * 
 * A custom hook for fetching and managing exercise data.
 * 
 * Responsibilities:
 * - Fetches exercise details based on the provided ID
 * - Manages exercise progress state
 * - Calculates user statistics
 * - Handles loading states
 * 
 * @param {string} id - The exercise ID to fetch
 * @returns {Object} Exercise data, progress, stats, and management functions
 */
export function useExercise(id: string) {
  // State for the exercise details
  const [exercise, setExercise] = useState<Exercise | null>(null);
  
  // State for the user's progress on this exercise
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress | null>(null);
  
  // State for tracking data loading
  const [loadingProgress, setLoadingProgress] = useState(false);

  // Add request tracking to prevent duplicate requests
  const requestInProgress = useRef(false);
  const lastFetchedId = useRef<string | null>(null);

  // Use the token hook
  const { getToken, hasToken } = useToken();
  
  /**
   * Calculate user statistics based on exercise progress
   * This is currently using static data but could be expanded
   * to fetch actual stats from an API
   */
  const userStats: UserStats = exerciseProgress ? { 
    completedExercises: exerciseProgress ? 1 : 0, 
    totalExercises: 10, 
    overallProgress: exerciseProgress?.isCompleted ? 10 : 0
  } : null;
  
  /**
   * Effect hook to fetch exercise data when the ID changes
   * Uses the exerciseFetch API function to get exercise details
   */
  useEffect(() => {
    const fetchExercise = async () => {
      // Prevent duplicate requests for the same ID
      if (requestInProgress.current || lastFetchedId.current === id) {
        return;
      }

      requestInProgress.current = true;
      setLoadingProgress(true);
      
      try {
        // Get authentication token using the hook
        if (!hasToken()) {
          console.error('No authentication token found');
          return;
        }
        const token = getToken();
        
        // Validate exercise ID and token
        if (!id) {
          console.error('No exercise ID provided');
          return;
        }
        
        if (!token) {
          console.error('Token is null');
          return;
        }
        
        // Fetch exercise data from API
        const response = await exerciseFetch({ token, id });
        setExercise(response);
        lastFetchedId.current = id;
        
        // In the future, we might want to fetch progress here as well
        
      } catch (err) {
        console.error(err instanceof Error ? err.message : 'Failed to fetch exercise');
      } finally {
        setLoadingProgress(false);
        requestInProgress.current = false;
      }
    };

    // Only fetch if we have an ID
    if (id) {
      fetchExercise();
    }
    
    // Cleanup function
    return () => {
      // Clean up any potential pending operations
    };
  }, [id, hasToken, getToken]);

  // Return all relevant state and functions
  return {
    exercise,
    exerciseProgress,
    setExerciseProgress,
    userStats,
    loadingProgress
  };
} 