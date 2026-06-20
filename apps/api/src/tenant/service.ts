import { randomBytes } from "node:crypto";
import type {
  CreateOrganizationRequest,
  Membership,
  Organization,
  UpdateWorkspaceSettingsRequest,
  Workspace,
} from "@code-hammer/shared";

type TenantSnapshot = {
  organization: Organization;
  workspace: Workspace;
  membership: Membership;
  memberships: Membership[];
};

export class TenantService {
  private readonly organizationsById = new Map<string, Organization>();
  private readonly workspacesById = new Map<string, Workspace>();
  private readonly membershipsByOrganizationId = new Map<
    string,
    Membership[]
  >();

  async createOrganization(
    userId: string,
    input: CreateOrganizationRequest,
  ): Promise<TenantSnapshot> {
    const organization: Organization = {
      id: randomId("org"),
      name: input.name,
      ownerId: userId,
    };
    const workspace: Workspace = {
      id: randomId("wsp"),
      organizationId: organization.id,
      name: input.workspaceName ?? `${input.name} Workspace`,
      settings: input.workspaceSettings ?? {},
    };
    const membership: Membership = {
      organizationId: organization.id,
      userId,
      role: "owner",
    };

    this.organizationsById.set(organization.id, organization);
    this.workspacesById.set(workspace.id, workspace);
    this.membershipsByOrganizationId.set(organization.id, [membership]);

    return { organization, workspace, membership, memberships: [membership] };
  }

  async listForUser(userId: string): Promise<TenantSnapshot[]> {
    const snapshots: TenantSnapshot[] = [];

    for (const membershipList of this.membershipsByOrganizationId.values()) {
      const membership = membershipList.find((item) => item.userId === userId);
      if (!membership) {
        continue;
      }

      const organization = this.organizationsById.get(
        membership.organizationId,
      );
      const workspace = [...this.workspacesById.values()].find(
        (item) => item.organizationId === membership.organizationId,
      );

      if (organization && workspace) {
        snapshots.push({
          organization,
          workspace,
          membership,
          memberships: membershipList,
        });
      }
    }

    return snapshots;
  }

  async addMember(
    ownerId: string,
    organizationId: string,
    userId: string,
  ): Promise<Membership> {
    if (!this.hasRole(ownerId, organizationId, "owner")) {
      throw new TenantError("tenant_access_denied", "Access is denied.", 403);
    }

    const memberships =
      this.membershipsByOrganizationId.get(organizationId) ?? [];
    const existing = memberships.find(
      (membership) => membership.userId === userId,
    );
    if (existing) {
      return existing;
    }

    const membership: Membership = {
      organizationId,
      userId,
      role: "member",
    };

    this.membershipsByOrganizationId.set(organizationId, [
      ...memberships,
      membership,
    ]);
    return membership;
  }

  async getWorkspace(userId: string, workspaceId: string): Promise<Workspace> {
    const workspace = this.workspacesById.get(workspaceId);
    if (!workspace || !this.isMember(userId, workspace.organizationId)) {
      throw new TenantError("tenant_access_denied", "Access is denied.", 403);
    }

    return workspace;
  }

  async updateWorkspaceSettings(
    userId: string,
    workspaceId: string,
    input: UpdateWorkspaceSettingsRequest,
  ): Promise<Workspace> {
    const workspace = await this.getWorkspace(userId, workspaceId);
    if (!this.hasRole(userId, workspace.organizationId, "owner")) {
      throw new TenantError("tenant_access_denied", "Access is denied.", 403);
    }

    const updated = {
      ...workspace,
      settings: {
        ...workspace.settings,
        ...input.settings,
      },
    };

    this.workspacesById.set(workspaceId, updated);
    return updated;
  }

  private isMember(userId: string, organizationId: string) {
    return this.membershipsByOrganizationId
      .get(organizationId)
      ?.some((membership) => membership.userId === userId);
  }

  private hasRole(
    userId: string,
    organizationId: string,
    role: Membership["role"],
  ) {
    return this.membershipsByOrganizationId
      .get(organizationId)
      ?.some(
        (membership) =>
          membership.userId === userId && membership.role === role,
      );
  }
}

export class TenantError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
  }
}

export const tenantService = new TenantService();

function randomId(prefix: string) {
  return `${prefix}_${randomBytes(18).toString("base64url")}`;
}
