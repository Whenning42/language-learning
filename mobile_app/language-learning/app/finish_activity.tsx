import { View, Button, StyleSheet } from "react-native"
import { ThemedText } from "@/components/ThemedText"
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';

import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { sessions_table } from '../db/schema';

const expo = SQLite.openDatabaseSync('db.db');
const db = drizzle(expo);


export default function FinishActivityScreen () {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [difficulty, setDifficulty] = useState("easy");
  const [achieved_goal, setAchievedGoal] = useState("yes");

  async function finish_activity() {
    // TODO: Log the activity info
    const session = {
      end_time: Math.round((new Date()).getTime() / 1000),
      length_minutes: Number(params.session_length_minutes),
      achieved_goal: Boolean(achieved_goal),
      rated_difficulty: difficulty,
    }
    console.log("Finished session:", session);
    await db.insert(sessions_table).values([session]);

    router.dismissAll();
  }

  return (
    <View>
      <ThemedText>Goal: Read for 30 minutes</ThemedText>
      <ThemedText>Result: Read for 28 minutes</ThemedText>
      <ThemedText>Session Difficulty:</ThemedText>
      <Picker
        selectedValue={difficulty}
        onValueChange={setDifficulty}
        style={styles.picker}>
        <Picker.Item label="Easy" value="easy"/>
        <Picker.Item label="Medium" value="medium"/>
        <Picker.Item label="Hard" value="hard"/>
      </Picker>
      <ThemedText>Achieved Goal:</ThemedText>
      <Picker
        selectedValue={achieved_goal}
        onValueChange={setAchievedGoal}
        style={styles.picker}>
        <Picker.Item label="Yes" value="yes"/>
        <Picker.Item label="No" value="no"/>
      </Picker>
      <ThemedText>Other goals met:</ThemedText>
      <ThemedText>TODO: Support selecting other goals met</ThemedText>
      <Button title="Finish" onPress={finish_activity}/>
    </View>
  )
}

const styles = StyleSheet.create({
  picker: {
    color: "#aaaaaa"
  },
});
