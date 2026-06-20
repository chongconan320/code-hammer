import { updateProfileRequestSchema } from "@code-hammer/shared";
import type { Express } from "express";
import { readSessionToken } from "../auth/cookies";
import type { AuthenticatedRequest } from "../auth/middleware";
import { requireAuth } from "../auth/middleware";
import { authService } from "../auth/service";
import { validateRequest } from "../validation";

export function registerProfileRoutes(app: Express) {
  app.get("/profile", requireAuth, (request, response) => {
    response.json({
      user: (request as AuthenticatedRequest).user,
    });
  });

  app.patch(
    "/profile",
    requireAuth,
    validateRequest({
      body: updateProfileRequestSchema,
    }),
    async (request, response, next) => {
      try {
        const user = await authService.updateProfile(
          readSessionToken(request),
          request.body,
        );

        response.json({
          user,
        });
      } catch (error) {
        next(error);
      }
    },
  );
}
