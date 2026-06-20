import type { Express } from "express";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi";
import { registerHealthRoutes } from "./routes/health";
import { registerOpenApiRoutes } from "./routes/openapi";

export function createApiServer(): Express {
  const app = express();

  app.use(express.json());

  registerOpenApiRoutes(app);

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  registerHealthRoutes(app);

  return app;
}
