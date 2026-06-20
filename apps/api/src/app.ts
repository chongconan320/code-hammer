import type { Express } from "express";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi";
import { registerAuthRoutes } from "./routes/auth";
import { registerHealthRoutes } from "./routes/health";
import { registerOpenApiRoutes } from "./routes/openapi";
import { registerProfileRoutes } from "./routes/profile";

export function createApiServer(): Express {
  const app = express();

  app.use((request, response, next) => {
    const allowedOrigin = process.env.WEB_URL ?? "http://127.0.0.1:3000";

    if (request.headers.origin === allowedOrigin) {
      response.header("Access-Control-Allow-Origin", allowedOrigin);
      response.header("Access-Control-Allow-Credentials", "true");
      response.header("Vary", "Origin");
    }

    response.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    response.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, OPTIONS",
    );

    if (request.method === "OPTIONS") {
      response.sendStatus(204);
      return;
    }

    next();
  });

  app.use(express.json());

  registerOpenApiRoutes(app);

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  registerAuthRoutes(app);
  registerHealthRoutes(app);
  registerProfileRoutes(app);

  return app;
}
