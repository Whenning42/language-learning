import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const sessions_table = sqliteTable("sessions_table", {
  id: integer().primaryKey({ autoIncrement: true }),
  end_time: integer().notNull(),
  length_minutes: real().notNull(),
  achieved_goal: integer({mode: "boolean"}),
  rated_difficulty: text({enum: ["easy", "medium", "hard"]}),
});
