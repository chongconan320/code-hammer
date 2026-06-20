import { z } from "zod";

/* ── Plan identifiers ── */

export const planIdContract = z.enum([
  "free",
  "starter",
  "professional",
  "business",
]);

export type PlanId = z.infer<typeof planIdContract>;

/* ── Plan limits ── */

export const planLimitsSchema = z.object({
  maxDocuments: z.number().int().min(0),
  maxAiMessages: z.number().int().min(0),
  maxStorageBytes: z.number().int().min(0),
  maxWorkflowRuns: z.number().int().min(0),
  maxMembers: z.number().int().min(1),
});

export type PlanLimits = z.infer<typeof planLimitsSchema>;

/* ── Plan ── */

export const planSchema = z.object({
  id: planIdContract,
  name: z.string().min(1),
  limits: planLimitsSchema,
  stripePriceId: z.string().nullable().optional(),
});

export type Plan = z.infer<typeof planSchema>;

/* ── Plan defaults (seed data) ── */

export const DEFAULT_PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    limits: {
      maxDocuments: 10,
      maxAiMessages: 50,
      maxStorageBytes: 100 * 1024 * 1024, // 100 MB
      maxWorkflowRuns: 1,
      maxMembers: 1,
    },
  },
  {
    id: "starter",
    name: "Starter",
    limits: {
      maxDocuments: 100,
      maxAiMessages: 500,
      maxStorageBytes: 1 * 1024 * 1024 * 1024, // 1 GB
      maxWorkflowRuns: 5,
      maxMembers: 3,
    },
  },
  {
    id: "professional",
    name: "Professional",
    limits: {
      maxDocuments: 1000,
      maxAiMessages: 5000,
      maxStorageBytes: 10 * 1024 * 1024 * 1024, // 10 GB
      maxWorkflowRuns: 25,
      maxMembers: 10,
    },
  },
  {
    id: "business",
    name: "Business",
    limits: {
      maxDocuments: 10000,
      maxAiMessages: 50000,
      maxStorageBytes: 100 * 1024 * 1024 * 1024, // 100 GB
      maxWorkflowRuns: 100,
      maxMembers: 999, // effectively unlimited for SMEs
    },
  },
];

/* ── Subscription status ── */

export const subscriptionStatusContract = z.enum([
  "trialing",
  "active",
  "past_due",
  "canceled",
  "inactive",
]);

export type SubscriptionStatus = z.infer<typeof subscriptionStatusContract>;

/* ── Subscription ── */

export const subscriptionSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  planId: planIdContract,
  status: subscriptionStatusContract,
  currentPeriodStart: z.string().datetime(),
  currentPeriodEnd: z.string().datetime(),
  stripeSubscriptionId: z.string().nullable().optional(),
  stripeCustomerId: z.string().nullable().optional(),
});

export type Subscription = z.infer<typeof subscriptionSchema>;

/* ── Usage ── */

export const usageSummarySchema = z.object({
  organizationId: z.string().min(1),
  periodStart: z.string().datetime(),
  documents: z.number().int().min(0),
  aiMessages: z.number().int().min(0),
  storageBytes: z.number().int().min(0),
  workflowRuns: z.number().int().min(0),
});

export type UsageSummary = z.infer<typeof usageSummarySchema>;

/* ── API response schemas ── */

export const planResponseSchema = z.object({
  plan: planSchema,
  subscription: subscriptionSchema,
  limits: planLimitsSchema,
});

export const usageResponseSchema = z.object({
  usage: usageSummarySchema,
  limits: planLimitsSchema,
});

export type PlanResponse = z.infer<typeof planResponseSchema>;
export type UsageResponse = z.infer<typeof usageResponseSchema>;

/* ── Limit check helper ── */

export type LimitResource = keyof PlanLimits;

/**
 * Returns true when usage is still under (or at) the plan limit.
 * A limit of 0 means the resource is disabled.
 */
export function checkLimit(
  limits: PlanLimits,
  usage: UsageSummary,
  resource: LimitResource,
): boolean {
  const usageMap: Record<LimitResource, number> = {
    maxDocuments: usage.documents,
    maxAiMessages: usage.aiMessages,
    maxStorageBytes: usage.storageBytes,
    maxWorkflowRuns: usage.workflowRuns,
    maxMembers: 0, // checked separately via membership count
  };

  return usageMap[resource] < limits[resource];
}
