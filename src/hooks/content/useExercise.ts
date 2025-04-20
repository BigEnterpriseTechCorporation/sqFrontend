import { useState, useEffect } from 'react';
import { Exercise } from '@/types';
import { ExerciseProgress } from '@/types/api';
import exerciseFetch from './exercise';

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
  
  // State for tracking data loading (currently static)
  const [loadingProgress] = useState(false);
  
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
      try {
        // Get authentication token from local storage
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          return;
        }
        
        // Validate exercise ID
        if (!id) {
          console.error('No exercise ID provided');
          return;
        }
        
        // Fetch exercise data from API
        const response = await exerciseFetch({ token, id });
        setExercise(response);
        
        // In the future, we might want to fetch progress here as well
        
      } catch (err) {
        console.error(err instanceof Error ? err.message : 'Failed to fetch exercise');
      }
    };

    // Only fetch if we have an ID
    if (id) {
      fetchExercise();
    }
  }, [id]);

  // Return all relevant state and functions
  return {
    exercise,
    exerciseProgress,
    setExerciseProgress,
    userStats,
    loadingProgress
  };
} 