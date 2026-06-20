import { z } from "zod";

export const queueNames = [
  "document-processing",
  "ai-workflow",
  "integration-sync",
  "notification",
  "report-generation",
] as const;

export const jobPayloadSchema = z.object({
  tenantId: z.string().min(1),
  requestedBy: z.string().min(1),
  payload: z.record(z.unknown()).default({}),
});

export type JobPayload = z.infer<typeof jobPayloadSchema>;
