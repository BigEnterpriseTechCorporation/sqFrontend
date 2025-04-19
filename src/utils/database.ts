import { Exercise } from "@/types";

/**
 * Represents the result of a SQL query execution
 */
interface QueryResult {
  columns: string[];    // Names of the columns in the result
  rows: any[];         // Array of row objects
  error?: string;      // Error message if the query failed
}

/**
 * Contains information about a database table
 */
interface TableInfo {
  name: string;        // Name of the table
  columns: string[];   // Names of the columns in the table
  sampleData: any[];   // Sample rows from the table (limited to 5)
}

/**
 * Manages SQLite database operations in the browser
 * Handles database initialization, query execution, and table information retrieval
 */
export class DatabaseManager {
  private sqlite3: any;        // SQLite module instance
  private db: any;             // Database connection
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
          this.sqlite3 = await window.sqlite3InitModule({
            print: console.log,
            printErr: console.error,
          });
          
          // Log SQLite version for debugging
          const version = this.sqlite3.capi.sqlite3_libversion();
          console.log(`Loaded SQLite ${version}`);

          // Create and initialize database with exercise schema
          this.db = new this.sqlite3.oo1.DB();
          if (this.exercise?.schema) {
            this.db.exec(this.exercise.schema);
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
      const rows: any[] = [];
      this.db.exec({
        sql: query,
        rowMode: "object",
        resultRows: rows,
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
      const tables: any[] = [];
      this.db.exec({
        sql: tablesQuery,
        rowMode: "object",
        resultRows: tables,
      });

      // For each table, get its structure and sample data
      return tables.map(table => {
        const tableName = table.name;
        
        // Get column information
        const columnsQuery = `PRAGMA table_info(${tableName})`;
        const columns: any[] = [];
        this.db.exec({
          sql: columnsQuery,
          rowMode: "object",
          resultRows: columns,
        });

        // Get sample data (first 5 rows)
        const sampleQuery = `SELECT * FROM ${tableName} LIMIT 5`;
        const sampleData: any[] = [];
        this.db.exec({
          sql: sampleQuery,
          rowMode: "object",
          resultRows: sampleData,
        });

        return {
          name: tableName,
          columns: columns.map(col => col.name),
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