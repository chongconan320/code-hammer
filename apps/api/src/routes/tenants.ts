import {
  addOrganizationMemberRequestSchema,
  createOrganizationRequestSchema,
  updateWorkspaceSettingsRequestSchema,
} from "@code-hammer/shared";
import type { Express, Response } from "express";
import { z } from "zod";
import { billingService } from "../billing/service";
import type { AuthenticatedRequest } from "../auth/middleware";
import { requireAuth } from "../auth/middleware";
import { authService } from "../auth/service";
import { TenantError, tenantService } from "../tenant/service";
import { validateRequest } from "../validation";

const organizationParamsSchema = z.object({
  organizationId: z.string().min(1),
});

const workspaceParamsSchema = z.object({
  workspaceId: z.string().min(1),
});

export function registerTenantRoutes(app: Express) {
  app.post(
    "/organizations",
    requireAuth,
    validateRequest({ body: createOrganizationRequestSchema }),
    async (request, response) => {
      const result = await tenantService.createOrganization(
        (request as AuthenticatedRequest).user.id,
        request.body,
      );

      billingService.createTrialSubscription(result.organization.id);
      billingService.createUsageRecord(result.organization.id);

      response.status(201).json(result);
    },
  );

  app.get("/organizations", requireAuth, async (request, response) => {
    response.json({
      organizations: await tenantService.listForUser(
        (request as AuthenticatedRequest).user.id,
      ),
    });
  });

  app.post(
    "/organizations/:organizationId/members",
    requireAuth,
    validateRequest({
      params: organizationParamsSchema,
      body: addOrganizationMemberRequestSchema,
    }),
    async (request, response, next) => {
      try {
        const user = await authService.findPublicUserByEmail(
          request.body.email,
        );
        if (!user) {
          response.status(404).json({
            error: "user_not_found",
            message: "User was not found.",
          });
          return;
        }

        response.status(201).json({
          membership: await tenantService.addMember(
            (request as AuthenticatedRequest).user.id,
            request.params.organizationId,
            user.id,
          ),
        });
      } catch (error) {
        handleTenantError(error, response, next);
      }
    },
  );

  app.get(
    "/workspaces/:workspaceId",
    requireAuth,
    validateRequest({ params: workspaceParamsSchema }),
    async (request, response, next) => {
      try {
        response.json({
          workspace: await tenantService.getWorkspace(
            (request as AuthenticatedRequest).user.id,
            request.params.workspaceId,
          ),
        });
      } catch (error) {
        handleTenantError(error, response, next);
      }
    },
  );

  app.patch(
    "/workspaces/:workspaceId/settings",
    requireAuth,
    validateRequest({
      params: workspaceParamsSchema,
      body: updateWorkspaceSettingsRequestSchema,
    }),
    async (request, response, next) => {
      try {
        response.json({
          workspace: await tenantService.updateWorkspaceSettings(
            (request as AuthenticatedRequest).user.id,
            request.params.workspaceId,
            request.body,
          ),
        });
      } catch (error) {
        handleTenantError(error, response, next);
      }
    },
  );
}

function handleTenantError(
  error: unknown,
  response: Response,
  next: (error: unknown) => void,
) {
  if (error instanceof TenantError) {
    response.status(error.statusCode).json({
      error: error.code,
      message: error.message,
    });
    return;
  }

  next(error);
}
