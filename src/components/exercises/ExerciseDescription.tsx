import { Exercise } from '@/types';
import { ExerciseProgress } from '@/types/api';

/**
 * Props for the ExerciseDescription component
 * 
 * @property {Exercise | null} exercise - The current exercise data
 * @property {ExerciseProgress | null} exerciseProgress - User's progress on this exercise
 * @property {Object | null} userStats - Overall user statistics across all exercises
 * @property {boolean} loadingProgress - Flag indicating if progress data is loading
 * @property {number} attemptCount - Number of attempts for the current exercise
 * @property {Function} onShowSolution - Function to show example solution
 */
interface ExerciseDescriptionProps {
  exercise: Exercise | null;
  exerciseProgress: ExerciseProgress | null;
  userStats: {
    completedExercises: number;
    totalExercises: number;
    overallProgress: number;
  } | null;
  loadingProgress: boolean;
  attemptCount: number;
  onShowSolution: () => void;
}

/**
 * ExerciseDescription Component
 * 
 * Displays comprehensive information about the current exercise, including:
 * - Title and completion status
 * - Exercise instructions and requirements
 * - Difficulty level indicator
 * - User progress statistics
 * - Option to view solution (after multiple attempts)
 * 
 * This component is the primary way users understand what they need to accomplish
 * in the current exercise.
 */
export function ExerciseDescription({
  exercise,
  exerciseProgress,
  userStats,
  loadingProgress,
  attemptCount,
  onShowSolution
}: ExerciseDescriptionProps) {
  return (
    <div className="text-white">
      {exercise ? (
        <div className="space-y-4">
          {/* Title and completion status header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">{exercise.title}</h2>
            {/* Completion badge */}
            {exerciseProgress?.isCompleted && (
              <div className="bg-green-700 px-2 py-1 rounded text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Completed
              </div>
            )}
          </div>
          
          {/* Exercise description/instructions */}
          <div className="p-4">
            <p className="whitespace-pre-wrap">{exercise.description}</p>
          </div>
          
          {/* Metadata and stats panel */}
          <div className="bg-[#2D2D2D] rounded-md p-4">
            {/* Difficulty level and attempt count */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-gray-400 mr-2">Difficulty:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  exercise.difficulty === 0 ? 'bg-green-700' : 
                  exercise.difficulty === 1 ? 'bg-yellow-700' : 
                  exercise.difficulty === 2 ? 'bg-red-700' : 'bg-purple-700'
                }`}>
                  {exercise.difficulty === 0 ? 'Easy' : 
                   exercise.difficulty === 1 ? 'Medium' : 
                   exercise.difficulty === 2 ? 'Hard' : 'Ultra Hard'}
                </span>
              </div>
              
              {/* Previous attempt counter */}
              {exerciseProgress && (
                <div className="text-gray-400 text-sm">
                  Attempts: <span className="text-white">{exerciseProgress.attempts}</span>
                </div>
              )}
            </div>
            
            {/* Progress Bar - shows overall completion rate */}
            {userStats && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Your overall progress</span>
                  <span>{userStats.completedExercises} of {userStats.totalExercises} exercises completed</span>
                </div>
                {/* Visual progress bar */}
                <div className="w-full bg-[#444444] rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${userStats.overallProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Loading indicator for progress data */}
            {loadingProgress && (
              <div className="text-xs text-gray-400 mt-2">Loading progress...</div>
            )}
          </div>
          
          {/* Show solution button (only after multiple attempts) */}
          {attemptCount > 2 && !exerciseProgress?.isCompleted && (
            <div className="mt-3 flex justify-end">
              <button
                className="text-xs text-blue-400 hover:text-blue-300 underline"
                onClick={onShowSolution}
              >
                See example solution
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-400">No exercise description available</div>
      )}
    </div>
  );
} 