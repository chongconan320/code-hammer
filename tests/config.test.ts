import { expect, test } from "bun:test";
import { environmentSchema, postgresUrl } from "../packages/config/src";

test("postgres config is split into separate fields", () => {
  const environment = environmentSchema.parse({
    POSTGRES_HOST: "localhost",
    POSTGRES_USER: "code_hammer",
    POSTGRES_PASSWORD: "secret",
    POSTGRES_DATABASE: "code_hammer",
    REDIS_URL: "redis://localhost:6379",
    MILVUS_URL: "http://localhost:19530",
  });

  expect(environment.POSTGRES_PORT).toBe(5432);
  expect(environment.POSTGRES_SSL).toBe(false);
  expect(postgresUrl(environment)).toBe(
    "postgres://code_hammer:secret@localhost:5432/code_hammer?sslmode=disable",
  );
});
