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