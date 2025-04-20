import { ProgressDisplayProps } from "@/types/components"
import Link from "next/link"

export default function ProgressDisplay({ progress, isLoading }: ProgressDisplayProps) {
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
                {`${progress?.completionPercentage?.toFixed(2) || 0}%`}
              </span>
            </div>
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 rounded-full"
                style={{ width: `${progress?.completionPercentage || 0}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {progress?.solvedExercises || 0} of {progress?.totalExercises || 0} exercises completed
            </div>
          </div>
          
          {/* Additional Statistics */}
          <div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 mb-1">Total Attempts</h4>
              <p className="text-xl font-bold">{progress?.totalAttempts || 0}</p>
            </div>
          </div>
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