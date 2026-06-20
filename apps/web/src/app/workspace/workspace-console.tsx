"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { type Locale, dictionaries, isLocale } from "../../i18n";
import {
  type PublicUser,
  type TenantSnapshot,
  apiRequest,
  getStoredLocale,
  localeStorageKey,
} from "../client-helpers";

/* ── Context shape ── */

type WorkspaceCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (typeof dictionaries)[Locale];

  /* profile */
  user: PublicUser | null;
  refreshProfile: () => Promise<void>;
  saveProfile: (patch: {
    name?: string;
    preferences?: { timezone?: string; emailUpdates?: boolean };
  }) => Promise<string | null>;

  /* tenant */
  tenant: TenantSnapshot | null;
  refreshTenant: () => Promise<void>;
  createOrganization: (payload: {
    organizationName: string;
    workspaceName: string;
    workspaceDisplayName: string;
  }) => Promise<string | null>;
  saveWorkspaceSettings: (settings: { displayName: string }) => Promise<
    string | null
  >;
  addMember: (email: string) => Promise<string | null>;
};

const WorkspaceContext = createContext<WorkspaceCtx | null>(null);

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be inside WorkspaceProvider");
  return ctx;
}

/* ── Provider ── */

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getStoredLocale);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [tenant, setTenant] = useState<TenantSnapshot | null>(null);
  const t = dictionaries[locale];

  /* ── locale ── */
  const changeLocale = useCallback((value: Locale) => {
    setLocale(value);
    localStorage.setItem(localeStorageKey, value);
  }, []);

  /* ── profile ── */
  const refreshProfile = useCallback(async () => {
    const res = await apiRequest("/profile", "GET");
    const data = await res.json();
    if (!res.ok) {
      window.location.assign("/");
      return;
    }
    setUser(data.user);
    /* also load tenant after profile */
    const orgsRes = await apiRequest("/organizations", "GET");
    const orgsData = await orgsRes.json();
    if (orgsRes.ok && orgsData.organizations?.[0]) {
      setTenant(orgsData.organizations[0]);
    }
  }, []);

  const saveProfile = useCallback(
    async (patch: {
      name?: string;
      preferences?: { timezone?: string; emailUpdates?: boolean };
    }): Promise<string | null> => {
      const res = await apiRequest("/profile", "PATCH", patch);
      const data = await res.json();
      if (!res.ok) return data.message ?? data.error ?? t.portal.profileUpdateFailed;
      setUser(data.user);
      return null; // null = success
    },
    [t.portal.profileUpdateFailed],
  );

  /* ── tenant ── */
  const refreshTenant = useCallback(async () => {
    const res = await apiRequest("/organizations", "GET");
    const data = await res.json();
    if (res.ok && data.organizations?.[0]) {
      setTenant(data.organizations[0]);
    }
  }, []);

  const createOrganization = useCallback(
    async (payload: {
      organizationName: string;
      workspaceName: string;
      workspaceDisplayName: string;
    }): Promise<string | null> => {
      const res = await apiRequest("/organizations", "POST", {
        name: payload.organizationName,
        workspaceName: payload.workspaceName,
        workspaceSettings: {
          displayName: payload.workspaceDisplayName,
          timezone: user?.preferences.timezone ?? "Asia/Kuala_Lumpur",
        },
      });
      const data = await res.json();
      if (!res.ok) return data.message ?? data.error ?? t.portal.workspaceCreateFailed;
      setTenant(data);
      return null;
    },
    [user?.preferences.timezone, t.portal.workspaceCreateFailed],
  );

  const saveWorkspaceSettings = useCallback(
    async (settings: { displayName: string }): Promise<string | null> => {
      if (!tenant) return "No workspace";
      const res = await apiRequest(
        `/workspaces/${tenant.workspace.id}/settings`,
        "PATCH",
        { settings },
      );
      const data = await res.json();
      if (!res.ok) return data.message ?? data.error ?? t.portal.workspaceUpdateFailed;
      setTenant({ ...tenant, workspace: data.workspace });
      return null;
    },
    [tenant, t.portal.workspaceUpdateFailed],
  );

  const addMemberFn = useCallback(
    async (email: string): Promise<string | null> => {
      if (!tenant) return "No workspace";
      const res = await apiRequest(
        `/organizations/${tenant.organization.id}/members`,
        "POST",
        { email },
      );
      const data = await res.json();
      if (!res.ok) return data.message ?? data.error ?? t.portal.memberAddFailed;
      setTenant({
        ...tenant,
        memberships: [...tenant.memberships, data.membership],
      });
      return null;
    },
    [tenant, t.portal.memberAddFailed],
  );

  /* auto-load on mount */
  useEffect(() => {
    void refreshProfile();
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        locale,
        setLocale: changeLocale,
        t,
        user,
        refreshProfile,
        saveProfile,
        tenant,
        refreshTenant,
        createOrganization,
        saveWorkspaceSettings,
        addMember: addMemberFn,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
