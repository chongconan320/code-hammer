import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "../src";

const env = loadEnv();
const client = postgres({
  host: postgresHost(env.POSTGRES_HOST),
  port: Number(env.POSTGRES_PORT ?? 5432),
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DATABASE,
  ssl: env.POSTGRES_SSL === "true" ? "require" : false,
});
const db = drizzle(client);

const adminEmail = (env.ADMIN_EMAIL ?? "admin@codehammer.local")
  .trim()
  .toLowerCase();
const adminPassword = env.ADMIN_PASSWORD ?? "strong-password";
const adminName = env.ADMIN_NAME ?? "Code Hammer Admin";
const passwordSalt = randomBytes(16).toString("hex");
const passwordHash = scryptSync(adminPassword, passwordSalt, 64).toString(
  "hex",
);

await db
  .insert(users)
  .values({
    email: adminEmail,
    name: adminName,
    passwordHash,
    passwordSalt,
  })
  .onConflictDoUpdate({
    target: users.email,
    set: {
      name: adminName,
      passwordHash,
      passwordSalt,
    },
  });

await db.$client.end();

console.log(`Admin user created: ${adminEmail}`);

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
