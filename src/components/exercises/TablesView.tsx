import { TableInfo } from '@/types/database';

/**
 * Props for the TablesView component
 * 
 * @property {TableInfo[]} tables - Array of database tables with their schema and sample data
 */
interface TablesViewProps {
  tables: TableInfo[];
}

/**
 * TablesView Component
 * 
 * Displays information about all tables in the database, including:
 * - Table names
 * - Column definitions with types
 * - Sample data from each table
 * 
 * This component helps users understand the database schema
 * to write effective SQL queries for the exercise.
 */
export function TablesView({ tables }: TablesViewProps) {
  return (
    <div className="text-white font-mono">
      {/* Loop through each table and display its details */}
      {tables.map((table) => (
        <div key={table.name} className="mb-8">
          {/* Table name heading */}
          <h3 className="text-lg font-medium mb-2">{table.name}</h3>
          
          {/* Column names with types */}
          <div className="mb-2">
            <span className="text-gray-400">Columns: </span>
            <div className="ml-2">
              {table.columns.map((col) => (
                <div key={col} className="text-green-400">
                  {col} <span className="text-gray-400 italic">({table.columnTypes?.[col] || 'unknown'})</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sample data table */}
          <table className="w-full border-collapse">
            {/* Column headers */}
            <thead>
              <tr>
                {table.columns.map((col) => (
                  <th key={col} className="border border-[#444444] px-2 py-1 text-left">
                    {col}
                    <div className="text-xs text-gray-400">
                      {table.columnTypes?.[col] || ''}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Sample data rows */}
            <tbody>
              {table.sampleData.map((row, i) => (
                <tr key={i}>
                  {table.columns.map((col) => (
                    <td key={col} className="border border-[#444444] px-2 py-1">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
} 