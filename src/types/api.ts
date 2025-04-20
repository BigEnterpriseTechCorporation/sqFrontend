// API related types
export interface ApiOptions<T = Record<string, unknown>> {
  baseUrl: string
  headers?: HeadersInit
  params?: T
}

// Auth related responses
export interface LoginResponse {
  token: string
}

export interface RegisterResponse {
  token: string
}

export interface UserResponse {
  role: string
}

// Admin form hook related types
export interface UseAdminFormProps<T> {
  initialData?: T
  onSubmit: (data: T) => Promise<void>
}

export interface UseAdminFormResult<T> {
  data: T
  isLoading: boolean
  error: string | null
  success: string | null
  handleChange: (name: keyof T, value: unknown) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  resetForm: () => void
}

// Stats interface for dashboard
export interface Stats {
  totalUsers: number
  activeUsers: number
  totalUnits: number
  totalExercises: number
  completedExercises: number
}

// Solution submission interface
export interface SolutionSubmissionResponse {
  isCorrect: boolean
  attemptCount: number
  exerciseId: string
  userId: string
  feedback: string | null
}

// Progress tracking interfaces
export interface UserProgressStats {
  userId: string;
  completedExercises: number;
  totalExercises: number;
  overallProgress: number; // percentage
  recentActivity?: {
    date: string;
    action: string;
  }[];
}

export interface ExerciseProgress {
  exerciseId: string
  isCompleted: boolean
  attempts: number
  lastAttemptDate?: string
  bestScore?: number
}

export interface UnitProgress {
  unitId: string
  totalExercises: number
  completedExercises: number
  completionPercentage: number
  exercises: ExerciseProgress[]
} 