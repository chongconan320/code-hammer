import type { Express } from "express";
import { z } from "zod";
import { openApiDocument } from "../openapi";
import { validateRequest } from "../validation";

const openApiQuerySchema = z.object({}).strict();

export function registerOpenApiRoutes(app: Express) {
  app.get(
    "/openapi.json",
    validateRequest({
      query: openApiQuerySchema,
    }),
    (_request, response) => {
      response.json(openApiDocument);
    },
  );
}
