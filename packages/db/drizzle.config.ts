import { existsSync, readFileSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

const env = loadEnv();

export default defineConfig({
  schema: "./src/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: postgresHost(env.POSTGRES_HOST),
    port: Number(env.POSTGRES_PORT ?? 5432),
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DATABASE,
    ssl: env.POSTGRES_SSL === "true" ? "require" : false,
  },
});

function loadEnv() {
  const values: Record<string, string> = {};

  if (existsSync("../../.env")) {
    for (const line of readFileSync("../../.env", "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (!match || match[1].startsWith("#")) {
        continue;
      }
      values[match[1]] = match[2]?.replace(/^['"]|['"]$/g, "") ?? "";
    }
  }

  return { ...values, ...process.env };
}

function postgresHost(host: string) {
  if (!host.includes("://")) {
    return host;
  }

  return new URL(host).hostname;
}
