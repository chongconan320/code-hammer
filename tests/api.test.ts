import { afterAll, beforeAll, expect, test } from "bun:test";
import { type Server, createServer } from "node:http";
import { createApiServer } from "../apps/api/src/app";

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  const app = createApiServer();
  server = createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address && typeof address === "object") {
        baseUrl = `http://127.0.0.1:${address.port}`;
      }
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
});

test("health endpoint returns the API status", async () => {
  const response = await fetch(`${baseUrl}/health`);

  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    ok: true,
    service: "code-hammer-api",
  });
});

test("health endpoint rejects undocumented query payload", async () => {
  const response = await fetch(`${baseUrl}/health?unexpected=true`);

  expect(response.status).toBe(400);
  expect(await response.json()).toMatchObject({
    error: "validation_error",
  });
});

test("openapi document includes registered endpoints", async () => {
  const response = await fetch(`${baseUrl}/openapi.json`);
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.paths["/health"].get.operationId).toBe("getHealth");
  expect(body.paths["/openapi.json"].get.operationId).toBe(
    "getOpenApiDocument",
  );
  expect(body.paths["/auth/signup"].post.operationId).toBe("signUp");
  expect(body.paths["/auth/signin"].post.operationId).toBe("signIn");
  expect(body.paths["/auth/signout"].post.operationId).toBe("signOut");
  expect(body.paths["/profile"].get.operationId).toBe("getProfile");
  expect(body.paths["/profile"].patch.operationId).toBe("updateProfile");
  expect(body.paths["/organizations"].post.operationId).toBe(
    "createOrganization",
  );
  expect(body.paths["/organizations"].get.operationId).toBe(
    "listOrganizations",
  );
  expect(
    body.paths["/organizations/{organizationId}/members"].post.operationId,
  ).toBe("addOrganizationMember");
  expect(body.paths["/workspaces/{workspaceId}"].get.operationId).toBe(
    "getWorkspace",
  );
  expect(
    body.paths["/workspaces/{workspaceId}/settings"].patch.operationId,
  ).toBe("updateWorkspaceSettings");
  expect(body.paths["/billing/plan"].get.operationId).toBe("getBillingPlan");
  expect(body.paths["/billing/usage"].get.operationId).toBe("getBillingUsage");
});

test("auth flow supports signup, profile update, signout, signin, and password reset", async () => {
  const email = `fr001-${Date.now()}@example.com`;
  const password = "strong-password";

  const signupResponse = await jsonRequest("/auth/signup", {
    name: "Conan Chong",
    email,
    password,
    preferences: {
      timezone: "Asia/Kuala_Lumpur",
      emailUpdates: true,
    },
  });
  const sessionCookie = readSetCookie(signupResponse);

  expect(signupResponse.status).toBe(201);
  expect(sessionCookie).toContain("ch_session=");
  expect(await signupResponse.json()).toMatchObject({
    user: {
      name: "Conan Chong",
      email,
    },
  });

  const profileResponse = await fetch(`${baseUrl}/profile`, {
    headers: {
      cookie: sessionCookie,
    },
  });

  expect(profileResponse.status).toBe(200);
  expect(await profileResponse.json()).toMatchObject({
    user: {
      email,
    },
  });

  const updateResponse = await jsonRequest(
    "/profile",
    {
      name: "Conan",
      preferences: {
        timezone: "Asia/Kuala_Lumpur",
        emailUpdates: false,
      },
    },
    {
      method: "PATCH",
      cookie: sessionCookie,
    },
  );

  expect(updateResponse.status).toBe(200);
  expect(await updateResponse.json()).toMatchObject({
    user: {
      name: "Conan",
      preferences: {
        emailUpdates: false,
      },
    },
  });

  const signoutResponse = await fetch(`${baseUrl}/auth/signout`, {
    method: "POST",
    headers: {
      cookie: sessionCookie,
    },
  });

  expect(signoutResponse.status).toBe(200);
  expect(await signoutResponse.json()).toEqual({ ok: true });

  const signedOutProfileResponse = await fetch(`${baseUrl}/profile`, {
    headers: {
      cookie: sessionCookie,
    },
  });

  expect(signedOutProfileResponse.status).toBe(401);

  const signinResponse = await jsonRequest("/auth/signin", {
    email,
    password,
  });
  const signinCookie = readSetCookie(signinResponse);

  expect(signinResponse.status).toBe(200);
  expect(signinCookie).toContain("ch_session=");

  const resetRequestResponse = await jsonRequest(
    "/auth/password-reset/request",
    {
      email,
    },
  );
  const resetRequestBody = await resetRequestResponse.json();

  expect(resetRequestResponse.status).toBe(200);
  expect(resetRequestBody.resetToken.startsWith("rst_")).toBe(true);

  const newPassword = "new-strong-password";
  const resetConfirmResponse = await jsonRequest(
    "/auth/password-reset/confirm",
    {
      token: resetRequestBody.resetToken,
      password: newPassword,
    },
  );

  expect(resetConfirmResponse.status).toBe(200);
  expect(await resetConfirmResponse.json()).toEqual({ ok: true });

  const oldPasswordSigninResponse = await jsonRequest("/auth/signin", {
    email,
    password,
  });

  expect(oldPasswordSigninResponse.status).toBe(401);

  const newPasswordSigninResponse = await jsonRequest("/auth/signin", {
    email,
    password: newPassword,
  });

  expect(newPasswordSigninResponse.status).toBe(200);
});

test("auth endpoints reject invalid payloads with zod validation errors", async () => {
  const response = await jsonRequest("/auth/signup", {
    name: "",
    email: "not-an-email",
    password: "short",
  });

  expect(response.status).toBe(400);
  expect(await response.json()).toMatchObject({
    error: "validation_error",
  });
});

test("tenant workspace flow creates owners, denies other tenants, and scopes settings", async () => {
  const ownerCookie = await signUpCookie(`owner-${Date.now()}@example.com`);
  const memberEmail = `member-${Date.now()}@example.com`;
  const memberCookie = await signUpCookie(memberEmail);
  const outsiderCookie = await signUpCookie(
    `outsider-${Date.now()}@example.com`,
  );

  const createResponse = await jsonRequest(
    "/organizations",
    {
      name: "Acme Clinic",
      workspaceName: "Front Desk",
      workspaceSettings: {
        displayName: "Reception",
        timezone: "Asia/Kuala_Lumpur",
      },
    },
    {
      cookie: ownerCookie,
    },
  );
  const created = await createResponse.json();

  expect(createResponse.status).toBe(201);
  expect(created.membership.role).toBe("owner");
  expect(created.organization.ownerId).toBe(created.membership.userId);
  expect(created.memberships).toHaveLength(1);
  expect(created.workspace.name).toBe("Front Desk");

  const addMemberResponse = await jsonRequest(
    `/organizations/${created.organization.id}/members`,
    {
      email: memberEmail,
    },
    {
      cookie: ownerCookie,
    },
  );
  const addedMember = await addMemberResponse.json();

  expect(addMemberResponse.status).toBe(201);
  expect(addedMember.membership.role).toBe("member");
  expect(addedMember.membership.organizationId).toBe(created.organization.id);

  const memberReadResponse = await fetch(
    `${baseUrl}/workspaces/${created.workspace.id}`,
    {
      headers: {
        cookie: memberCookie,
      },
    },
  );

  expect(memberReadResponse.status).toBe(200);

  const memberUpdateResponse = await jsonRequest(
    `/workspaces/${created.workspace.id}/settings`,
    {
      settings: {
        displayName: "Member Edit",
      },
    },
    {
      method: "PATCH",
      cookie: memberCookie,
    },
  );

  expect(memberUpdateResponse.status).toBe(403);

  const outsiderReadResponse = await fetch(
    `${baseUrl}/workspaces/${created.workspace.id}`,
    {
      headers: {
        cookie: outsiderCookie,
      },
    },
  );

  expect(outsiderReadResponse.status).toBe(403);

  const updateResponse = await jsonRequest(
    `/workspaces/${created.workspace.id}/settings`,
    {
      settings: {
        displayName: "Reception Desk",
      },
    },
    {
      method: "PATCH",
      cookie: ownerCookie,
    },
  );

  expect(updateResponse.status).toBe(200);
  expect(await updateResponse.json()).toMatchObject({
    workspace: {
      id: created.workspace.id,
      organizationId: created.organization.id,
      settings: {
        displayName: "Reception Desk",
        timezone: "Asia/Kuala_Lumpur",
      },
    },
  });

  const outsiderListResponse = await fetch(`${baseUrl}/organizations`, {
    headers: {
      cookie: outsiderCookie,
    },
  });

  expect(outsiderListResponse.status).toBe(200);
  expect(await outsiderListResponse.json()).toEqual({
    organizations: [],
  });
});

test("billing plan endpoint returns subscription and usage after organization creation", async () => {
  const ownerCookie = await signUpCookie(`billing-${Date.now()}@example.com`);

  const createResponse = await jsonRequest(
    "/organizations",
    {
      name: "Billing Clinic",
      workspaceName: "Billing Workspace",
    },
    {
      cookie: ownerCookie,
    },
  );

  expect(createResponse.status).toBe(201);

  const response = await fetch(`${baseUrl}/billing/plan`, {
    headers: {
      cookie: ownerCookie,
    },
  });
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body).toMatchObject({
    plan: {
      id: "free",
      name: "Free",
    },
    subscription: {
      planId: "free",
      status: "trialing",
    },
    limits: {
      maxDocuments: 10,
      maxAiMessages: 50,
    },
    usage: {
      documents: 0,
      aiMessages: 0,
      storageBytes: 0,
      workflowRuns: 0,
    },
  });
});

test("billing plan endpoint returns controlled 404 without an organization", async () => {
  const cookie = await signUpCookie(`no-billing-${Date.now()}@example.com`);

  const response = await fetch(`${baseUrl}/billing/plan`, {
    headers: {
      cookie,
    },
  });

  expect(response.status).toBe(404);
  expect(await response.json()).toMatchObject({
    error: "no_organization",
  });
});

function readSetCookie(response: Response) {
  const cookie = response.headers.get("set-cookie");
  expect(cookie).toBeTruthy();
  return cookie ?? "";
}

function jsonRequest(
  path: string,
  body: unknown,
  options: {
    method?: "POST" | "PATCH";
    cookie?: string;
  } = {},
) {
  return fetch(`${baseUrl}${path}`, {
    method: options.method ?? "POST",
    headers: {
      "content-type": "application/json",
      ...(options.cookie ? { cookie: options.cookie } : {}),
    },
    body: JSON.stringify(body),
  });
}

async function signUpCookie(email: string) {
  const response = await jsonRequest("/auth/signup", {
    name: "Tenant Tester",
    email,
    password: "strong-password",
  });

  expect(response.status).toBe(201);
  return readSetCookie(response);
}
