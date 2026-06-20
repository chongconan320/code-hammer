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
});
