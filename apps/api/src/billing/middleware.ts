import type { LimitResource } from "@code-hammer/shared";
import type { NextFunction, Request, Response } from "express";
import { billingService } from "./service";
import type { AuthenticatedRequest } from "../auth/middleware";
import { tenantService } from "../tenant/service";

/**
 * Middleware that checks whether the current user's organization
 * is within the plan limit for the given resource.
 *
 * Usage:  app.post('/documents', requireAuth, requirePlanLimit('maxDocuments'), handler)
 */
export function requirePlanLimit(resource: LimitResource) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const orgs = await tenantService.listForUser(
      (request as AuthenticatedRequest).user.id,
    );
    const org = orgs[0];

    if (!org) {
      response.status(404).json({
        error: "no_organization",
        message: "No organization found.",
      });
      return;
    }

    const subscription = billingService.getSubscription(org.organization.id);
    const plan = subscription
      ? billingService.getPlan(subscription.planId)
      : undefined;
    const usage = billingService.getUsage(org.organization.id);

    if (!plan || !subscription) {
      response.status(402).json({
        error: "no_subscription",
        message: "No active subscription found.",
      });
      return;
    }

    if (
      subscription.status === "past_due" ||
      subscription.status === "inactive"
    ) {
      response.status(402).json({
        error: "subscription_inactive",
        message: "Your subscription is not active. Please update your billing.",
      });
      return;
    }

    const usageMap: Record<LimitResource, number> = {
      maxDocuments: usage.documents,
      maxAiMessages: usage.aiMessages,
      maxStorageBytes: usage.storageBytes,
      maxWorkflowRuns: usage.workflowRuns,
      maxMembers: 0,
    };

    if (usageMap[resource] >= plan.limits[resource]) {
      response.status(403).json({
        error: "plan_limit_exceeded",
        message: `You have reached your plan limit for ${resource}. Upgrade to continue.`,
        usage: usageMap[resource],
        limit: plan.limits[resource],
      });
      return;
    }

    next();
  };
}
