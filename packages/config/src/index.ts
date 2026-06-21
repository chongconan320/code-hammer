import { z } from "zod";

export const environmentSchema = z.object({
  POSTGRES_HOST: z.string().min(1).transform(postgresHost),
  POSTGRES_PORT: z.coerce.number().int().positive().default(5432),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DATABASE: z.string().min(1),
  POSTGRES_SSL: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  REDIS_URL: z.string().url(),
  MILVUS_URL: z.string().min(1),
  WEB_URL: z.string().url().default("http://127.0.0.1:3000"),
  API_URL: z.string().url().default("http://127.0.0.1:3001"),
});

export type Environment = z.infer<typeof environmentSchema>;

export const requiredEnvironment = [
  "POSTGRES_HOST",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_DATABASE",
  "REDIS_URL",
  "MILVUS_URL",
] as const;

export function postgresUrl(
  environment: Pick<
    Environment,
    | "POSTGRES_HOST"
    | "POSTGRES_PORT"
    | "POSTGRES_USER"
    | "POSTGRES_PASSWORD"
    | "POSTGRES_DATABASE"
    | "POSTGRES_SSL"
  >,
): string {
  const url = new URL(`postgres://${environment.POSTGRES_HOST}`);
  url.port = String(environment.POSTGRES_PORT);
  url.username = environment.POSTGRES_USER;
  url.password = environment.POSTGRES_PASSWORD;
  url.pathname = environment.POSTGRES_DATABASE;
  url.searchParams.set(
    "sslmode",
    environment.POSTGRES_SSL ? "require" : "disable",
  );
  return url.toString();
}

function postgresHost(host: string) {
  if (!host.includes("://")) {
    return host;
  }

  return new URL(host).hostname;
}
