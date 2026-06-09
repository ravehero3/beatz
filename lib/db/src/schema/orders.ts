import { pgTable, text, uuid, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { profilesTable } from "./profiles";
import { artistsTable } from "./artists";
import { beatsTable } from "./beats";

export const ordersTable = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  buyerId: uuid("buyer_id").notNull().references(() => profilesTable.id),
  artistId: uuid("artist_id").notNull().references(() => artistsTable.id),
  beatId: uuid("beat_id").notNull().references(() => beatsTable.id),
  licenseType: text("license_type").notNull(),
  amountCzk: numeric("amount_czk", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  variableSymbol: text("variable_symbol"),
  qrCodeData: text("qr_code_data"),
  licensePdfUrl: text("license_pdf_url"),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
