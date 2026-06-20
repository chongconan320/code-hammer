import { expect, test } from "bun:test";
import { existsSync } from "node:fs";

test("repository foundation exists", () => {
  expect(existsSync("package.json")).toBe(true);
  expect(existsSync("turbo.json")).toBe(true);
  expect(existsSync("apps/web/package.json")).toBe(true);
  expect(existsSync("apps/web/src/app/page.tsx")).toBe(true);
  expect(existsSync("apps/api/package.json")).toBe(true);
  expect(existsSync("apps/api/src/main.ts")).toBe(true);
  expect(existsSync("packages/shared/package.json")).toBe(true);
  expect(existsSync("packages/config/src/index.ts")).toBe(true);
  expect(existsSync("packages/db/src/index.ts")).toBe(true);
  expect(existsSync("packages/ai/src/index.ts")).toBe(true);
  expect(existsSync("packages/queue/src/index.ts")).toBe(true);
});
