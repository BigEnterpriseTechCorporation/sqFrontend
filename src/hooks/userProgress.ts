import { token } from "@/types";
import { API } from "@/utils/api";

// Define the shape of progress data returned by the API
export interface UserProgress {
  totalExercises: number;
  completedExercises: number;
  completionRate: number;
  exercisesByDifficulty: Record<string, number>;
  exercisesByType: Record<string, number>;
  lastCompletedExercises: {
    id: string;
    title: string;
    unitId: string;
    unitTitle: string;
    completedAt: string;
  }[];
  completedByDifficulty: Record<string, number>;
}

/**
 * Hook to fetch user progress statistics
 * @param formData Object containing JWT token
 * @returns User progress data
 */
export default async function userProgress(formData: { token: token }): Promise<UserProgress> {
  try {
    // Use the centralized API utility to fetch progress statistics
    return await API.solutions.getStats<UserProgress>(formData.token);
  } catch (error) {
    console.error('Progress stats fetch error:', error);
    throw error;
  }
} 