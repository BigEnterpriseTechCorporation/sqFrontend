import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';

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
 * - Responsive design for mobile devices
 */
export function ExerciseEditor({ 
  code, 
  onCodeChange, 
  onExecute, 
  onSubmit, 
  isSubmitting 
}: ExerciseEditorProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return (
    <div className="relative h-full overflow-hidden">
      {/* Action buttons - responsive layout for mobile */}
      <div className={`absolute ${isMobile ? 'top-0 left-0 right-0 p-2 flex justify-end bg-gray-800 bg-opacity-80' : 'top-2 right-2'} z-10 flex gap-2`}>
        {/* Cell identifier (like in spreadsheets) */}
        {/* <div className="flex items-center justify-center h-6 w-6 bg-green-600 text-white text-xs font-mono rounded">
          A1
        </div> */}
        
        {/* Execute button - runs the query without submitting */}
        <button
          className={`px-3 ${isMobile ? 'h-10' : 'h-6'} bg-green-600 text-white ${isMobile ? 'text-base' : 'text-sm'} rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500`}
          onClick={onExecute}
        >
          Execute
        </button>
        
        {/* Submit button - checks if the solution is correct */}
        <button
          className={`px-3 ${isMobile ? 'h-10' : 'h-6'} bg-blue-600 text-white ${isMobile ? 'text-base' : 'text-sm'} rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Checking...' : 'Submit Solution'}
        </button>
      </div>

      {/* Monaco Editor for SQL */}
      <div className={`${isMobile ? 'pt-14' : ''} h-full`}>
        <Editor
          height="100%"
          defaultLanguage="sql"
          defaultValue={code}
          value={code}
          theme="vs-dark"
          onChange={onCodeChange}
          options={{
            minimap: { enabled: !isMobile },
            fontSize: isMobile ? 16 : 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            padding: { top: 8 },
            lineHeight: isMobile ? 24 : 20,
            wordWrap: isMobile ? 'on' : 'off',
            scrollbar: {
              vertical: 'visible',
              horizontalSliderSize: isMobile ? 10 : 7,
              verticalSliderSize: isMobile ? 10 : 7
            }
          }}
        />
      </div>
    </div>
  );
} 