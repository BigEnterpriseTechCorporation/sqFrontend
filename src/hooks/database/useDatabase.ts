import { useState, useEffect } from 'react';
import { Exercise } from '@/types';
import { QueryResult, TableInfo } from '@/types/database';
import { DatabaseManager } from '@/utils/database';

/**
 * useDatabase Hook
 * 
 * A custom hook that manages database operations for SQL exercises.
 * This hook handles:
 * - Database initialization with exercise data
 * - Executing SQL queries
 * - Retrieving table schema information
 * - Maintaining query results
 * 
 * The hook uses the DatabaseManager utility to interface with
 * the SQLite database running in WebAssembly.
 * 
 * @param {Exercise | null} exercise - The current exercise with database info
 * @param {string} code - The SQL query to execute
 * @returns {Object} Database state and functions
 */
export function useDatabase(exercise: Exercise | null, code: string) {
  // Create a persistent instance of the database manager
  const [dbManager] = useState(() => new DatabaseManager());
  
  // Store the tables schema and sample data
  const [tables, setTables] = useState<TableInfo[]>([]);
  
  // Store the results of the most recent query execution
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);

  /**
   * Initialize the database when the exercise changes
   * This effect:
   * 1. Cleans up previous database state
   * 2. Initializes the database with exercise data
   * 3. Extracts table schema information
   */
  useEffect(() => {
    // Skip if no exercise is loaded
    if (!exercise) return;

    const initializeDatabase = async () => {
      try {
        // Initialize database with exercise data (tables, seed data, etc.)
        await dbManager.initialize(exercise);
        
        // Get table schemas and sample data
        setTables(dbManager.getTables());
      } catch (error) {
        console.error(error instanceof Error ? error.message : 'Failed to initialize database');
      }
    };

    // Run initialization
    initializeDatabase();

    // Cleanup function to reset database when component unmounts
    // or when exercise changes
    return () => {
      dbManager.cleanup();
    };
  }, [exercise, dbManager]);

  /**
   * Execute a SQL query against the database
   * Updates the queryResult state with the execution results
   * 
   * @returns {QueryResult} The result of the query execution
   */
  const executeQuery = () => {
    // Run the query through the database manager
    const result = dbManager.executeQuery(code);
    
    // Update state with results
    setQueryResult(result);
    
    // Return results for immediate use if needed
    return result;
  };

  // Return database state and functions
  return {
    dbManager,
    tables,
    queryResult,
    executeQuery
  };
} 