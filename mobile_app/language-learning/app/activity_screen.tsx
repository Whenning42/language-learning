import {useState, useEffect} from 'react';
import {View, StyleSheet, Button} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation } from 'expo-router';


const start_color = "#009900";
const pause_color = "#ffaa00";

export default function ActivityScreen() {
  const navigation = useNavigation();
  const goal_time = "30:00";

  const [clock, setClock] = useState({
    cur_time: 0,
    paused: true,
  });

  const renderTime = (seconds: number) => {
      var minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      var ms = String(minutes).padStart(2, "0");
      var ss = String(seconds).padStart(2, "0");
      return ms + ":" + ss;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setClock((clk) => {
        if (clk.paused) {
            return clk;
        }

        return {...clk, cur_time: clk.cur_time + 1};
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const onToggle = () => {
    const paused = !clock.paused;
    setClock({...clock, paused: paused});
  }

  const current_time = renderTime(clock.cur_time);
  const toggle_text = clock.paused ? "Start" : "Pause";
  const toggle_color = clock.paused ? start_color : pause_color;

  return (
    <View>
      <ThemedText>Goal: Study for 30 minutes.</ThemedText>
      <ThemedText>{current_time} / {goal_time}</ThemedText>
      <View style={styles.button_container}>
        <View style={styles.button}>
          <Button title={toggle_text} color={toggle_color} onPress={onToggle}/>
        </View>
        <View style={styles.button}>
          <Button
            title="End"
            color="#cc0000"
            onPress={() => {navigation.navigate("finish_activity", {session_length_minutes: clock.cur_time / 60})}}/>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
    width: 100,
  }
});
