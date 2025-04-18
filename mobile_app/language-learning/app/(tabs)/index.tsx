import {Text, ScrollView, Button, View, StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const today_status = "Done";
  const streak = "3 days";
  const router = useRouter();

  return (
    <SafeAreaView>
      <ScrollView>
        <ThemedText>Today: {today_status}</ThemedText>
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
