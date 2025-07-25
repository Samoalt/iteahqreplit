
import { pgTable, text, serial, integer, timestamp, json, boolean, decimal } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").notNull().default("user"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Core entities
export const entities = pgTable("entities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // buyer, producer, warehouse
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Payment inflows
export const paymentInflows = pgTable("payment_inflows", {
  id: serial("id").primaryKey(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("KES"),
  payerName: text("payer_name").notNull(),
  payerAccount: text("payer_account"),
  description: text("description"),
  status: text("status").notNull().default("pending"),
  matchedBidId: text("matched_bid_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Bids
export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  bidId: text("bid_id").notNull().unique(),
  buyerId: integer("buyer_id").references(() => entities.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Audit logs
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  action: text("action").notNull(),
  changes: json("changes"),
  performedBy: integer("performed_by").references(() => entities.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull().default("medium"),
  actionUrl: text("action_url"),
  metadata: json("metadata"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Email queue for notifications
export const emailQueue = pgTable("email_queue", {
  id: serial("id").primaryKey(),
  to: text("to").notNull(),
  subject: text("subject").notNull(),
  htmlBody: text("html_body").notNull(),
  textBody: text("text_body"),
  attachments: json("attachments").default([]),
  priority: text("priority").notNull().default("normal"),
  status: text("status").notNull().default("queued"),
  attempts: integer("attempts").notNull().default(0),
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  lastError: text("last_error"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// SMS queue
export const smsQueue = pgTable("sms_queue", {
  id: serial("id").primaryKey(),
  to: text("to").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull().default("normal"),
  status: text("status").notNull().default("queued"),
  attempts: integer("attempts").notNull().default(0),
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Workflow definitions
export const workflowDefinitions = pgTable("workflow_definitions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  type: text("type").notNull(),
  description: text("description"),
  stages: json("stages").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Workflow instances
export const workflowInstances = pgTable("workflow_instances", {
  id: serial("id").primaryKey(),
  workflowDefinitionId: integer("workflow_definition_id").references(() => workflowDefinitions.id).notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  currentStage: text("current_stage"),
  status: text("status").notNull().default("active"),
  data: json("data"),
  startedBy: integer("started_by").references(() => users.id),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Approval workflows
export const approvalWorkflows = pgTable("approval_workflows", {
  id: serial("id").primaryKey(),
  workflowInstanceId: integer("workflow_instance_id").references(() => workflowInstances.id).notNull(),
  stage: text("stage").notNull(),
  approverIds: json("approver_ids").notNull(),
  status: text("status").notNull().default("pending"),
  approvedBy: integer("approved_by").references(() => users.id),
  rejectedBy: integer("rejected_by").references(() => users.id),
  comments: text("comments"),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Documents (without Object Storage dependency)
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  documentId: text("document_id").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  fileUrl: text("file_url"),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  generatedBy: integer("generated_by").references(() => entities.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
