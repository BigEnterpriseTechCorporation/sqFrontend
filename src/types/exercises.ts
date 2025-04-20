export interface ExerciseProgress {
  exerciseId: string;
  userId: string;
  isCompleted: boolean;
  lastAttemptDate?: string;
  attempts?: number;
} 