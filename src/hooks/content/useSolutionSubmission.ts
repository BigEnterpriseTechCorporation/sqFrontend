import { useState } from 'react';
import { Exercise } from '@/types';
import { QueryResult } from '@/types/database';
import { API } from '@/utils/api';
import { SolutionSubmissionResponse } from '@/types/api';
import { DatabaseManager } from '@/utils/database';

/**
 * useSolutionSubmission Hook
 * 
 * A custom hook that manages the solution submission process for exercises.
 * This hook handles:
 * - Validating SQL queries client-side before submission
 * - Submitting solutions to the API
 * - Tracking submission state and attempts
 * - Managing feedback responses
 * 
 * @param {Exercise | null} exercise - The current exercise
 * @param {string} code - The SQL query to submit
 * @param {DatabaseManager} dbManager - The database manager instance
 * @param {QueryResult | null} queryResult - Results from the last executed query
 * @param {Function} setActiveTab - Function to change the active tab view
 * @returns {Object} Submission state and functions
 */
export function useSolutionSubmission(
  exercise: Exercise | null,
  code: string,
  dbManager: DatabaseManager,
  queryResult: QueryResult | null,
  setActiveTab: (tab: 'description' | 'results' | 'tables') => void
) {
  // Store the result of the solution validation from the API
  const [solutionResult, setSolutionResult] = useState<SolutionSubmissionResponse | null>(null);
  
  // Track whether a submission is in progress
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Count how many attempts have been made on this exercise
  const [attemptCount, setAttemptCount] = useState(0);

  /**
   * Submit the current code as a solution for the exercise
   * Performs validation both locally and through the API
   */
  const submitSolution = async () => {
    // Make sure we have all the required data and are not already submitting
    if (!exercise || !code.trim() || isSubmitting) return;
    
    // Set submitting state to show loading indicator
    setIsSubmitting(true);
    
    try {
      // Get authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }
      
      // First, validate SQL syntax locally by running the query
      const result = dbManager.executeQuery(code);
      
      // If there's a syntax error, show the error but don't submit to API
      if (result.error) {
        setActiveTab('results');
        setIsSubmitting(false);
        return;
      }
      
      // Submit solution to the API for validation
      const data = await API.solutions.submit<SolutionSubmissionResponse>(
        token, 
        exercise.id, 
        { query: code }
      );
      
      // Update states with the response
      setSolutionResult(data);
      setAttemptCount(data.attemptCount);
      
      // Show the results tab with the submission feedback
      setActiveTab('results');
      
    } catch (error) {
      console.error('Failed to submit solution:', error);
    } finally {
      // Reset submission state when done
      setIsSubmitting(false);
    }
  };

  // Return solution state and functions
  return {
    solutionResult,
    setSolutionResult,
    isSubmitting,
    attemptCount,
    submitSolution
  };
} 