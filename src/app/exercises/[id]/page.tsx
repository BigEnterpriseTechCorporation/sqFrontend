'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Split from 'react-split';
import Navigation from "@/components/layout/Navigation";
import { useExercise } from '@/hooks/content/useExercise';
import { useDatabase } from '@/hooks/database/useDatabase';
import { useSolutionSubmission } from '@/hooks/content/useSolutionSubmission';
import { ExerciseEditor } from '@/components/exercises/ExerciseEditor';
import { ResultsPanel } from '@/components/exercises/ResultsPanel';
import { ExerciseDescription } from '@/components/exercises/ExerciseDescription';
import { TablesView } from '@/components/exercises/TablesView';
import { DiagramView } from '@/components/exercises/DiagramView';

/**
 * Global declaration for SQLite Web Assembly module
 * This enables the application to use SQLite in the browser
 * through WebAssembly for running SQL queries client-side
 */
declare global {
  interface Window {
    sqlite3InitModule: () => Promise<unknown>;
  }
}

/**
 * ExercisesPage - The main component for the SQL exercise interface
 * 
 * This page provides a complete environment for users to:
 * - View exercise descriptions and requirements
 * - Write and execute SQL queries
 * - View database tables and their schemas
 * - Submit solutions and receive feedback
 * 
 * The layout uses a split-pane design with the editor on the left
 * and tabbed content (description/results/tables) on the right.
 */
export default function ExercisesPage() {
  // Get the exercise ID from the URL parameters
  const params = useParams();
  
  // State for the SQL query editor
  const [code, setCode] = useState('');
  
  // Controls which tab is displayed in the right panel
  const [activeTab, setActiveTab] = useState<'description' | 'results' | 'tables' | 'diagram'>('description');
  
  // Track API connection errors
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Track screen size for responsive layout
  const [isMobile, setIsMobile] = useState(false);
  
  // Define type for split sizes
  interface SplitSizesState {
    mobile: number[];
    desktop: number[];
  }
  
  // Store split sizes for persistence
  const [splitSizes, setSplitSizes] = useState<SplitSizesState>(() => {
    // Try to load saved sizes from localStorage
    if (typeof window !== 'undefined') {
      const savedSizes = localStorage.getItem('splitSizes');
      if (savedSizes) {
        try {
          return JSON.parse(savedSizes);
        } catch (e) {
          // Fallback to default if parsing fails
          return { mobile: [50, 50], desktop: [50, 50] };
        }
      }
    }
    return { mobile: [50, 50], desktop: [50, 50] };
  });
  
  /**
   * Custom hook that fetches exercise data
   * Provides exercise details, progress tracking, and user statistics
   */
  const { 
    exercise, 
    exerciseProgress,
    userStats,
    loadingProgress
  } = useExercise(params.id as string);
  
  /**
   * Custom hook for database operations
   * Handles database initialization, executing queries, and accessing table schemas
   */
  const {
    dbManager,
    tables,
    queryResult,
    executeQuery
  } = useDatabase(exercise, code);
  
  /**
   * Custom hook for handling solution submissions
   * Manages the submission process, validation, and feedback
   */
  const {
    solutionResult,
    isSubmitting,
    attemptCount,
    submitSolution,
    setSolutionResult
  } = useSolutionSubmission(
    exercise, 
    code, 
    dbManager, 
    queryResult, 
    setActiveTab
  );

  /**
   * Handle API errors globally
   */
  useEffect(() => {
    const handleConnectionError = (event: ErrorEvent) => {
      if (event.error instanceof TypeError && event.error.message.includes('Failed to fetch')) {
        setConnectionError('Connection to server failed. Please check your internet connection or try again later.');
      }
    };

    window.addEventListener('error', handleConnectionError);
    
    return () => {
      window.removeEventListener('error', handleConnectionError);
    };
  }, []);

  /**
   * Detect mobile screens and handle resize events
   */
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  /**
   * Clear connection error when user interacts with the page
   */
  useEffect(() => {
    if (connectionError) {
      const clearError = () => setConnectionError(null);
      window.addEventListener('click', clearError, { once: true });
      return () => window.removeEventListener('click', clearError);
    }
  }, [connectionError]);

  /**
   * Handles code changes in the editor
   * Updates the code state and resets solution results when code changes
   */
  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
      setSolutionResult(null); // Reset previous results when code changes
    }
  };

  /**
   * Displays the example solution in the editor
   * Only available after multiple failed attempts
   */
  const getExampleSolution = () => {
    if (!exercise?.solutionQuery) return;
    
    setCode(exercise.solutionQuery);
    executeQuery(); // Execute the solution query to show results
  };

  /**
   * Executes the current query and switches to results tab
   */
  const handleExecuteQuery = () => {
    executeQuery();
    setActiveTab('results'); // Switch to results tab when query is executed
  };

  /**
   * Submits the solution and switches to results tab
   */
  const handleSubmitSolution = () => {
    // First execute the query to show results immediately
    executeQuery();
    // Then submit the solution for validation
    submitSolution();
    setActiveTab('results'); // Switch to results tab when solution is submitted
  };

  return (
    <main className="h-screen flex flex-col overflow-hidden bg-[#1E1E1E]">
      <Navigation/>
      {/* Connection error message */}
      {connectionError && (
        <div className="bg-red-600 text-white p-2 text-center">
          {connectionError}
        </div>
      )}
      {/* Split pane layout with resizable panels */}
      <div className="flex-1 flex overflow-hidden">
        {isMobile ? (
          // Mobile layout - Stack panels vertically with fixed heights
          <div className="w-full h-full flex flex-col overflow-hidden">
            {/* Top panel - SQL Editor (fixed height on mobile) */}
            <div className="w-full" style={{ height: '40%' }}>
              <ExerciseEditor 
                code={code}
                onCodeChange={handleEditorChange}
                onExecute={handleExecuteQuery}
                onSubmit={handleSubmitSolution}
                isSubmitting={isSubmitting}
              />
            </div>
            
            {/* Bottom panel - Tabbed content (fixed height on mobile) */}
            <div className="w-full bg-[#1E1E1E] p-2 overflow-auto" style={{ height: '60%' }}>
              {/* Tab navigation */}
              <div className="flex border-b border-[#444444] mb-2 overflow-x-auto">
                <button
                    className={`px-2 py-1 text-xs font-medium ${
                        activeTab === 'description'
                            ? 'text-white border-b-2 border-green-600'
                            : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                    className={`px-2 py-1 text-xs font-medium ${
                        activeTab === 'results'
                            ? 'text-white border-b-2 border-green-600'
                            : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('results')}
                >
                  Results
                </button>
                <button
                    className={`px-2 py-1 text-xs font-medium ${
                        activeTab === 'tables'
                            ? 'text-white border-b-2 border-green-600'
                            : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('tables')}
                >
                  Tables
                </button>
                <button
                    className={`px-2 py-1 text-xs font-medium ${
                        activeTab === 'diagram'
                            ? 'text-white border-b-2 border-green-600'
                            : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('diagram')}
                >
                  Diagram
                </button>
              </div>

              {/* Tab content based on activeTab state */}
              <div className="h-full overflow-auto">
                {activeTab === 'description' ? (
                  <ExerciseDescription 
                    exercise={exercise}
                    exerciseProgress={exerciseProgress}
                    userStats={userStats}
                    loadingProgress={loadingProgress}
                    attemptCount={attemptCount}
                    onShowSolution={getExampleSolution}
                  />
                ) : activeTab === 'results' ? (
                  <ResultsPanel 
                    queryResult={queryResult}
                    solutionResult={solutionResult}
                  />
                ) : activeTab === 'diagram' ? (
                  <DiagramView tables={tables} />
                ) : (
                  <TablesView tables={tables} />
                )}
              </div>
            </div>
          </div>
        ) : (
          // Desktop layout - Use react-split for horizontal layout
          <Split
            className="flex-1 flex overflow-hidden"
            sizes={splitSizes.desktop}
            minSize={200}
            gutterSize={4}
            direction="horizontal"
            onDragEnd={(newSizes) => {
              setSplitSizes((prev) => ({ ...prev, desktop: newSizes }));
              localStorage.setItem('splitSizes', JSON.stringify({ ...splitSizes, desktop: newSizes }));
            }}
            style={{ height: 'calc(100vh - 64px)' }}
          >
            {/* Left side - SQL Editor */}
            <div className="h-full overflow-hidden bg-[#444444]">
              <ExerciseEditor 
                code={code}
                onCodeChange={handleEditorChange}
                onExecute={handleExecuteQuery}
                onSubmit={handleSubmitSolution}
                isSubmitting={isSubmitting}
              />
            </div>

            {/* Right side - Tabbed interface for description/results/tables */}
            <div className="h-full bg-[#1E1E1E] p-4 overflow-auto flex flex-col">
              {/* Tab navigation */}
              <div className="flex border-b border-[#444444] mb-4 overflow-x-auto">
                <button
                    className={`px-4 py-2 text-sm font-medium ${
                        activeTab === 'description'
                            ? 'text-white border-b-2 border-green-600'
                            : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium ${
                        activeTab === 'results'
                            ? 'text-white border-b-2 border-green-600'
                            : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('results')}
                >
                  Results
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium ${
                        activeTab === 'tables'
                            ? 'text-white border-b-2 border-green-600'
                            : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('tables')}
                >
                  Tables
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium ${
                        activeTab === 'diagram'
                            ? 'text-white border-b-2 border-green-600'
                            : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('diagram')}
                >
                  Diagram
                </button>
              </div>

              {/* Tab content based on activeTab state */}
              <div className="flex-1 overflow-auto">
                {activeTab === 'description' ? (
                  <ExerciseDescription 
                    exercise={exercise}
                    exerciseProgress={exerciseProgress}
                    userStats={userStats}
                    loadingProgress={loadingProgress}
                    attemptCount={attemptCount}
                    onShowSolution={getExampleSolution}
                  />
                ) : activeTab === 'results' ? (
                  <ResultsPanel 
                    queryResult={queryResult}
                    solutionResult={solutionResult}
                  />
                ) : activeTab === 'diagram' ? (
                  <DiagramView tables={tables} />
                ) : (
                  <TablesView tables={tables} />
                )}
              </div>
            </div>
          </Split>
        )}
      </div>
      
      {/* Add custom styles for touch-friendly gutters */}
      <style jsx global>{`
        .gutter {
          background-color: #333;
          transition: background-color 0.2s;
        }
        .gutter:hover {
          background-color: #555;
        }
        .gutter.gutter-horizontal {
          cursor: col-resize;
        }
        .gutter.gutter-vertical {
          cursor: row-resize;
        }
      `}</style>
    </main>
  );
}