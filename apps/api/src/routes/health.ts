import type { HealthStatus } from "@code-hammer/shared";
import type { Express } from "express";
import { z } from "zod";
import { validateRequest } from "../validation";

const healthQuerySchema = z.object({}).strict();

export function registerHealthRoutes(app: Express) {
  app.get(
    "/health",
    validateRequest({
      query: healthQuerySchema,
    }),
    (_request, response) => {
      const health: HealthStatus = {
        ok: true,
        service: "code-hammer-api",
      };

      response.json(health);
    },
  );
}
