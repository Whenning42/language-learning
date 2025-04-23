// Mock useFocusEffect to useEffect so our tests can run without the expo-router,
// for which I never found a way to set up in unit tests.
jest.mock('expo-router', () => {
  const { useEffect } = require('react');
  const actualModule = jest.requireActual('expo-router');
  return {
    ...actualModule,
    useFocusEffect: (f) => { useEffect(f, [f]) },
  };
});

import { render, screen, waitFor } from '@testing-library/react-native';
import ActivityLogScreen, { render_session } from './activity_log';
import { sessions_table } from '../../db/schema'
import DBProviderTest, {get_db} from '../db_provider_test'

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
  const db = get_db();
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

  const on_db_init = jest.fn(() => {});
  render(
    <DBProviderTest>
      <ActivityLogScreen/>
    </DBProviderTest>
  );
  // Wait for sessions to be visible on the screen before running our assertions below.
  await waitFor(() => 
    expect(screen.queryAllByText("studied for", {exact: false}).length).toBeGreaterThan(0)
  );

  expect(await screen.getByText("Sunday, 04/20/2025: Studied for 20 minutes.")).toBeOnTheScreen();
  expect(await screen.getByText("Tuesday, 04/22/2025: Studied for 30 minutes.")).toBeOnTheScreen();
});
