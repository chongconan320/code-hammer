import { z } from "zod";

export type TenantId = string;
export type UserId = string;

export const userPreferencesSchema = z
  .object({
    timezone: z.string().min(1).default("Asia/Kuala_Lumpur"),
    emailUpdates: z.boolean().default(true),
  })
  .default({
    timezone: "Asia/Kuala_Lumpur",
    emailUpdates: true,
  });

export const publicUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  preferences: userPreferencesSchema,
});

export const signUpRequestSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  preferences: userPreferencesSchema.optional(),
});

export const signInRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

export const updateProfileRequestSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    preferences: userPreferencesSchema.optional(),
  })
  .strict();

export const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

export const passwordResetConfirmRequestSchema = z.object({
  token: z.string().min(24),
  password: z.string().min(8).max(128),
});

export const authResponseSchema = z.object({
  user: publicUserSchema,
});

export const passwordResetRequestResponseSchema = z.object({
  ok: z.literal(true),
  resetToken: z.string().optional(),
});

export const okResponseSchema = z.object({
  ok: z.literal(true),
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;
export type SignUpRequest = z.infer<typeof signUpRequestSchema>;
export type SignInRequest = z.infer<typeof signInRequestSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;
export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmRequest = z.infer<
  typeof passwordResetConfirmRequestSchema
>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
