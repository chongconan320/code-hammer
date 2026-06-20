import {
  bigint,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { organizations } from "./tenant";

/* ── Plans ── */

export const plans = pgTable("plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  limits: jsonb("limits")
    .$type<{
      maxDocuments: number;
      maxAiMessages: number;
      maxStorageBytes: number;
      maxWorkflowRuns: number;
      maxMembers: number;
    }>()
    .notNull(),
  stripePriceId: text("stripe_price_id"),
});

/* ── Subscriptions ── */

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id),
  planId: text("plan_id")
    .notNull()
    .references(() => plans.id),
  status: text("status", {
    enum: ["trialing", "active", "past_due", "canceled", "inactive"],
  }).notNull(),
  currentPeriodStart: timestamp("current_period_start", {
    withTimezone: true,
  }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", {
    withTimezone: true,
  }).notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ── Usage records ── */

export const usageRecords = pgTable("usage_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id),
  periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
  documentsCount: integer("documents_count").notNull().default(0),
  aiMessagesCount: integer("ai_messages_count").notNull().default(0),
  storageBytes: bigint("storage_bytes", { mode: "number" })
    .notNull()
    .default(0),
  workflowRunsCount: integer("workflow_runs_count").notNull().default(0),
});
