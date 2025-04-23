import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db_context } from './db_context';

const db = drizzle("/tmp/test_db.db");
migrate(db, {
  migrationsFolder: "./drizzle"
});

export function get_db() {
  return db;
}

export default function DBProviderTest({children}) {
  return (<db_context.Provider value={db}>
    {children}
  </db_context.Provider>);
}
