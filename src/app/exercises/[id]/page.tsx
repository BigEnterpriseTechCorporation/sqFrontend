'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Split from 'react-split';
import {useParams} from "next/navigation";
import unitAndExercises from "@/hooks/unitAndExercises";
import exerciseFetch from "@/hooks/exercise";
import {Exercise} from "@/types";
import { DatabaseManager } from '@/utils/database';

interface QueryResult {
  columns: string[];
  rows: any[];
  error?: string;
}

interface TableInfo {
  name: string;
  columns: string[];
  sampleData: any[];
}

declare global {
  interface Window {
    // eslint-disable-next-line
    sqlite3InitModule: any;
  }
}

export default function ExercisesPage() {
  const params = useParams();
  const [code, setCode] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [activeTab, setActiveTab] = useState<'results' | 'tables'>('results');
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbManager] = useState(() => new DatabaseManager());

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }
        const id = params.id as string;
        if (!id) {
          setError('No unit ID provided');
          return;
        }
        const response = await exerciseFetch({ token, id });
        setExercise(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch unit and exercises');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchExercise();
    }
  }, [params.id]);

  useEffect(() => {
    if (!exercise) return;

    const initializeDatabase = async () => {
      try {
        await dbManager.initialize(exercise);
        setTables(dbManager.getTables());
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to initialize database');
      }
    };

    initializeDatabase();

    return () => {
      dbManager.cleanup();
    };
  }, [exercise, dbManager]);

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  const executeQuery = () => {
    const result = dbManager.executeQuery(code);
    setQueryResult(result);
  };

  return (
    <main className="h-screen flex flex-col bg-[#1E1E1E]">
      <header className="flex justify-between items-center px-4 h-12 bg-[#333333] border-b border-[#444444]">
        <h1 className="text-white text-lg font-medium">Visual SQL</h1>
        
        <div className="flex-1 max-w-xl mx-4">
          <input 
            type="text"
            className="w-full px-3 py-1.5 bg-[#1E1E1E] border border-[#444444] rounded text-white"
          />
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-1 bg-[#444444] text-white text-sm rounded hover:bg-[#505050]">
            Вход
          </button>
          <button className="px-3 py-1 bg-[#444444] text-white text-sm rounded hover:bg-[#505050]">
            Регистрация
          </button>
        </div>
      </header>

      <Split 
        className="flex-1 flex bg-[#444444] "
        sizes={[50, 50]}
        minSize={200}
        gutterSize={4}
        snapOffset={0}
      >
        {/* Left side - Editor */}
        <div className="relative h-full overflow-hidden">
          <div className="absolute top-2 right-2 z-10 flex gap-1">
            <div className="flex items-center justify-center h-6 w-6 bg-green-600 text-white text-xs font-mono rounded">
              A1
            </div>
            <button 
              className="px-2 h-6 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              onClick={executeQuery}
            >
              Execute
            </button>
          </div>
          
          <Editor
            height="100%"
            defaultLanguage="sql"
            defaultValue={code}
            theme="vs-dark"
            onChange={handleEditorChange}
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

        {/* Right side - Output */}
        <div className="h-full bg-[#1E1E1E] p-4 overflow-auto">
          <div className="flex border-b border-[#444444] mb-4">
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
          </div>

          {activeTab === 'results' ? (
            queryResult?.error ? (
              <div className="text-red-500 font-mono">{queryResult.error}</div>
            ) : (
              <div className="text-white font-mono">
                {queryResult && (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {queryResult.columns.map((col) => (
                          <th key={col} className="border border-[#444444] px-2 py-1 text-left">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
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
            )
          ) : (
            <div className="text-white font-mono">
              {tables.map((table) => (
                <div key={table.name} className="mb-8">
                  <h3 className="text-lg font-medium mb-2">{table.name}</h3>
                  <div className="mb-2">
                    <span className="text-gray-400">Columns: </span>
                    <span className="text-green-400">{table.columns.join(', ')}</span>
                  </div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {table.columns.map((col) => (
                          <th key={col} className="border border-[#444444] px-2 py-1 text-left">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
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
          )}
        </div>
      </Split>
    </main>
  );
} 