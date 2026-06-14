import { pgTable, text, uuid, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { beatsTable } from "./beats";
import { artistsTable } from "./artists";

export const beatLeadsTable = pgTable("beat_leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  beatId: uuid("beat_id").notNull().references(() => beatsTable.id, { onDelete: "cascade" }),
  artistId: uuid("artist_id").notNull().references(() => artistsTable.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  consentGiven: boolean("consent_given").notNull().default(false),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBeatLeadSchema = createInsertSchema(beatLeadsTable).omit({ id: true, createdAt: true });
export type InsertBeatLead = z.infer<typeof insertBeatLeadSchema>;
export type BeatLead = typeof beatLeadsTable.$inferSelect;
