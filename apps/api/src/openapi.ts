export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Code Hammer API",
    version: "0.0.0",
    description: "HTTP API for the Code Hammer AI back office platform.",
  },
  servers: [
    {
      url: "http://127.0.0.1:3001",
      description: "Local development",
    },
  ],
  tags: [
    {
      name: "System",
      description: "System and operational endpoints",
    },
  ],
  paths: {
    "/openapi.json": {
      get: {
        tags: ["System"],
        summary: "Get the OpenAPI document",
        operationId: "getOpenApiDocument",
        responses: {
          "200": {
            description: "The OpenAPI document for the Code Hammer API.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                },
              },
            },
          },
          "400": {
            description: "The request did not pass validation.",
          },
        },
      },
    },
    "/health": {
      get: {
        tags: ["System"],
        summary: "Check API health",
        operationId: "getHealth",
        responses: {
          "200": {
            description: "The API is running.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["ok", "service"],
                  properties: {
                    ok: {
                      type: "boolean",
                      example: true,
                    },
                    service: {
                      type: "string",
                      example: "code-hammer-api",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "The request did not pass validation.",
          },
        },
      },
    },
  },
} as const;
