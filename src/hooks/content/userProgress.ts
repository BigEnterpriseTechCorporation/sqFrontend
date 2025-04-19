import { token, UserProgress } from "@/types";
import { API } from "@/utils/api";

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