declare module '@antonz/sqlean' {
  interface SQLite3 {
    capi: {
      sqlite3_libversion(): string;
    };
    oo1: {
      DB: new () => {
        exec(sql: string | { sql: string; rowMode: string; resultRows: any[] }): void;
      };
    };
  }

  function sqlite3InitModule(options: {
    print: (msg: string) => void;
    printErr: (msg: string) => void;
  }): Promise<SQLite3>;

  export default sqlite3InitModule;
}

declare module '@antonz/sqlean/dist/sqlean.mjs' {
  export * from '@antonz/sqlean';
} 