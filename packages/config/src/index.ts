import { z } from "zod";

export const environmentSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  MILVUS_URL: z.string().min(1),
  WEB_URL: z.string().url().default("http://127.0.0.1:3000"),
  API_URL: z.string().url().default("http://127.0.0.1:3001"),
});

export type Environment = z.infer<typeof environmentSchema>;

export const requiredEnvironment = [
  "DATABASE_URL",
  "REDIS_URL",
  "MILVUS_URL",
] as const;
