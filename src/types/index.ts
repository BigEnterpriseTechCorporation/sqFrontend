// Core data model types
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

export type checkType = 0 | 1 | 2
export type exerciseType = 0 | 1 | 2 | 3 | 4
export type difficulty = 0 | 1 | 2 | 3

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
  questions?: Question[]
}

export interface Question {
  id: string
  text: string
  answers: string[]
  userAnswer?: string
  solutionQuery?: string
}

export interface UnitWithExercises extends Unit {
  exercises: Exercise[]
}

// Authentication types
export interface UserForm extends Omit<User, "role" | "id"> {
  currentPassword: string
}

export type userLogin = Omit<UserForm, "fullName">
export type userRegister = UserForm
export type token = string

// API related types from utils/api.ts
export interface UnitData {
  title: string
  description: string
  order: number
}

export interface ExerciseData {
  title: string
  description: string
  unitId: string
  order: number
  databaseSetup: string
  solution: string
}

export interface SolutionData {
  query: string
  result: unknown
}

// User progress type from hooks
export interface UserProgress {
  userId: string
  username: string
  totalExercises: number
  solvedExercises: number
  totalAttempts: number
  likedUnits: number
  completionPercentage: number
  exercisesByDifficulty?: Record<string, number>
  exercisesByType?: Record<string, number>
  lastCompletedExercises?: Exercise[]
  completedByDifficulty?: Record<string, number>
} 