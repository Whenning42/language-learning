import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StatsScreen() {
  const total_hours = "10";
  const streak = "2"

  return (
    <SafeAreaView>
      <ThemedText>Stats:</ThemedText>
      <ThemedText>  You've studied for {streak} of the last 7 days. (Goal 5+ days)</ThemedText>
      <ThemedText>  You've studied for {total_hours} hours in total.</ThemedText>
    </SafeAreaView>
  )
}
