import ExerciseCard from "@/components/ExerciseCard";
import { Exercise } from "@/types";

interface ExercisesListProps {
  exercises: Exercise[];
}

export default function ExercisesList({ exercises }: ExercisesListProps) {
  return (
    <>
      <h2 className="text-3xl font-semibold mb-6">Exercises</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {exercises && exercises.length > 0 ? (
          exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))
        ) : (
          <p className="col-span-2 text-center text-lg text-gray-600">No exercises found for this unit.</p>
        )}
      </div>
    </>
  );
} 