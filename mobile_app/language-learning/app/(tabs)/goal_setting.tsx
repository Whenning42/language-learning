import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedText } from '@/components/ThemedText';

function DayPicker({schedule, setSchedule}) {
  function toggle_day_fn(day: string) {
    return () => {
      var val = !schedule[day];
      var new_sched = {...schedule}
      new_sched[day] = val;
      if (val == false) {
        new_sched.everyday = false;
      }
      setSchedule(new_sched);
    };
  }

  function uppercase(s: string) {
    return String(s).charAt(0).toUpperCase() + String(s).slice(1);
  }

  function PressBlock({label, value, onValueChange}) {
    // TODO: Figure out how to make these flex
    return (
      <Pressable style={styles.press_block} onPress={onValueChange}>
        <View style={styles.press_block_view}>
          <Checkbox value={value}/>
          <ThemedText>{label}</ThemedText>
        </View>
      </Pressable>
    );
  }

  function PickerRow({left_day, right_day}: {left_day: string, right_day: string}) {
    return (
      <View style={styles.day_row}>
        <PressBlock value={schedule.everyday || schedule[left_day]} onValueChange={toggle_day_fn(left_day)} label={uppercase(left_day)}/>
        <PressBlock value={schedule.everyday || schedule[right_day]} onValueChange={toggle_day_fn(right_day)} label={uppercase(right_day)}/>
      </View>
    );
  }

  return (
    <View>
      <PickerRow left_day="everyday" right_day="thursday"/>
      <PickerRow left_day="monday" right_day="friday"/>
      <PickerRow left_day="tuesday" right_day="saturday"/>
      <PickerRow left_day="wednesday" right_day="sunday"/>
    </View>

  );
}

export default function GoalsScreen() {
  const [minutes_per_day, setMinutesPerDay] = useState("30");
  const [days_per_week, setDaysPerWeek] = useState("5");

  const [schedule, setSchedule] = useState({
    everyday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  function ValueInput({value, onChangeText}) {
    const [current_text, setText] = useState(value);
    return (
      <TextInput
        style={styles.value_box}
        value={current_text}
        onChangeText={setText}
        onEndEditing={() => {onChangeText(current_text)}}
        keyboardType="numeric"/>
    )
  }

  return (
    <SafeAreaView>
      <ThemedText>Study Goal: </ThemedText>
      <View style={styles.study_row}>
        <ValueInput value={minutes_per_day} onChangeText={setMinutesPerDay}/>
        <ThemedText>Minutes per day</ThemedText>
      </View>
      <View style={styles.study_row}>
        <ThemedText>at least</ThemedText>
        <ValueInput value={days_per_week} onChangeText={setDaysPerWeek}/>
        <ThemedText>days per week</ThemedText>
      </View>

      <ThemedText>Study Schedule: </ThemedText>
      <DayPicker schedule={schedule} setSchedule={setSchedule}/>

      <ThemedText>Custom Goals: </ThemedText>
      <ThemedText>  TODO: Custom Goals</ThemedText>

      <ThemedText>TODO: Study reminders?</ThemedText>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  day_row: {
    flexDirection: "row",
  },

  press_block: {
    flexDirection: "row",
    flex: 1,
  },

  press_block_view: {
    flexDirection: "row",
    gap: 10,
    marginLeft: 20,
    height: 40,
    alignItems: "center",
  },

  study_row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  value_box: {
    color: "black",
    backgroundColor: "white",
    height: "100%",
    borderRadius: 8,
  },
});
