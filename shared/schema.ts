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

// Notifications/Alerts table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // margin_call, quality_drift, out_bid, fx_breach, payout_delay
  title: text("title").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  read: boolean("read").notNull().default(false),
  actionUrl: text("action_url"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Lender Pools table
export const lenderPools = pgTable("lender_pools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  aprRate: decimal("apr_rate", { precision: 5, scale: 2 }).notNull(),
  totalCapacity: decimal("total_capacity", { precision: 15, scale: 2 }).notNull(),
  availableCapacity: decimal("available_capacity", { precision: 15, scale: 2 }).notNull(),
  riskTier: text("risk_tier").notNull().default("medium"), // low, medium, high
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ESG Metrics table
export const esgMetrics = pgTable("esg_metrics", {
  id: serial("id").primaryKey(),
  factoryId: text("factory_id").notNull(),
  environmentalScore: decimal("environmental_score", { precision: 5, scale: 2 }).notNull(),
  socialScore: decimal("social_score", { precision: 5, scale: 2 }).notNull(),
  governanceScore: decimal("governance_score", { precision: 5, scale: 2 }).notNull(),
  overallScore: decimal("overall_score", { precision: 5, scale: 2 }).notNull(),
  certifications: text("certifications").array(),
  assessmentDate: timestamp("assessment_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Factory Flags table
export const factoryFlags = pgTable("factory_flags", {
  id: serial("id").primaryKey(),
  factoryId: text("factory_id").notNull(),
  flaggedBy: integer("flagged_by").notNull(),
  flagType: text("flag_type").notNull(), // payout_delay, quality_issue, esg_concern
  description: text("description").notNull(),
  severity: text("severity").notNull().default("medium"), // low, medium, high, critical
  status: text("status").notNull().default("open"), // open, investigating, resolved
  assignedTo: integer("assigned_to"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Payment Methods table
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // wallet, bank_account, ach, wire
  provider: text("provider"), // mpesa, ach_provider, bank_name
  accountDetails: json("account_details"),
  isDefault: boolean("is_default").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// OTP Sessions table
export const otpSessions = pgTable("otp_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sessionId: text("session_id").notNull().unique(),
  otpCode: text("otp_code").notNull(),
  purpose: text("purpose").notNull(), // payment, auth, transfer
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").notNull().default(false),
  attempts: integer("attempts").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Workflow Engine tables
export const workflowDefinitions = pgTable("workflow_definitions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // bid_processing, payment_approval, etc.
  stages: json("stages").notNull(), // Array of stage definitions
  rules: json("rules"), // Business rules and conditions
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const workflowInstances = pgTable("workflow_instances", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").notNull(),
  entityType: text("entity_type").notNull(), // bid, payment, etc.
  entityId: text("entity_id").notNull(),
  currentStage: text("current_stage").notNull(),
  status: text("status").notNull().default("active"), // active, completed, failed, cancelled
  data: json("data"), // Workflow-specific data
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const approvalWorkflows = pgTable("approval_workflows", {
  id: serial("id").primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  approvalType: text("approval_type").notNull(), // payout, split, payment, etc.
  requiredApprovers: json("required_approvers").notNull(), // Array of user IDs or roles
  currentLevel: integer("current_level").notNull().default(1),
  totalLevels: integer("total_levels").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, cancelled
  amountThreshold: decimal("amount_threshold", { precision: 15, scale: 2 }),
  initiatedBy: integer("initiated_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const approvalActions = pgTable("approval_actions", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").notNull(),
  approverId: integer("approver_id").notNull(),
  action: text("action").notNull(), // approve, reject, request_changes
  level: integer("level").notNull(),
  comments: text("comments"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Payment Matching Engine
export const paymentInflows = pgTable("payment_inflows", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  payerName: text("payer_name"),
  payerAccount: text("payer_account"),
  bankReference: text("bank_reference"),
  receivedDate: timestamp("received_date").notNull(),
  matchedBidId: text("matched_bid_id"),
  matchScore: decimal("match_score", { precision: 5, scale: 2 }),
  matchStatus: text("match_status").notNull().default("unmatched"), // unmatched, auto_matched, manual_matched, disputed
  matchedBy: integer("matched_by"),
  matchedAt: timestamp("matched_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const paymentMatchingRules = pgTable("payment_matching_rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  priority: integer("priority").notNull().default(1),
  conditions: json("conditions").notNull(), // Match conditions
  actions: json("actions").notNull(), // Actions to perform on match
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Document Management
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  documentId: text("document_id").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // e_slip, invoice, certificate, contract, etc.
  entityType: text("entity_type").notNull(), // bid, lot, payment, etc.
  entityId: text("entity_id").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  version: integer("version").notNull().default(1),
  status: text("status").notNull().default("draft"), // draft, sent, signed, archived
  generatedBy: integer("generated_by"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const emailQueue = pgTable("email_queue", {
  id: serial("id").primaryKey(),
  to: text("to").notNull(),
  cc: text("cc"),
  bcc: text("bcc"),
  subject: text("subject").notNull(),
  htmlBody: text("html_body").notNull(),
  textBody: text("text_body"),
  attachments: json("attachments"), // Array of document IDs
  priority: text("priority").notNull().default("normal"), // low, normal, high
  status: text("status").notNull().default("queued"), // queued, sent, failed, retrying
  attempts: integer("attempts").notNull().default(0),
  lastError: text("last_error"),
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const smsQueue = pgTable("sms_queue", {
  id: serial("id").primaryKey(),
  to: text("to").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull().default("normal"),
  status: text("status").notNull().default("queued"),
  attempts: integer("attempts").notNull().default(0),
  lastError: text("last_error"),
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Auto Listing Rules table
export const autoListingRules = pgTable("auto_listing_rules", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull(),
  factoryId: text("factory_id").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  grade: text("grade").notNull(),
  minQuantity: integer("min_quantity").notNull(),
  reservePrice: decimal("reserve_price", { precision: 10, scale: 2 }).notNull(),
  listingSchedule: text("listing_schedule").notNull(), // immediate, daily, weekly
  qualityThreshold: integer("quality_threshold").notNull(),
  autoApprove: boolean("auto_approve").notNull().default(false),
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
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertLenderPoolSchema = createInsertSchema(lenderPools).omit({ id: true, createdAt: true });
export const insertEsgMetricSchema = createInsertSchema(esgMetrics).omit({ id: true, createdAt: true });
export const insertFactoryFlagSchema = createInsertSchema(factoryFlags).omit({ id: true, createdAt: true });
export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({ id: true, createdAt: true });
export const insertOtpSessionSchema = createInsertSchema(otpSessions).omit({ id: true, createdAt: true });
export const insertAutoListingRuleSchema = createInsertSchema(autoListingRules).omit({ createdAt: true });

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
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type LenderPool = typeof lenderPools.$inferSelect;
export type InsertLenderPool = z.infer<typeof insertLenderPoolSchema>;
export type EsgMetric = typeof esgMetrics.$inferSelect;
export type InsertEsgMetric = z.infer<typeof insertEsgMetricSchema>;
export type FactoryFlag = typeof factoryFlags.$inferSelect;
export type InsertFactoryFlag = z.infer<typeof insertFactoryFlagSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type OtpSession = typeof otpSessions.$inferSelect;
export type InsertOtpSession = z.infer<typeof insertOtpSessionSchema>;
export type AutoListingRule = typeof autoListingRules.$inferSelect;
export type InsertAutoListingRule = z.infer<typeof insertAutoListingRuleSchema>;