import { pgTable, text, uuid, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { profilesTable } from "./profiles";

export const artistsTable = pgTable("artists", {
  id: uuid("id").primaryKey().references(() => profilesTable.id, { onDelete: "cascade" }),
  slug: text("slug").unique(),
  displayName: text("display_name"),
  bio: text("bio"),
  bannerUrl: text("banner_url"),
  profilePictureUrl: text("profile_picture_url"),
  storeTemplate: text("store_template").default("light"),
  storePrimaryColor: text("store_primary_color").default("#0A0A0A"),
  playerStyle: text("player_style").default("classic"),
  socialInstagram: text("social_instagram"),
  socialSoundcloud: text("social_soundcloud"),
  socialYoutube: text("social_youtube"),
  bankIban: text("bank_iban"),
  bankAccountName: text("bank_account_name"),
  fioApiToken: text("fio_api_token"),
  subscriptionTier: text("subscription_tier").default("free"),
  subscriptionStatus: text("subscription_status"),
  subscriptionEndsAt: timestamp("subscription_ends_at", { withTimezone: true }),
  balanceCzk: numeric("balance_czk", { precision: 10, scale: 2 }).default("0"),
  totalEarnedCzk: numeric("total_earned_czk", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertArtistSchema = createInsertSchema(artistsTable).omit({ createdAt: true });
export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Artist = typeof artistsTable.$inferSelect;
