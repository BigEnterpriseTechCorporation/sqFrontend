import { Exercise, Unit, User, UserProgress } from './index';

// Component Props Types
export interface UserCardProps {
  user: User
  onUpdateUsername: (newUsername: string, password: string) => Promise<User>
  onUpdateFullName: (newFullName: string, password: string) => Promise<User>
}

export interface ProgressDisplayProps {
  progress: UserProgress | null
  isLoading: boolean
}

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  fullScreen?: boolean
}

export interface ErrorDisplayProps {
  message: string
}

export interface UnitTitleProps {
  title: string
}

export interface UnitHeaderProps {
  ownerName: string
  exerciseCount: string | number
}

export interface UnitDescriptionProps {
  markdownContent?: string
  fallbackText: string
}

export interface ExercisesListProps {
  exercises: Exercise[]
}

export interface ErrorMessageProps {
  message: string
}

export interface UnitsListProps {
  visibleUnits: Unit[]
  units: Unit[]
  onLoadMore: () => void
}

export interface ErrorStateProps {
  error: string
}

export interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export interface FormSubmitButtonProps {
  isLoading?: boolean
  disabled?: boolean
  children: React.ReactNode
}

export interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
  error?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export interface ExerciseCardProps {
  exercise: Exercise
  progress?: {
    exerciseId: string
    isCompleted: boolean
    attempts: number
  }
}

export interface AuthContainerProps {
  children: React.ReactNode
}

// Admin component props
export interface ArrayEditorProps {
  value: string[]
  onChange: (value: string[]) => void
  label: string
}

export interface OptionsEditorProps {
  value: Record<string, string>
  onChange: (value: Record<string, string>) => void
  label: string
} 