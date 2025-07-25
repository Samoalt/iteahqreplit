CREATE TABLE "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "approval_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflow_id" integer NOT NULL,
	"approver_id" integer NOT NULL,
	"action" text NOT NULL,
	"level" integer NOT NULL,
	"comments" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "approval_workflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"approval_type" text NOT NULL,
	"required_approvers" json NOT NULL,
	"current_level" integer DEFAULT 1 NOT NULL,
	"total_levels" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"amount_threshold" numeric(15, 2),
	"initiated_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auto_listing_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"factory_id" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"grade" text NOT NULL,
	"min_quantity" integer NOT NULL,
	"reserve_price" numeric(10, 2) NOT NULL,
	"listing_schedule" text NOT NULL,
	"quality_threshold" integer NOT NULL,
	"auto_approve" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bids" (
	"id" serial PRIMARY KEY NOT NULL,
	"lot_id" text NOT NULL,
	"bidder_id" integer NOT NULL,
	"bid_amount" numeric(10, 2) NOT NULL,
	"fx_rate" numeric(10, 4),
	"lock_fx" boolean DEFAULT false NOT NULL,
	"is_winning" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"file_url" text NOT NULL,
	"file_size" integer,
	"mime_type" text,
	"version" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"generated_by" integer,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "documents_document_id_unique" UNIQUE("document_id")
);
--> statement-breakpoint
CREATE TABLE "email_queue" (
	"id" serial PRIMARY KEY NOT NULL,
	"to" text NOT NULL,
	"cc" text,
	"bcc" text,
	"subject" text NOT NULL,
	"html_body" text NOT NULL,
	"text_body" text,
	"attachments" json,
	"priority" text DEFAULT 'normal' NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"scheduled_for" timestamp,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "esg_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"factory_id" text NOT NULL,
	"environmental_score" numeric(5, 2) NOT NULL,
	"social_score" numeric(5, 2) NOT NULL,
	"governance_score" numeric(5, 2) NOT NULL,
	"overall_score" numeric(5, 2) NOT NULL,
	"certifications" text[],
	"assessment_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "factory_flags" (
	"id" serial PRIMARY KEY NOT NULL,
	"factory_id" text NOT NULL,
	"flagged_by" integer NOT NULL,
	"flag_type" text NOT NULL,
	"description" text NOT NULL,
	"severity" text DEFAULT 'medium' NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"assigned_to" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "fx_locks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount_usd" numeric(10, 2) NOT NULL,
	"locked_rate" numeric(10, 4) NOT NULL,
	"duration" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "instant_cash_advances" (
	"id" serial PRIMARY KEY NOT NULL,
	"lot_id" text NOT NULL,
	"producer_id" integer NOT NULL,
	"advance_amount" numeric(10, 2) NOT NULL,
	"ltv_percentage" integer NOT NULL,
	"apr_rate" numeric(5, 2) NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"repaid_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "insurance_policies" (
	"id" serial PRIMARY KEY NOT NULL,
	"policy_number" text NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"coverage_amount" numeric(10, 2) NOT NULL,
	"premium_amount" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'quoted' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "insurance_policies_policy_number_unique" UNIQUE("policy_number")
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_number" text NOT NULL,
	"buyer_id" integer NOT NULL,
	"lot_ids" text[] NOT NULL,
	"amount_usd" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"payment_method" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"paid_at" timestamp,
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "lender_pools" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"apr_rate" numeric(5, 2) NOT NULL,
	"total_capacity" numeric(15, 2) NOT NULL,
	"available_capacity" numeric(15, 2) NOT NULL,
	"risk_tier" text DEFAULT 'medium' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lots" (
	"id" serial PRIMARY KEY NOT NULL,
	"lot_id" text NOT NULL,
	"sale_no" text NOT NULL,
	"factory" text NOT NULL,
	"grade" text NOT NULL,
	"kg" numeric(10, 2) NOT NULL,
	"offer_price" numeric(10, 2) NOT NULL,
	"reserve_price" numeric(10, 2) NOT NULL,
	"quality_stars" integer DEFAULT 0 NOT NULL,
	"esg_certified" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"can_bid" boolean DEFAULT true NOT NULL,
	"can_instant_cash" boolean DEFAULT false NOT NULL,
	"auction_end_time" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lots_lot_id_unique" UNIQUE("lot_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"action_url" text,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "otp_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"session_id" text NOT NULL,
	"otp_code" text NOT NULL,
	"purpose" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "otp_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "payment_inflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"currency" text NOT NULL,
	"payer_name" text,
	"payer_account" text,
	"bank_reference" text,
	"received_date" timestamp NOT NULL,
	"matched_bid_id" text,
	"match_score" numeric(5, 2),
	"match_status" text DEFAULT 'unmatched' NOT NULL,
	"matched_by" integer,
	"matched_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_matching_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"priority" integer DEFAULT 1 NOT NULL,
	"conditions" json NOT NULL,
	"actions" json NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"provider" text,
	"account_details" json,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sms_queue" (
	"id" serial PRIMARY KEY NOT NULL,
	"to" text NOT NULL,
	"message" text NOT NULL,
	"priority" text DEFAULT 'normal' NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"scheduled_for" timestamp,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"role" text NOT NULL,
	"workspace" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"currency" text NOT NULL,
	"balance" numeric(15, 2) DEFAULT '0' NOT NULL,
	"available_balance" numeric(15, 2) DEFAULT '0' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wire_transfers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"currency" text NOT NULL,
	"direction" text NOT NULL,
	"status" text DEFAULT 'in_clearing' NOT NULL,
	"reference" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"cleared_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "workflow_definitions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"stages" json NOT NULL,
	"rules" json,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workflow_instances" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflow_id" integer NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"current_stage" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"data" json,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
