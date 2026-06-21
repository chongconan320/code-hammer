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

const forbiddenResponse = {
  description: "The authenticated user cannot access this tenant resource.",
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
    {
      name: "Tenant",
      description: "Organization, membership, and workspace endpoints",
    },
    {
      name: "Billing",
      description: "Plans, subscriptions, usage, and limits",
    },
  ],
  components: {
    schemas: {
      Organization: {
        type: "object",
        required: ["id", "name", "ownerId"],
        properties: {
          id: {
            type: "string",
            example: "org_abc123",
          },
          name: {
            type: "string",
            example: "Acme Clinic",
          },
          ownerId: {
            type: "string",
            example: "usr_abc123",
          },
        },
      },
      Workspace: {
        type: "object",
        required: ["id", "organizationId", "name", "settings"],
        properties: {
          id: {
            type: "string",
            example: "wsp_abc123",
          },
          organizationId: {
            type: "string",
            example: "org_abc123",
          },
          name: {
            type: "string",
            example: "Front Desk",
          },
          settings: {
            type: "object",
            additionalProperties: false,
            properties: {
              displayName: {
                type: "string",
                example: "Front Desk",
              },
              timezone: {
                type: "string",
                example: "Asia/Kuala_Lumpur",
              },
            },
          },
        },
      },
      Membership: {
        type: "object",
        required: ["organizationId", "userId", "role"],
        properties: {
          organizationId: {
            type: "string",
            example: "org_abc123",
          },
          userId: {
            type: "string",
            example: "usr_abc123",
          },
          role: {
            type: "string",
            enum: ["owner", "member"],
          },
        },
      },
      TenantSnapshot: {
        type: "object",
        required: ["organization", "workspace", "membership", "memberships"],
        properties: {
          organization: {
            $ref: "#/components/schemas/Organization",
          },
          workspace: {
            $ref: "#/components/schemas/Workspace",
          },
          membership: {
            $ref: "#/components/schemas/Membership",
          },
          memberships: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Membership",
            },
          },
        },
      },
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
    "/organizations": {
      get: {
        tags: ["Tenant"],
        summary: "List organizations for the authenticated user",
        operationId: "listOrganizations",
        responses: {
          "200": {
            description: "Organizations visible to the authenticated user.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["organizations"],
                  properties: {
                    organizations: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/TenantSnapshot",
                      },
                    },
                  },
                },
              },
            },
          },
          "401": unauthorizedResponse,
        },
      },
      post: {
        tags: ["Tenant"],
        summary: "Create an organization and owner workspace",
        operationId: "createOrganization",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: {
                    type: "string",
                    example: "Acme Clinic",
                  },
                  workspaceName: {
                    type: "string",
                    example: "Front Desk",
                  },
                  workspaceSettings: {
                    $ref: "#/components/schemas/Workspace/properties/settings",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Organization created and caller assigned owner role.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TenantSnapshot",
                },
              },
            },
          },
          "400": validationErrorResponse,
          "401": unauthorizedResponse,
        },
      },
    },
    "/organizations/{organizationId}/members": {
      post: {
        tags: ["Tenant"],
        summary: "Add an existing user as an organization member",
        operationId: "addOrganizationMember",
        parameters: [
          {
            name: "organizationId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
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
                    example: "member@example.com",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Member role assigned.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["membership"],
                  properties: {
                    membership: {
                      $ref: "#/components/schemas/Membership",
                    },
                  },
                },
              },
            },
          },
          "400": validationErrorResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": {
            description: "The target user was not found.",
            content: jsonContent,
          },
        },
      },
    },
    "/workspaces/{workspaceId}": {
      get: {
        tags: ["Tenant"],
        summary: "Get a workspace inside the current tenant boundary",
        operationId: "getWorkspace",
        parameters: [
          {
            name: "workspaceId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Workspace visible to the authenticated user.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["workspace"],
                  properties: {
                    workspace: {
                      $ref: "#/components/schemas/Workspace",
                    },
                  },
                },
              },
            },
          },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
        },
      },
    },
    "/workspaces/{workspaceId}/settings": {
      patch: {
        tags: ["Tenant"],
        summary: "Update workspace settings inside the current tenant boundary",
        operationId: "updateWorkspaceSettings",
        parameters: [
          {
            name: "workspaceId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["settings"],
                properties: {
                  settings: {
                    $ref: "#/components/schemas/Workspace/properties/settings",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Workspace settings updated.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["workspace"],
                  properties: {
                    workspace: {
                      $ref: "#/components/schemas/Workspace",
                    },
                  },
                },
              },
            },
          },
          "400": validationErrorResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
        },
      },
    },
    "/billing/plan": {
      get: {
        tags: ["Billing"],
        summary: "Get the current organization billing plan",
        operationId: "getBillingPlan",
        responses: {
          "200": {
            description: "Plan, subscription, limits, and usage.",
            content: jsonContent,
          },
          "401": unauthorizedResponse,
          "404": {
            description: "No organization or subscription exists.",
            content: jsonContent,
          },
        },
      },
    },
    "/billing/usage": {
      get: {
        tags: ["Billing"],
        summary: "Get the current organization usage summary",
        operationId: "getBillingUsage",
        responses: {
          "200": {
            description: "Usage summary and limits.",
            content: jsonContent,
          },
          "401": unauthorizedResponse,
          "404": {
            description: "No organization exists.",
            content: jsonContent,
          },
        },
      },
    },
  },
} as const;
