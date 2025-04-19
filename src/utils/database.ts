import { Exercise } from "@/types";

/**
 * Represents the result of a SQL query execution
 */
interface QueryResult {
  columns: string[];    // Names of the columns in the result
  rows: Record<string, string | number | boolean | null>[];  // Array of row objects
  error?: string;      // Error message if the query failed
}

/**
 * Contains information about a database table
 */
interface TableInfo {
  name: string;        // Name of the table
  columns: string[];   // Names of the columns in the table
  sampleData: Record<string, string | number | boolean | null>[];  // Sample rows from the table (limited to 5)
}

/**
 * SQLite API interface
 */
interface SQLiteAPI {
  capi: {
    sqlite3_libversion: () => string;
  };
  oo1: {
    DB: new () => SQLiteDB;
  };
}

/**
 * SQLite Database interface
 */
interface SQLiteDB {
  exec: (params: {
    sql: string;
    rowMode: string;
    resultRows?: Record<string, unknown>[];
  }) => void;
  close: () => void;
}

/**
 * Manages SQLite database operations in the browser
 * Handles database initialization, query execution, and table information retrieval
 */
export class DatabaseManager {
  private sqlite3: SQLiteAPI | null = null;  // SQLite module instance
  private db: SQLiteDB | null = null;        // Database connection
  private exercise: Exercise | null = null;  // Current exercise data

  constructor() {}

  /**
   * Initializes the database with the given exercise schema
   * @param exercise - The exercise containing the database schema
   */
  async initialize(exercise: Exercise) {
    this.exercise = exercise;
    await this.loadSQLite();
  }

  /**
   * Loads the SQLite module and initializes the database
   * Uses a dynamic script loading approach for browser compatibility
   */
  private async loadSQLite() {
    return new Promise<void>((resolve, reject) => {
      // Create and configure the script element
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@antonz/sqlean/dist/sqlean.mjs';
      script.type = 'module';
      script.async = true;
      
      // Handle successful script loading
      script.onload = async () => {
        try {
          // Initialize SQLite module
          this.sqlite3 = await (window as Window & { 
            sqlite3InitModule: (options: {
              print: (msg: string) => void;
              printErr: (msg: string) => void;
            }) => Promise<SQLiteAPI> 
          }).sqlite3InitModule({
            print: console.log,
            printErr: console.error,
          });
          
          // Log SQLite version for debugging
          const version = this.sqlite3.capi.sqlite3_libversion();
          console.log(`Loaded SQLite ${version}`);

          // Create and initialize database with exercise schema
          this.db = new this.sqlite3.oo1.DB();
          if (this.exercise?.schema) {
            this.db.exec({ sql: this.exercise.schema, rowMode: "object" });
            resolve();
          } else {
            reject(new Error('No database schema provided'));
          }
        } catch (error) {
          reject(error);
        }
      };

      // Handle script loading failure
      script.onerror = () => {
        reject(new Error('Failed to load SQLite script'));
      };

      // Add script to document
      document.body.appendChild(script);
    });
  }

  /**
   * Executes a SQL query and returns the results
   * @param query - The SQL query to execute
   * @returns QueryResult containing columns, rows, and any error
   */
  executeQuery(query: string): QueryResult {
    if (!this.db) {
      return { columns: [], rows: [], error: 'Database not initialized' };
    }

    try {
      // Execute query and collect results
      const rows: Record<string, string | number | boolean | null>[] = [];
      
      // TypeScript doesn't maintain null check through the whole function,
      // so we need to ensure db is still not null here
      const db = this.db;
      if (!db) {
        return { columns: [], rows: [], error: 'Database not initialized' };
      }
      
      db.exec({
        sql: query,
        rowMode: "object",
        resultRows: rows as unknown as Record<string, unknown>[],
      });

      // Handle empty result set
      if (rows.length > 0) {
        const columns = Object.keys(rows[0]);
        return { columns, rows };
      } else {
        return { columns: [], rows: [], error: 'No results' };
      }
    } catch (error) {
      // Handle query execution errors
      return { 
        columns: [], 
        rows: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Retrieves information about all tables in the database
   * @returns Array of TableInfo objects containing table structure and sample data
   */
  getTables(): TableInfo[] {
    if (!this.db) {
      return [];
    }

    try {
      // Get list of all tables
      const tablesQuery = "SELECT name FROM sqlite_master WHERE type='table'";
      const tables: Record<string, unknown>[] = [];
      this.db?.exec({
        sql: tablesQuery,
        rowMode: "object",
        resultRows: tables,
      });

      // For each table, get its structure and sample data
      return tables.map(table => {
        const tableName = table.name as string;
        
        // Get column information
        const columnsQuery = `PRAGMA table_info(${tableName})`;
        const columns: Record<string, unknown>[] = [];
        
        // Ensure db is not null before calling exec
        if (!this.db) return { name: tableName, columns: [], sampleData: [] };
        
        this.db.exec({
          sql: columnsQuery,
          rowMode: "object",
          resultRows: columns,
        });

        // Get sample data (first 5 rows)
        const sampleQuery = `SELECT * FROM ${tableName} LIMIT 5`;
        const sampleData: Record<string, string | number | boolean | null>[] = [];
        this.db.exec({
          sql: sampleQuery,
          rowMode: "object",
          resultRows: sampleData as unknown as Record<string, unknown>[],
        });

        return {
          name: tableName,
          columns: columns.map(col => col.name as string),
          sampleData
        };
      });
    } catch (error) {
      console.error('Failed to fetch tables:', error);
      return [];
    }
  }

  /**
   * Cleans up database resources
   * Should be called when the database is no longer needed
   */
  cleanup() {
    if (this.db) {
      this.db.close();
    }
  }
} 