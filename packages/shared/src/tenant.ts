import { z } from "zod";

export const membershipRoleContract = z.enum(["owner", "member"]);

export const workspaceSettingsContract = z
  .object({
    displayName: z.string().min(1).max(120).optional(),
    timezone: z.string().min(1).max(80).optional(),
  })
  .strict()
  .default({});

export const organizationContract = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  ownerId: z.string().min(1),
});

export const workspaceContract = z.object({
  id: z.string().min(1),
  organizationId: z.string().min(1),
  name: z.string().min(1),
  settings: workspaceSettingsContract,
});

export const membershipContract = z.object({
  organizationId: z.string().min(1),
  userId: z.string().min(1),
  role: membershipRoleContract,
});

export const createOrganizationRequestSchema = z
  .object({
    name: z.string().min(1).max(120),
    workspaceName: z.string().min(1).max(120).optional(),
    workspaceSettings: workspaceSettingsContract.optional(),
  })
  .strict();

export const addOrganizationMemberRequestSchema = z
  .object({
    email: z.string().email(),
  })
  .strict();

export const updateWorkspaceSettingsRequestSchema = z
  .object({
    settings: workspaceSettingsContract,
  })
  .strict();

export type MembershipRole = z.infer<typeof membershipRoleContract>;
export type WorkspaceSettings = z.infer<typeof workspaceSettingsContract>;
export type Organization = z.infer<typeof organizationContract>;
export type Workspace = z.infer<typeof workspaceContract>;
export type Membership = z.infer<typeof membershipContract>;
export type CreateOrganizationRequest = z.infer<
  typeof createOrganizationRequestSchema
>;
export type AddOrganizationMemberRequest = z.infer<
  typeof addOrganizationMemberRequestSchema
>;
export type UpdateWorkspaceSettingsRequest = z.infer<
  typeof updateWorkspaceSettingsRequestSchema
>;
