import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { sessions_table } from '../../db/schema';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';

const expo = SQLite.openDatabaseSync('db.db');
const db = drizzle(expo);

export default function ActivityLogScreen() {
  const [sessions, setSessions] = useState([{}]);

  useFocusEffect(
    React.useCallback(() => {
      async function f() {
        const sessions = await db.select().from(sessions_table);
        setSessions(sessions);
      }
      f();
    }, [])
  );

  const rendered_sessions = sessions.map(session => <ThemedText key={String(session.id)}>Session: {session.id}, Length: {session.length_minutes} minutes</ThemedText>);

  return (
    <SafeAreaView>
      {rendered_sessions}
    </SafeAreaView>
  )
}
