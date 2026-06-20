import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

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

test("database schema is split by feature file", () => {
  expect(existsSync("packages/db/src/auth.ts")).toBe(true);
  expect(existsSync("packages/db/src/tenant.ts")).toBe(true);

  const dbIndex = readFileSync("packages/db/src/index.ts", "utf8");
  const tableMarker = "pg" + "Table(";
  const drizzlePgCore = "drizzle-orm" + "/pg-core";

  expect(dbIndex).not.toContain(tableMarker);
  expect(dbIndex).toContain('export * from "./auth"');
  expect(dbIndex).toContain('export * from "./tenant"');

  for (const file of sourceFiles(".")) {
    if (file.startsWith("packages/db/")) {
      continue;
    }

    const source = readFileSync(file, "utf8");
    expect(source).not.toContain(tableMarker);
    expect(source).not.toContain(drizzlePgCore);
  }
});

function sourceFiles(path: string): string[] {
  const ignored = new Set([".git", ".next", ".turbo", "dist", "node_modules"]);
  const files: string[] = [];

  for (const name of readdirSync(path)) {
    if (ignored.has(name)) {
      continue;
    }

    const child = join(path, name);
    const stats = statSync(child);

    if (stats.isDirectory()) {
      files.push(...sourceFiles(child));
      continue;
    }

    if (child.endsWith(".ts") || child.endsWith(".tsx")) {
      files.push(child.replace(/^\.\//, ""));
    }
  }

  return files;
}
