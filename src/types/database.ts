import { Exercise } from './index';

// Database manager related types
export interface SQLiteAPI {
  createDatabase: (schema: string) => SQLiteDB
}

export interface SQLiteDB {
  exec: (sql: string) => unknown
  close: () => void
  getTableInfo: () => Record<string, unknown>[]
}

// Database manager class uses these interfaces
export interface DatabaseConfig {
  exercise: Exercise
}

// Query execution types
export interface QueryResult {
  columns: string[]
  rows: Record<string, string | number | boolean | null>[]
  error?: string
}

export interface TableInfo {
  name: string
  columns: string[]
  columnTypes?: Record<string, string>
  sampleData: Record<string, string | number | boolean | null>[]
} 