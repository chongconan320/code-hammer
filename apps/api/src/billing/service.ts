import {
  DEFAULT_PLANS,
  type Plan,
  type Subscription,
  type SubscriptionStatus,
  type UsageSummary,
} from "@code-hammer/shared";
import { randomBytes } from "node:crypto";

export class BillingService {
  /* in-memory stores */
  private readonly plansById = new Map<string, Plan>();
  private readonly subscriptionsByOrgId = new Map<string, Subscription>();
  private readonly usageByOrgId = new Map<string, UsageSummary>();

  constructor() {
    /* seed default plans */
    for (const plan of DEFAULT_PLANS) {
      this.plansById.set(plan.id, plan);
    }
  }

  /* ── Plans ── */

  getPlan(planId: string): Plan | undefined {
    return this.plansById.get(planId);
  }

  listPlans(): Plan[] {
    return [...this.plansById.values()];
  }

  /* ── Subscriptions ── */

  getSubscription(organizationId: string): Subscription | undefined {
    return this.subscriptionsByOrgId.get(organizationId);
  }

  createTrialSubscription(organizationId: string): Subscription {
    const now = new Date();
    const subscription: Subscription = {
      id: randomId("sub"),
      organizationId,
      planId: "free",
      status: "trialing",
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: new Date(
        now.getTime() + 1000 * 60 * 60 * 24 * 14,
      ).toISOString(), // 14-day trial
    };

    this.subscriptionsByOrgId.set(organizationId, subscription);
    return subscription;
  }

  /* ── Usage ── */

  getUsage(organizationId: string): UsageSummary {
    return (
      this.usageByOrgId.get(organizationId) ?? {
        organizationId,
        periodStart: new Date().toISOString(),
        documents: 0,
        aiMessages: 0,
        storageBytes: 0,
        workflowRuns: 0,
      }
    );
  }

  createUsageRecord(organizationId: string): UsageSummary {
    const usage: UsageSummary = {
      organizationId,
      periodStart: new Date().toISOString(),
      documents: 0,
      aiMessages: 0,
      storageBytes: 0,
      workflowRuns: 0,
    };

    this.usageByOrgId.set(organizationId, usage);
    return usage;
  }
}

export class BillingError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
  }
}

export const billingService = new BillingService();

function randomId(prefix: string) {
  return `${prefix}_${randomBytes(24).toString("base64url")}`;
}
