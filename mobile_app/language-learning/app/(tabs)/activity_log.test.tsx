jest.mock('expo-router', () => {
  const { useEffect } = require('react');
  const actualModule = jest.requireActual('expo-router');
  return {
    ...actualModule,
    useFocusEffect: useEffect,
  };
});

// import { render, screen, waitFor } from '@testing-library/react-native';
// import { renderRouter, screen, waitFor } from 'expo-router/testing-library';
import { render, screen, waitFor } from '@testing-library/react-native';
import ActivityLogScreen, { render_session } from './activity_log';
import { open_test_db } from '../db_provider';
import { sessions_table } from '../../db/schema'
import DBProvider from '../db_provider'
import { NavigationContext } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { act } from 'react';
import RootLayout from '../_layout';
import TabLayout from './_layout';

test('ActivityLogScreen session renders', async () => {
  const date_seconds = new Date(2025, 3, 20, 10, 5, 17, 18).getTime() / 1000;
  const session = {
    id: 10,
    end_time: date_seconds,
    length_minutes: 23.33,
    achieved_goal: 1,
    rated_difficulty: "easy",
  }

  expect(render_session(session)).toEqual("Sunday, 04/20/2025: Studied for 23 minutes.");
});

test('ActivityLogScreen renders all sessions in the db', async () => {
  // Set up the test DB.
  const db = await open_test_db();
  await db.delete(sessions_table);
  const end_1 = new Date(2025, 3, 20, 10, 5, 17, 18).getTime() / 1000;
  const end_2 = new Date(2025, 3, 22, 10, 5, 17, 18).getTime() / 1000;
  const sessions = [{
    id: 1,
    end_time: end_1,
    length_minutes: 20,
    achieved_goal: true,
    rated_difficulty: "easy" as const,
  }, {
    id: 2,
    end_time: end_2,
    length_minutes: 30,
    achieved_goal: false,
    rated_difficulty: "easy" as const,
  }];
  await db.insert(sessions_table).values(sessions);



  // Render the ActivityLogHomeScreen
  // const on_db_init = jest.fn(() => jest.fn());
  // renderRouter(
  //   <DBProvider use_test_db={true} on_db_init={on_db_init}>
  //     <ActivityLogScreen/>
  //     {/*
  //     <ThemedText>Howdy!</ThemedText>
  //     */}
  //   </DBProvider>
  // );
  // // We need to wait for the db to be initialized or we'll get an updated state outside
  // // of an act() warning/error.
  // await waitFor(() => expect(on_db_init).toHaveBeenCalled())

  // const on_db_init = jest.fn(() => jest.fn());
  // renderRouter(
  //   {
  //     '_layout': <RootLayout/>,
  //     '(tabs)/_layout': <TabLayout/>,
  //     '(tabs)/activity_log': () => {
  //           <DBProvider use_test_db={true} on_db_init={on_db_init}>
  //             <ThemedText>Howdy!</ThemedText>
  //           </DBProvider>,
  //     }
  //   },
  //   { initialUrl: '/activity_log' }
  // );

  // const nav_context = {
  //   isFocused: () => true,
  //   addListener: jest.fn(() => jest.fn()),
  // }
  // const on_db_init = jest.fn(() => jest.fn());
  // render(
  //   <NavigationContext.Provider value={nav_context}>
  //     <DBProvider use_test_db={true} on_db_init={on_db_init}>
  //       <ActivityLogScreen/>
  //       {/*
  //       <ThemedText>Howdy!</ThemedText>
  //       */}
  //     </DBProvider>
  //   </NavigationContext.Provider>
  // );

  const on_db_init = jest.fn(() => {});
  render(
    <DBProvider use_test_db={true} on_db_init={on_db_init}>
      <ActivityLogScreen/>
      {/*
      <ThemedText>Howdy!</ThemedText>
      */}
    </DBProvider>
  );
  // Wait for sessions to be visible on the screen before running our assertions below.
  await waitFor(() => 
    expect(screen.queryAllByText("studied for", {exact: false}).length).toBeGreaterThan(0)
  );

  console.log(render_session(sessions[0]));
  expect(await screen.getByText("Sunday, 04/20/2025: Studied for 20 minutes.")).toBeOnTheScreen();
  expect(await screen.getByText("Tuesday, 04/22/2025: Studied for 30 minutes.")).toBeOnTheScreen();

  // We need to wait for the db to be initialized or we'll get an updated state outside
  // of an act() warning/error.
  // await waitFor(() => expect(on_db_init).toHaveBeenCalled())
  // TODO: Render the activity log screen using the test DB context provider.


  // TODO:
  // ✓ Set up the test DB.
  // ✓ Add a couple of sessions to the DB.
  // > Verify that the rendered screen matches the rendered sessions.
  // WIP: Implement a db provider
});
