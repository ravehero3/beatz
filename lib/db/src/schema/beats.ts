import { pgTable, text, uuid, numeric, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { artistsTable } from "./artists";

export const beatsTable = pgTable("beats", {
  id: uuid("id").primaryKey().defaultRandom(),
  artistId: uuid("artist_id").notNull().references(() => artistsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  slug: text("slug"),
  description: text("description"),
  bpm: integer("bpm"),
  key: text("key"),
  genre: text("genre"),
  mood: text("mood"),
  tags: text("tags").array(),
  coverUrl: text("cover_url"),
  audioPreviewUrl: text("audio_preview_url"),
  audioFullUrl: text("audio_full_url"),
  audioWavUrl: text("audio_wav_url"),
  priceBasic: numeric("price_basic", { precision: 10, scale: 2 }),
  pricePremium: numeric("price_premium", { precision: 10, scale: 2 }),
  priceExclusive: numeric("price_exclusive", { precision: 10, scale: 2 }),
  isExclusiveSold: boolean("is_exclusive_sold").notNull().default(false),
  plays: integer("plays").notNull().default(0),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBeatSchema = createInsertSchema(beatsTable).omit({ id: true, createdAt: true });
export type InsertBeat = z.infer<typeof insertBeatSchema>;
export type Beat = typeof beatsTable.$inferSelect;
