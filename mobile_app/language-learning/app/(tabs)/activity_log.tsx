import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db_context } from '../db_provider';

import { sessions_table } from '../../db/schema';
import React, { useState, useContext } from 'react';
import { useFocusEffect } from 'expo-router';

export function render_session(session) {
  const date = new Date(session.end_time * 1000);
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const formatted_date = formatter.format(date);
  const rounded_minutes = Math.round(session.length_minutes);
  return `${formatted_date}: Studied for ${rounded_minutes} minutes.`;
}

export default function ActivityLogScreen() {
  const [sessions, set_sessions] = useState([]);
  const db = useContext(db_context);

  console.log("Rendering activity log with db:", db !== null);

  useFocusEffect(
    // Used to be wrapped in a useCallback, why?
    () => {
      async function f() {
        console.log("Fetching activities with db:", db !== null);
        if (db === null) {
          return;
        }

        const sessions = await db.select().from(sessions_table);
        set_sessions(sessions);
      }

      f();
    }, [db]);

  const rendered_sessions = sessions.map(
    session => 
      <ThemedText key={String(session.id)}>
        {render_session(session)}
      </ThemedText>
  );

  return (
    <SafeAreaView>
      {rendered_sessions}
    </SafeAreaView>
  )
}
