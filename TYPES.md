# Super Query Type System

This document provides a detailed explanation of the type system used in the Super Query application. The type system is organized into several categories to maintain a clean and maintainable codebase.

## Overview

The type system is divided into four main categories:

1. **Core Data Models** (`/src/types/index.ts`): fundamental data structures
2. **Component Props** (`/src/types/components.ts`): React component prop types
3. **API Types** (`/src/types/api.ts`): API request/response types
4. **Database Types** (`/src/types/database.ts`): database-related types

All types are re-exported from `/src/types.ts` for backwards compatibility and ease of import.

## Core Data Models

### User Types

```typescript
export interface User {
  id: string
  fullName: string
  userName: string
  role: string
  registeredAt: string
  isActive?: boolean
  solvedExercisesCount?: number
  totalAttemptsCount?: number
  likedUnitsCount?: number
}

export interface UserForm extends Omit<User, "role" | "id"> {
  currentPassword: string
}

export type userLogin = Omit<UserForm, "fullName">
export type userRegister = UserForm
export type token = string
```

### Unit Types

```typescript
export interface Unit {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  description: string
  ownerId: string
  ownerName: string
  exerciseCount: string
}

export interface UnitWithExercises extends Unit {
  exercises: Exercise[]
}

export interface UnitData {
  title: string
  description: string
  order: number
}
```

### Exercise Types

```typescript
export type checkType = 0 | 1 | 2
export type exerciseType = 0 | 1 | 2 | 3 | 4
export type difficulty = 0 | 1 | 2 | 3

export interface Exercise {
  id: string
  createdAt: string
  updatedAt: string
  unitId: string
  unitTitle: string
  title: string
  description: string
  difficulty: difficulty
  type: exerciseType
  schema: string
  checkType: checkType
  checkQueryInsert: string
  checkQuerySelect: string
  solutionQuery: string
  options: string
  queryParts: string
  position?: number
  unit?: Unit
}

export interface ExerciseData {
  title: string
  description: string
  unitId: string
  order: number
  databaseSetup: string
  solution: string
}
```

### Progress Types

```typescript
export interface UserProgress {
  totalExercises: number
  completedExercises: number
  completionRate: number
  exercisesByDifficulty: Record<string, number>
  exercisesByType: Record<string, number>
  lastCompletedExercises: Exercise[]
  completedByDifficulty: Record<string, number>
}

export interface SolutionData {
  query: string
  result: unknown
}
```

## Component Prop Types

These types represent props for React components and are found in `/src/types/components.ts`.

### User-Related Components

```typescript
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
```

### Unit-Related Components

```typescript
export interface UnitTitleProps {
  title: string
}

export interface UnitHeaderProps {
  ownerName: string
  exerciseCount: string | number
}

export interface UnitDescriptionProps {
  mdxSource: MDXRemoteSerializeResult<Record<string, unknown>> | null
  fallbackText: string
}

export interface ExercisesListProps {
  exercises: Exercise[]
}

export interface UnitsListProps {
  visibleUnits: Unit[]
  units: Unit[]
  onLoadMore: () => void
}
```

### Quiz Components

```typescript
export interface QuizOptionProps {
  id: string
  text: string
  isSelected: boolean
  onSelect: () => void
}

export interface ProgressIndicatorProps {
  currentQuestion: number
  totalQuestions: number
}

export interface QuizCompletionCardProps {
  score: number
  totalQuestions: number
  timeSpent: number
  onShare: () => void
  onReturn: () => void
}

export interface QuizOption {
  text: string
  isCorrect: boolean
}
```

### UI Components

```typescript
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
}

export interface AuthContainerProps {
  children: React.ReactNode
}
```

### Admin Components

```typescript
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
```

## API Types

These types are used for API interactions and are found in `/src/types/api.ts`.

### API Configuration

```typescript
export interface ApiOptions<T = Record<string, unknown>> {
  baseUrl: string
  headers?: HeadersInit
  params?: T
}
```

### Authentication

```typescript
export interface LoginResponse {
  token: string
}

export interface RegisterResponse {
  token: string
}

export interface UserResponse {
  role: string
}
```

### Admin Forms

```typescript
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
```

### Statistics

```typescript
export interface Stats {
  totalUsers: number
  activeUsers: number
  totalUnits: number
  totalExercises: number
  completedExercises: number
}
```

## Database Types

These types are used for database operations and are found in `/src/types/database.ts`.

### SQLite Integration

```typescript
export interface SQLiteAPI {
  createDatabase: (schema: string) => SQLiteDB
}

export interface SQLiteDB {
  exec: (sql: string) => unknown
  close: () => void
  getTableInfo: () => Record<string, unknown>[]
}

export interface DatabaseConfig {
  exercise: Exercise
}
```

### Query Operations

```typescript
export interface QueryResult {
  columns: string[]
  rows: Record<string, string | number | boolean | null>[]
  error?: string
}

export interface TableInfo {
  name: string
  columns: string[]
  sampleData: Record<string, string | number | boolean | null>[]
}
```

## Best Practices

1. **Import from the Right Source**: For component props, import from `@/types/components`; for core models, import from `@/types` or `@/types/index`

2. **Define Types Close to Usage**: Keep component prop types in the components file if they're only used there

3. **Avoid Duplication**: Don't define the same type in multiple places

4. **Use Type Extensions**: Extend existing types when adding new properties rather than creating duplicates

5. **Keep Types Synchronized**: If changing a core type, make sure dependent types are updated accordingly

6. **Consistent Naming**: Follow naming conventions (PascalCase for interfaces, camelCase for types)

7. **Documenting Types**: Add JSDoc comments to complex types 