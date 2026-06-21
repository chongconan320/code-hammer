import cors from "cors";
import cookieParser from "cookie-parser";
import type { Express } from "express";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi";
import { registerAuthRoutes } from "./routes/auth";
import { registerBillingRoutes } from "./routes/billing";
import { registerHealthRoutes } from "./routes/health";
import { registerOpenApiRoutes } from "./routes/openapi";
import { registerProfileRoutes } from "./routes/profile";
import { registerTenantRoutes } from "./routes/tenants";

const ALLOWED_ORIGINS = [
  process.env.WEB_URL ?? "http://localhost:3000",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export function createApiServer(): Express {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        /* allow requests with no origin (server-to-server, curl, etc.) */
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.use(cookieParser());
  app.use(express.json());

  registerOpenApiRoutes(app);

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  registerAuthRoutes(app);
  registerBillingRoutes(app);
  registerHealthRoutes(app);
  registerProfileRoutes(app);
  registerTenantRoutes(app);

  return app;
}
