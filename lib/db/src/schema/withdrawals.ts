import { pgTable, text, uuid, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { artistsTable } from "./artists";

export const withdrawalsTable = pgTable("withdrawals", {
  id: uuid("id").primaryKey().defaultRandom(),
  artistId: uuid("artist_id").notNull().references(() => artistsTable.id),
  amountCzk: numeric("amount_czk", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  qrCodeData: text("qr_code_data"),
  requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
});

export const insertWithdrawalSchema = createInsertSchema(withdrawalsTable).omit({ id: true, requestedAt: true });
export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;
export type Withdrawal = typeof withdrawalsTable.$inferSelect;
