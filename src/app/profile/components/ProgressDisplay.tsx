import { UserProgress } from "@/hooks/userProgress"
import Link from "next/link"

interface ProgressDisplayProps {
  progress: UserProgress | null
  isLoading: boolean
}

export default function ProgressDisplay({ progress, isLoading }: ProgressDisplayProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-blue-500';
      case 'hard': return 'bg-orange-500';
      case 'ultra-hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : progress ? (
        <div className="space-y-8">
          {/* Completion Overview */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-lg font-semibold">Completion Rate</h3>
              <span className="text-lg font-bold text-purple-600">
                {`${Math.round((progress?.completionRate || 0) * 100)}%`}
              </span>
            </div>
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 rounded-full"
                style={{ width: `${Math.round((progress?.completionRate || 0) * 100)}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {progress?.completedExercises || 0} of {progress?.totalExercises || 0} exercises completed
            </div>
          </div>
          
          {/* Difficulty Breakdown */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Progress by Difficulty</h3>
            <div className="space-y-3">
              {Object.entries(progress.completedByDifficulty || {}).map(([difficulty, count]) => {
                const total = progress.exercisesByDifficulty?.[difficulty] || 0;
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={difficulty}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{difficulty}</span>
                      <span className="text-sm text-gray-600">{count}/{total}</span>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getDifficultyColor(difficulty)} rounded-full`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Recent Completions */}
          {progress.lastCompletedExercises && progress.lastCompletedExercises.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Recently Completed</h3>
              <div className="space-y-2">
                {progress.lastCompletedExercises.map(exercise => (
                  <div key={exercise.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium">{exercise.title}</div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-600">{exercise.unitTitle}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(exercise.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Link 
                  href="/units" 
                  className="inline-block text-purple-600 hover:text-purple-800 font-medium"
                >
                  View All Units →
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No progress data available yet.</p>
          <Link 
            href="/units" 
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white py-2 px-5 rounded-lg transition-colors"
          >
            Start Learning
          </Link>
        </div>
      )}
    </div>
  )
} 