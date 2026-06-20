import { existsSync, readFileSync, readdirSync } from "node:fs";

const mode = process.argv[2] ?? "check";

const requiredPaths = [
  "package.json",
  "turbo.json",
  "biome.json",
  "tsconfig.base.json",
  "apps/web/package.json",
  "apps/web/src/app/page.tsx",
  "apps/api/package.json",
  "apps/api/src/main.ts",
  "packages/shared/package.json",
  "packages/config/package.json",
  "packages/db/package.json",
  "packages/ai/package.json",
  "packages/queue/package.json",
  "packages/integrations/package.json",
  "verticals/clinic/.gitkeep",
  "verticals/sales-ops/.gitkeep",
  "verticals/ecommerce/.gitkeep",
  "verticals/personal-productivity/.gitkeep",
];

const missing = requiredPaths.filter((path) => !existsSync(path));

if (missing.length > 0) {
  console.error(`Workspace ${mode} failed. Missing paths:`);
  for (const path of missing) {
    console.error(`- ${path}`);
  }
  process.exit(1);
}

const rootPackage = JSON.parse(readFileSync("package.json", "utf8")) as {
  workspaces?: string[];
};
const workspaces = rootPackage.workspaces ?? [];
const apps = readdirSync("apps");
const packages = readdirSync("packages");

if (!workspaces.includes("apps/*") || !workspaces.includes("packages/*")) {
  console.error("Workspace globs must include apps/* and packages/*.");
  process.exit(1);
}

if (!apps.includes("web") || !apps.includes("api")) {
  console.error("apps/web and apps/api must exist.");
  process.exit(1);
}

for (const name of ["shared", "config", "db", "ai", "queue", "integrations"]) {
  if (!packages.includes(name)) {
    console.error(`packages/${name} must exist.`);
    process.exit(1);
  }
}

console.log(`Workspace ${mode} check passed.`);
