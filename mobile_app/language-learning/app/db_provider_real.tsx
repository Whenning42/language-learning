import * as SQLite from 'expo-sqlite';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { db_context } from "./db_context";
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

const expoDb = SQLite.openDatabaseSync("db.db");
const db = drizzle(expoDb);
migrate(db, { migrationsFolder: "./drizzle" });

export function get_db() {
  return db;
}

export default function DBProviderReal({children}) {
  if (__DEV__) {
    useDrizzleStudio(expoDb);
  }

  return (<db_context.Provider value={db}>
    {children}
  </db_context.Provider>);
}
