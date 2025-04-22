import {Text, ScrollView, Button, View, StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useFocusEffect, useRouter } from 'expo-router';

import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { sessions_table } from '../../db/schema';
import React, { useCallback, useEffect, useState } from 'react';
import { gte } from 'drizzle-orm';

const expo = SQLite.openDatabaseSync('db.db');
const db = drizzle(expo);

export default function HomeScreen() {
  const streak = "0 days";
  const router = useRouter();

  const [todays_minutes, set_todays_minutes] = useState(0);

  useFocusEffect(
    useCallback(() => {load_todays_sessions();}, [])
  );

  // TODO: Pull activities from today to populate today's status.
  async function load_todays_sessions() {
    const today_start_date = new Date(new Date().setHours(0, 0, 0, 0));
    const today_start_seconds = today_start_date.getTime() / 1000;

    const activites_today = await db.select().from(sessions_table).where(gte(sessions_table.end_time, today_start_seconds));
    const minutes_today = activites_today.reduce((sum, activity) => sum + activity.length_minutes, 0);
    set_todays_minutes(Math.round(minutes_today));
  }
  
  return (
    <SafeAreaView>
      <ScrollView>
        <ThemedText>Today: Studied for {todays_minutes} minutes.</ThemedText>
        <ThemedText>Streak: {streak}</ThemedText>
        <ThemedText>Goals:</ThemedText>
        <ThemedText>    Study 30 minutes, 5 times per week:</ThemedText>
        <ThemedText>    Read "Neu in Die Stadt"</ThemedText>
        <ThemedText>    Study for 150 hours (reach B1)</ThemedText>
        <View style={styles.button_container_1}>
          <View style={styles.button_container_2}>
            <Button title="Start Activity" onPress={() => router.navigate("/activity_screen")} color={"#009900"}/>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  button_container_1: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  button_container_2: {
    width: "40%",
  },
});
