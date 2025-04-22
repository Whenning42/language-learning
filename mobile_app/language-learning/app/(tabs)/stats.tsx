import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { sessions_table } from '../../db/schema';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { sum } from 'drizzle-orm';

const expo = SQLite.openDatabaseSync('db.db');
const db = drizzle(expo);

function round_to_tenths(n) {
  return Math.round(n * 10) / 10;
}

export default function StatsScreen() {
  const streak = "2"

  const [total_hours, set_total_hours] = useState(0);

  useFocusEffect(
    useCallback(() => {
      async function f() {
        const res = await db.select({value: sum(sessions_table.length_minutes)}).from(sessions_table);
        const total_minutes = Number(res[0].value);
        console.log("total_minutes:", total_minutes);
        set_total_hours(round_to_tenths(total_minutes / 60));
      };
      f();
    }, [])
  );

  return (
    <SafeAreaView>
      <ThemedText>Stats:</ThemedText>
      <ThemedText>  You've studied for {streak} of the last 7 days. (Goal 5+ days)</ThemedText>
      <ThemedText>  You've studied for {total_hours} hours in total.</ThemedText>
    </SafeAreaView>
  )
}
