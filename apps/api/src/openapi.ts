const jsonContent = {
  "application/json": {},
};

const validationErrorResponse = {
  description: "The request did not pass validation.",
  content: jsonContent,
};

const unauthorizedResponse = {
  description: "Authentication is required or credentials are invalid.",
  content: jsonContent,
};

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
    {
      name: "Auth",
      description: "Authentication, sessions, and password reset",
    },
    {
      name: "Profile",
      description: "Authenticated user profile endpoints",
    },
  ],
  components: {
    schemas: {
      UserPreferences: {
        type: "object",
        required: ["timezone", "emailUpdates"],
        properties: {
          timezone: {
            type: "string",
            example: "Asia/Kuala_Lumpur",
          },
          emailUpdates: {
            type: "boolean",
            example: true,
          },
        },
      },
      PublicUser: {
        type: "object",
        required: ["id", "name", "email", "preferences"],
        properties: {
          id: {
            type: "string",
            example: "usr_abc123",
          },
          name: {
            type: "string",
            example: "Conan Chong",
          },
          email: {
            type: "string",
            format: "email",
            example: "conan@example.com",
          },
          preferences: {
            $ref: "#/components/schemas/UserPreferences",
          },
        },
      },
      AuthResponse: {
        type: "object",
        required: ["user"],
        properties: {
          user: {
            $ref: "#/components/schemas/PublicUser",
          },
        },
      },
      OkResponse: {
        type: "object",
        required: ["ok"],
        properties: {
          ok: {
            type: "boolean",
            example: true,
          },
        },
      },
    },
  },
  paths: {
    "/openapi.json": {
      get: {
        tags: ["System"],
        summary: "Get the OpenAPI document",
        operationId: "getOpenApiDocument",
        responses: {
          "200": {
            description: "The OpenAPI document for the Code Hammer API.",
            content: jsonContent,
          },
          "400": validationErrorResponse,
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
          "400": validationErrorResponse,
        },
      },
    },
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Create a user account",
        operationId: "signUp",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: {
                    type: "string",
                    example: "Conan Chong",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "conan@example.com",
                  },
                  password: {
                    type: "string",
                    minLength: 8,
                    example: "strong-password",
                  },
                  preferences: {
                    $ref: "#/components/schemas/UserPreferences",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Account created and session cookie set.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          "400": validationErrorResponse,
          "409": {
            description: "Email is already registered.",
            content: jsonContent,
          },
        },
      },
    },
    "/auth/signin": {
      post: {
        tags: ["Auth"],
        summary: "Create an authenticated session",
        operationId: "signIn",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "conan@example.com",
                  },
                  password: {
                    type: "string",
                    example: "strong-password",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Session cookie set.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          "400": validationErrorResponse,
          "401": unauthorizedResponse,
        },
      },
    },
    "/auth/signout": {
      post: {
        tags: ["Auth"],
        summary: "Invalidate the current session",
        operationId: "signOut",
        responses: {
          "200": {
            description: "Session cookie cleared.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/OkResponse",
                },
              },
            },
          },
        },
      },
    },
    "/auth/password-reset/request": {
      post: {
        tags: ["Auth"],
        summary: "Request a password reset",
        operationId: "requestPasswordReset",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "conan@example.com",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description:
              "Generic reset response. Development mode includes a reset token.",
            content: jsonContent,
          },
          "400": validationErrorResponse,
        },
      },
    },
    "/auth/password-reset/confirm": {
      post: {
        tags: ["Auth"],
        summary: "Confirm a password reset",
        operationId: "confirmPasswordReset",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token", "password"],
                properties: {
                  token: {
                    type: "string",
                  },
                  password: {
                    type: "string",
                    minLength: 8,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Password updated.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/OkResponse",
                },
              },
            },
          },
          "400": validationErrorResponse,
        },
      },
    },
    "/profile": {
      get: {
        tags: ["Profile"],
        summary: "Get the authenticated user profile",
        operationId: "getProfile",
        responses: {
          "200": {
            description: "Authenticated user profile.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          "401": unauthorizedResponse,
        },
      },
      patch: {
        tags: ["Profile"],
        summary: "Update the authenticated user profile",
        operationId: "updateProfile",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: "Conan",
                  },
                  preferences: {
                    $ref: "#/components/schemas/UserPreferences",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated user profile.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },
          "400": validationErrorResponse,
          "401": unauthorizedResponse,
        },
      },
    },
  },
} as const;
