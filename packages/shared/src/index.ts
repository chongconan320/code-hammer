export type TenantId = string;
export type UserId = string;

export type HealthStatus = {
  ok: boolean;
  service: string;
};

export const workspaceImportProbe = "shared-package-ready";
