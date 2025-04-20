import ExerciseCard from "@/components/ui/ExerciseCard";
import { Exercise } from "@/types";
import { useExercisesProgress } from "@/hooks/content/useExercisesProgress";

interface ExercisesListProps {
  exercises: Exercise[];
}

export default function ExercisesList({ exercises }: ExercisesListProps) {
  // Use the progress hook to get progress information for all exercises
  const { loading, progressMap } = useExercisesProgress();

  return (
    <>
      <h2 className="text-3xl font-semibold mb-6">Exercises</h2>
      
      {/* Loading indicator while fetching progress data */}
      {loading && (
        <div className="mb-4 text-sm text-gray-500 flex items-center">
          <div className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-gray-500 animate-spin"></div>
          Loading progress data...
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {exercises && exercises.length > 0 ? (
          exercises.map((exercise) => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise} 
              progress={progressMap[exercise.id]} 
            />
          ))
        ) : (
          <p className="col-span-2 text-center text-lg text-gray-600">No exercises found for this unit.</p>
        )}
      </div>
    </>
  );
} 