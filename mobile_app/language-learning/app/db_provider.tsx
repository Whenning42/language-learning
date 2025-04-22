import * as SQLite from 'expo-sqlite';
import { drizzle as drizzle_expo } from 'drizzle-orm/expo-sqlite';
import { drizzle as drizzle_better_sqlite } from 'drizzle-orm/better-sqlite3';
import React, { useEffect, useState, createContext, ReactContext } from 'react';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import migrations from '../drizzle/migrations';
import { d } from 'drizzle-kit/index-BAUrj6Ib';
import { sessions_table } from '@/db/schema';

// Note: Consumers of the db_context must safely handle the case of the context's value
// being null prior to the db connection being open.
export const db_context: ReactContext<any> = createContext(null);

async function open_db(use_test_db=false) {
  if (use_test_db) {
    const db = drizzle_better_sqlite("/tmp/test_db.db");
    await migrate(db, {
        migrationsFolder: "./drizzle"
    });
    return db;
  } else {
    const db = SQLite.openDatabaseSync(use_test_db ? ":memory:" : "db.db");
    return drizzle_expo(db);
  }
}

export async function open_test_db() {
  return open_db(true);
}

export default function DBProvider({children, use_test_db=false}: {children: any, use_test_db: boolean}) {
  const [ db, set_db ] = useState(null);

  useEffect(() => {
    async function initialize_db() {
      const db = await open_db(use_test_db);
      set_db(db);
    }
    initialize_db();
  }, []);

  return <db_context.Provider value={db}>
    {children}
  </db_context.Provider>;
}
