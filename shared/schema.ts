import { pgTable, text, serial, integer, boolean, decimal, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // producer, buyer, ktda_ro, ops_admin
  workspace: text("workspace").notNull(), // Producer, Buyer, KTDA Board
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
});

// Lots table
export const lots = pgTable("lots", {
  id: serial("id").primaryKey(),
  lotId: text("lot_id").notNull().unique(),
  saleNo: text("sale_no").notNull(),
  factory: text("factory").notNull(),
  grade: text("grade").notNull(),
  kg: decimal("kg", { precision: 10, scale: 2 }).notNull(),
  offerPrice: decimal("offer_price", { precision: 10, scale: 2 }).notNull(),
  reservePrice: decimal("reserve_price", { precision: 10, scale: 2 }).notNull(),
  qualityStars: integer("quality_stars").notNull().default(0),
  esgCertified: boolean("esg_certified").notNull().default(false),
  status: text("status").notNull().default("draft"), // draft, catalogue, live, sold
  canBid: boolean("can_bid").notNull().default(true),
  canInstantCash: boolean("can_instant_cash").notNull().default(false),
  auctionEndTime: timestamp("auction_end_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Bids table
export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  lotId: text("lot_id").notNull(),
  bidderId: integer("bidder_id").notNull(),
  bidAmount: decimal("bid_amount", { precision: 10, scale: 2 }).notNull(),
  fxRate: decimal("fx_rate", { precision: 10, scale: 4 }),
  lockFx: boolean("lock_fx").notNull().default(false),
  isWinning: boolean("is_winning").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Invoices table
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  buyerId: integer("buyer_id").notNull(),
  lotIds: text("lot_ids").array().notNull(),
  amountUSD: decimal("amount_usd", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, in_clearing, paid
  paymentMethod: text("payment_method"), // wallet, wire
  createdAt: timestamp("created_at").notNull().defaultNow(),
  paidAt: timestamp("paid_at"),
});

// Wallets table
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  currency: text("currency").notNull(), // KES, USD
  balance: decimal("balance", { precision: 15, scale: 2 }).notNull().default("0"),
  availableBalance: decimal("available_balance", { precision: 15, scale: 2 }).notNull().default("0"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Instant Cash Advances table
export const instantCashAdvances = pgTable("instant_cash_advances", {
  id: serial("id").primaryKey(),
  lotId: text("lot_id").notNull(),
  producerId: integer("producer_id").notNull(),
  advanceAmount: decimal("advance_amount", { precision: 10, scale: 2 }).notNull(),
  ltvPercentage: integer("ltv_percentage").notNull(),
  aprRate: decimal("apr_rate", { precision: 5, scale: 2 }).notNull(),
  status: text("status").notNull().default("active"), // active, repaid
  createdAt: timestamp("created_at").notNull().defaultNow(),
  repaidAt: timestamp("repaid_at"),
});

// FX Locks table
export const fxLocks = pgTable("fx_locks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amountUSD: decimal("amount_usd", { precision: 10, scale: 2 }).notNull(),
  lockedRate: decimal("locked_rate", { precision: 10, scale: 4 }).notNull(),
  duration: text("duration").notNull(), // 1h, 6h, 24h, 7d
  status: text("status").notNull().default("active"), // active, expired, used
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insurance Policies table
export const insurancePolicies = pgTable("insurance_policies", {
  id: serial("id").primaryKey(),
  policyNumber: text("policy_number").notNull().unique(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // drought, quality, marine
  coverageAmount: decimal("coverage_amount", { precision: 10, scale: 2 }).notNull(),
  premiumAmount: decimal("premium_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("quoted"), // quoted, bound, claim_triggered, paid
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Wire Transfers table
export const wireTransfers = pgTable("wire_transfers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  direction: text("direction").notNull(), // inbound, outbound
  status: text("status").notNull().default("in_clearing"), // in_clearing, cleared, overdue
  reference: text("reference").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  clearedAt: timestamp("cleared_at"),
});

// Activities table for recent activity feed
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // bid_won, invoice_paid, fx_locked, etc.
  description: text("description").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertLotSchema = createInsertSchema(lots).omit({ id: true, createdAt: true });
export const insertBidSchema = createInsertSchema(bids).omit({ id: true, createdAt: true });
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true });
export const insertWalletSchema = createInsertSchema(wallets).omit({ id: true, updatedAt: true });
export const insertInstantCashAdvanceSchema = createInsertSchema(instantCashAdvances).omit({ id: true, createdAt: true });
export const insertFxLockSchema = createInsertSchema(fxLocks).omit({ id: true, createdAt: true });
export const insertInsurancePolicySchema = createInsertSchema(insurancePolicies).omit({ id: true, createdAt: true });
export const insertWireTransferSchema = createInsertSchema(wireTransfers).omit({ id: true, createdAt: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Lot = typeof lots.$inferSelect;
export type InsertLot = z.infer<typeof insertLotSchema>;
export type Bid = typeof bids.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type InstantCashAdvance = typeof instantCashAdvances.$inferSelect;
export type InsertInstantCashAdvance = z.infer<typeof insertInstantCashAdvanceSchema>;
export type FxLock = typeof fxLocks.$inferSelect;
export type InsertFxLock = z.infer<typeof insertFxLockSchema>;
export type InsurancePolicy = typeof insurancePolicies.$inferSelect;
export type InsertInsurancePolicy = z.infer<typeof insertInsurancePolicySchema>;
export type WireTransfer = typeof wireTransfers.$inferSelect;
export type InsertWireTransfer = z.infer<typeof insertWireTransferSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
