import Editor from '@monaco-editor/react';

/**
 * Props for the ExerciseEditor component
 * 
 * @property {string} code - The current SQL code in the editor
 * @property {Function} onCodeChange - Callback function when code changes
 * @property {Function} onExecute - Function to execute the SQL query
 * @property {Function} onSubmit - Function to submit the solution
 * @property {boolean} isSubmitting - Flag indicating if submission is in progress
 */
interface ExerciseEditorProps {
  code: string;
  onCodeChange: (value: string | undefined) => void;
  onExecute: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

/**
 * ExerciseEditor Component
 * 
 * Provides a Monaco-based SQL editor with action buttons for executing
 * and submitting queries. The editor is configured for SQL syntax with
 * appropriate styling to match the application's theme.
 * 
 * Features:
 * - Syntax highlighting for SQL
 * - Dark theme integration
 * - Execute button to run queries
 * - Submit button to check solutions
 * - Visual feedback during submission
 */
export function ExerciseEditor({ 
  code, 
  onCodeChange, 
  onExecute, 
  onSubmit, 
  isSubmitting 
}: ExerciseEditorProps) {
  return (
    <div className="relative h-full overflow-hidden">
      {/* Action buttons positioned in top-right corner */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        {/* Cell identifier (like in spreadsheets) */}
        <div className="flex items-center justify-center h-6 w-6 bg-green-600 text-white text-xs font-mono rounded">
          A1
        </div>
        
        {/* Execute button - runs the query without submitting */}
        <button
          className="px-2 h-6 bg-green-600 text-white text-sm rounded hover:bg-green-700 mr-1"
          onClick={onExecute}
        >
          Execute
        </button>
        
        {/* Submit button - checks if the solution is correct */}
        <button
          className="px-2 h-6 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Checking...' : 'Submit Solution'}
        </button>
      </div>

      {/* Monaco Editor for SQL */}
      <Editor
        height="100%"
        defaultLanguage="sql"
        defaultValue={code}
        value={code}
        theme="vs-dark"
        onChange={onCodeChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          padding: { top: 8 },
          lineHeight: 20,
        }}
      />
    </div>
  );
} 