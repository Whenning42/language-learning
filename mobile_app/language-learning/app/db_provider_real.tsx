import * as SQLite from 'expo-sqlite';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { db_context } from "./db_context";

const expoDb = SQLite.openDatabaseSync("db.db");
const db = drizzle(expoDb);
migrate(db, { migrationsFolder: "./drizzle" });

export function get_db() {
  return db;
}

export default function DBProviderReal({children}) {
  return (<db_context.Provider value={db}>
    {children}
  </db_context.Provider>);
}
