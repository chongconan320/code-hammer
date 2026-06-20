import { z } from "zod";

export const assistantResponseSchema = z.object({
  answer: z.string(),
  confidence: z.enum(["low", "medium", "high"]),
  requiresHumanReview: z.boolean(),
});

export type AssistantResponse = z.infer<typeof assistantResponseSchema>;

export const aiPackage = {
  orchestration: "Mastra",
  structuredOutputsRequired: true,
} as const;
