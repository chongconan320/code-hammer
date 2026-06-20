import type { Express, Response } from "express";
import { z } from "zod";
import { BillingError, billingService } from "../billing/service";
import type { AuthenticatedRequest } from "../auth/middleware";
import { requireAuth } from "../auth/middleware";
import { tenantService } from "../tenant/service";
import { validateRequest } from "../validation";

/* reuse existing tenant helper to resolve the user's organization */
async function resolveOrganization(request: AuthenticatedRequest) {
  const organizations = await tenantService.listForUser(request.user.id);
  return organizations[0] ?? null;
}

export function registerBillingRoutes(app: Express) {
  app.get("/billing/plan", requireAuth, async (request, response, next) => {
    try {
      const org = await resolveOrganization(request as AuthenticatedRequest);
      if (!org) {
        response.status(404).json({
          error: "no_organization",
          message: "No organization found for the current user.",
        });
        return;
      }

      const subscription = billingService.getSubscription(org.organization.id);
      const plan = subscription
        ? billingService.getPlan(subscription.planId)
        : undefined;
      const usage = billingService.getUsage(org.organization.id);

      if (!subscription || !plan) {
        response.status(404).json({
          error: "no_subscription",
          message: "No subscription found for this organization.",
        });
        return;
      }

      response.json({
        plan,
        subscription,
        limits: plan.limits,
        usage,
      });
    } catch (error) {
      handleBillingError(error, response, next);
    }
  });

  app.get("/billing/usage", requireAuth, async (request, response, next) => {
    try {
      const org = await resolveOrganization(request as AuthenticatedRequest);
      if (!org) {
        response.status(404).json({
          error: "no_organization",
          message: "No organization found for the current user.",
        });
        return;
      }

      const usage = billingService.getUsage(org.organization.id);
      const subscription = billingService.getSubscription(org.organization.id);
      const plan = subscription
        ? billingService.getPlan(subscription.planId)
        : undefined;

      response.json({
        usage,
        limits: plan?.limits ?? null,
      });
    } catch (error) {
      handleBillingError(error, response, next);
    }
  });
}

function handleBillingError(
  error: unknown,
  response: Response,
  next: (error: unknown) => void,
) {
  if (error instanceof BillingError) {
    response.status(error.statusCode).json({
      error: error.code,
      message: error.message,
    });
    return;
  }

  next(error);
}
