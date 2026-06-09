import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { profilesTable } from "./profiles";
import { beatsTable } from "./beats";

export const savedBeatsTable = pgTable("saved_beats", {
  id: uuid("id").primaryKey().defaultRandom(),
  buyerId: uuid("buyer_id").notNull().references(() => profilesTable.id, { onDelete: "cascade" }),
  beatId: uuid("beat_id").notNull().references(() => beatsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSavedBeatSchema = createInsertSchema(savedBeatsTable).omit({ id: true, createdAt: true });
export type InsertSavedBeat = z.infer<typeof insertSavedBeatSchema>;
export type SavedBeat = typeof savedBeatsTable.$inferSelect;
