import { View, Button, StyleSheet } from "react-native"
import { ThemedText } from "@/components/ThemedText"
import { useRouter } from "expo-router";
import { Picker } from '@react-native-picker/picker';

export default function FinishActivityScreen () {
  const router = useRouter();

  return (
    <View>
      <ThemedText>Goal: Read for 30 minutes</ThemedText>
      <ThemedText>Result: Read for 28 minutes</ThemedText>
      <ThemedText>Session Difficulty:</ThemedText>
      <Picker style={styles.picker}>
        <Picker.Item label="Easy" value="easy"/>
        <Picker.Item label="Medium" value="medium"/>
        <Picker.Item label="Hard" value="hard"/>
      </Picker>
      <ThemedText>Achieved Goal:</ThemedText>
      <Picker style={styles.picker}>
        <Picker.Item label="Yes" value="yes"/>
        <Picker.Item label="No" value="no"/>
      </Picker>
      <ThemedText>Other goals met:</ThemedText>
      <ThemedText>TODO: Support selecting other goals met</ThemedText>
      <Button title="Finish" onPress={() => {router.dismissAll()}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  picker: {
    color: "#aaaaaa"
  },
});
