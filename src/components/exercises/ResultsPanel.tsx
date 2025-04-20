import { QueryResult } from '@/types/database';
import { SolutionSubmissionResponse } from '@/types/api';

/**
 * Props for the ResultsPanel component
 * 
 * @property {QueryResult | null} queryResult - Results from executing a SQL query
 * @property {SolutionSubmissionResponse | null} solutionResult - Solution validation results
 */
interface ResultsPanelProps {
  queryResult: QueryResult | null;
  solutionResult: SolutionSubmissionResponse | null;
}

/**
 * ResultsPanel Component
 * 
 * Displays the results of SQL query execution and solution validation.
 * This component handles:
 * 1. Showing error messages when queries fail
 * 2. Displaying validation feedback (correct/incorrect)
 * 3. Rendering the query result data in a table format
 * 
 * The component prioritizes error handling, ensuring users get clear
 * feedback when their SQL has syntax or logical errors.
 */
export function ResultsPanel({ queryResult, solutionResult }: ResultsPanelProps) {
  // If there's an error with the query, display it prominently
  if (queryResult?.error) {
    return <div className="text-red-500 font-mono">{queryResult.error}</div>;
  }

  return (
    <div className="text-white">
      {/* Solution validation feedback section */}
      {solutionResult && (
        <div className={`mb-4 p-3 rounded ${
          solutionResult.isCorrect 
            ? 'bg-green-900/50 border border-green-700' 
            : 'bg-red-900/50 border border-red-700'
        }`}>
          {/* Success/failure message */}
          <div className="font-medium mb-1">
            {solutionResult.isCorrect 
              ? '✓ Correct solution!' 
              : '✗ Not quite right'}
          </div>
          
          {/* Display feedback text if provided */}
          {solutionResult.feedback && (
            <div className="text-sm">
              {solutionResult.feedback}
            </div>
          )}
          
          {/* Attempt counter */}
          <div className="text-xs text-gray-400 mt-2">
            Attempt {solutionResult.attemptCount} of this exercise
          </div>
        </div>
      )}
      
      {/* Query results table */}
      <div className="font-mono">
        {queryResult && (
          <table className="w-full border-collapse">
            {/* Table headers - column names */}
            <thead>
              <tr>
                {queryResult.columns.map((col) => (
                  <th key={col} className="border border-[#444444] px-2 py-1 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Table body - query result rows */}
            <tbody>
              {queryResult.rows.map((row, i) => (
                <tr key={i}>
                  {queryResult.columns.map((col) => (
                    <td key={col} className="border border-[#444444] px-2 py-1">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 