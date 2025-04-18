'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Split from 'react-split';

interface QueryResult {
  columns: string[];
  // eslint-disable-next-line
  rows: any[];
  error?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line
    sqlite3InitModule: any;
  }
}

export default function ExercisesPage() {
  const [code, setCode] = useState('');
  // eslint-disable-next-line
  const [sqlite3, setSqlite3] = useState<any>(null);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  // eslint-disable-next-line
  const [db, setDb] = useState<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@antonz/sqlean/dist/sqlean.mjs';
    script.type = 'module';
    script.async = true;
    
    script.onload = async () => {
      try {
        const sqlite3 = await window.sqlite3InitModule({
          print: console.log,
          printErr: console.error,
        });
        setSqlite3(sqlite3);
        
        const version = sqlite3.capi.sqlite3_libversion();
        console.log(`Loaded SQLite ${version}`);

        // Initialize database
        const newDb = new sqlite3.oo1.DB();
        newDb.exec(SCHEMA);
        setDb(newDb);
      } catch (error) {
        console.error('Failed to load SQLite:', error);
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  const executeQuery = () => {
    if (!db) {
      setQueryResult({ columns: [], rows: [], error: 'Database not initialized' });
      return;
    }

    try {
      // eslint-disable-next-line
      const rows: any[] = [];
      db.exec({
        sql: code,
        rowMode: "object",
        resultRows: rows,
      });

      if (rows.length > 0) {
        const columns = Object.keys(rows[0]);
        setQueryResult({ columns, rows });
      } else {
        setQueryResult({ columns: [], rows: [], error: 'No results' });
      }
    } catch (error) {
      setQueryResult({ 
        columns: [], 
        rows: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const SCHEMA = `
create table employees(id, name, salary, avavava);
insert into employees values
(1, 'Alice', 120, 1000),
(2, 'Bob', 100, 1000),
(3, 'Cindy', 80, 1000);
`;

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
          {queryResult?.error ? (
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
          )}
        </div>
      </Split>
    </main>
  );
} 