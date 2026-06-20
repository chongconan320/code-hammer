"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  type Locale,
  dictionaries,
  isLocale,
  localeLabels,
  locales,
} from "../../i18n";
import {
  type PublicUser,
  type TenantSnapshot,
  apiRequest,
  getStoredLocale,
  localeStorageKey,
} from "../client-helpers";

type WorkspaceView = "workspace" | "members" | "profile";

type WorkspaceConsoleProps = {
  view: WorkspaceView;
};

export function WorkspaceConsole({ view }: WorkspaceConsoleProps) {
  const [locale, setLocale] = useState<Locale>(getStoredLocale);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kuala_Lumpur");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [organizationName, setOrganizationName] = useState("Meridian Clinic");
  const [workspaceName, setWorkspaceName] = useState("Front Desk");
  const [workspaceDisplayName, setWorkspaceDisplayName] = useState("Reception");
  const [memberEmail, setMemberEmail] = useState("");
  const [tenant, setTenant] = useState<TenantSnapshot | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>("refresh");
  const [message, setMessage] = useState("");
  const t = dictionaries[locale];

  useEffect(() => {
    void loadProfile();
  }, []);

  async function loadProfile() {
    setBusyAction("refresh");
    const response = await apiRequest("/profile", "GET");
    const data = await response.json();

    if (!response.ok) {
      window.location.assign("/");
      return;
    }

    applyUser(data.user);
    await loadOrganizations();
    setMessage(t.portal.profileRefreshed);
    setBusyAction(null);
  }

  async function saveProfile() {
    setBusyAction("profile");
    const response = await apiRequest("/profile", "PATCH", {
      name,
      preferences: {
        timezone,
        emailUpdates,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message ?? data.error ?? t.portal.profileUpdateFailed);
      setBusyAction(null);
      return;
    }

    applyUser(data.user);
    setMessage(t.portal.profileSaved);
    setBusyAction(null);
  }

  async function signOut() {
    setBusyAction("signout");
    const response = await apiRequest("/auth/signout", "POST");
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message ?? data.error ?? t.portal.signOutFailed);
      setBusyAction(null);
      return;
    }

    window.location.assign("/");
  }

  async function createOrganization() {
    setBusyAction("workspace");
    const response = await apiRequest("/organizations", "POST", {
      name: organizationName,
      workspaceName,
      workspaceSettings: {
        displayName: workspaceDisplayName,
        timezone,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message ?? data.error ?? t.portal.workspaceCreateFailed);
      setBusyAction(null);
      return;
    }

    applyTenant(data);
    setMessage(t.portal.workspaceCreated);
    setBusyAction(null);
  }

  async function saveWorkspaceSettings() {
    if (!tenant) {
      return;
    }

    setBusyAction("workspace");
    const response = await apiRequest(
      `/workspaces/${tenant.workspace.id}/settings`,
      "PATCH",
      {
        settings: {
          displayName: workspaceDisplayName,
          timezone,
        },
      },
    );
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message ?? data.error ?? t.portal.workspaceUpdateFailed);
      setBusyAction(null);
      return;
    }

    applyTenant({
      ...tenant,
      workspace: data.workspace,
    });
    setMessage(t.portal.workspaceSaved);
    setBusyAction(null);
  }

  async function addMember() {
    if (!tenant) {
      return;
    }

    setBusyAction("member");
    const response = await apiRequest(
      `/organizations/${tenant.organization.id}/members`,
      "POST",
      {
        email: memberEmail,
      },
    );
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message ?? data.error ?? t.portal.memberAddFailed);
      setBusyAction(null);
      return;
    }

    applyTenant({
      ...tenant,
      memberships: [...tenant.memberships, data.membership],
    });
    setMemberEmail("");
    setMessage(t.portal.memberAdded);
    setBusyAction(null);
  }

  function changeLocale(value: string) {
    if (!isLocale(value)) {
      return;
    }

    setLocale(value);
    localStorage.setItem(localeStorageKey, value);
  }

  function applyUser(nextUser: PublicUser) {
    setName(nextUser.name);
    setEmail(nextUser.email);
    setTimezone(nextUser.preferences.timezone);
    setEmailUpdates(nextUser.preferences.emailUpdates);
  }

  function applyTenant(nextTenant: TenantSnapshot) {
    setTenant(nextTenant);
    setOrganizationName(nextTenant.organization.name);
    setWorkspaceName(nextTenant.workspace.name);
    setWorkspaceDisplayName(
      nextTenant.workspace.settings.displayName ?? nextTenant.workspace.name,
    );
  }

  async function loadOrganizations() {
    const response = await apiRequest("/organizations", "GET");
    const data = await response.json();

    if (response.ok && data.organizations[0]) {
      applyTenant(data.organizations[0]);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-background p-4 text-foreground md:p-8">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl grid-cols-1 overflow-hidden rounded-lg border border-border bg-card shadow-panel lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-border bg-sidebar p-6 text-sidebar-foreground lg:border-b-0 lg:border-r">
          <div className="mb-8">
            <p className="text-sm font-semibold text-sidebar-muted">
              {t.brand}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">
              {t.portal.workspacePortal}
            </h1>
          </div>
          <nav className="grid gap-2 text-sm">
            {[
              ["/workspace", t.portal.workspace, "workspace"],
              ["/workspace/members", t.portal.members, "members"],
              ["/workspace/profile", t.portal.profile, "profile"],
            ].map(([href, label, key]) => (
              <a
                className={
                  key === view
                    ? "rounded-md bg-card px-3 py-2 font-medium text-sidebar"
                    : "rounded-md px-3 py-2 text-sidebar-muted hover:bg-sidebar-foreground/10"
                }
                href={href}
                key={href}
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 bg-background">
          <header className="flex flex-col justify-between gap-4 border-b border-border bg-card p-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {name
                  ? t.portal.greeting.replace("{name}", name)
                  : t.portal.saving}
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal">
                {view === "workspace"
                  ? t.portal.workspaceSettings
                  : view === "members"
                    ? t.portal.members
                    : t.portal.profile}
              </h2>
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <Label className="min-w-40">
                {t.fields.language}
                <select
                  className="min-h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  onChange={(event) => changeLocale(event.target.value)}
                  value={locale}
                >
                  {locales.map((item) => (
                    <option key={item} value={item}>
                      {localeLabels[item]}
                    </option>
                  ))}
                </select>
              </Label>
              <Button
                disabled={busyAction === "refresh"}
                onClick={loadProfile}
                type="button"
                variant="outline"
              >
                {busyAction === "refresh" ? t.portal.saving : t.portal.refresh}
              </Button>
              <Button
                disabled={busyAction === "signout"}
                onClick={signOut}
                type="button"
                variant="outline"
              >
                {t.portal.signOut}
              </Button>
            </div>
          </header>

          <div className="grid gap-5 p-5">
            <TenantSummary t={t} tenant={tenant} timezone={timezone} />
            {view === "workspace" ? (
              <WorkspaceSettings
                busyAction={busyAction}
                createOrganization={createOrganization}
                organizationName={organizationName}
                saveWorkspaceSettings={saveWorkspaceSettings}
                setOrganizationName={setOrganizationName}
                setWorkspaceDisplayName={setWorkspaceDisplayName}
                setWorkspaceName={setWorkspaceName}
                t={t}
                tenant={tenant}
                workspaceDisplayName={workspaceDisplayName}
                workspaceName={workspaceName}
              />
            ) : null}
            {view === "members" ? (
              <MembersPage
                addMember={addMember}
                busyAction={busyAction}
                memberEmail={memberEmail}
                setMemberEmail={setMemberEmail}
                t={t}
                tenant={tenant}
              />
            ) : null}
            {view === "profile" ? (
              <ProfilePage
                busyAction={busyAction}
                email={email}
                emailUpdates={emailUpdates}
                name={name}
                saveProfile={saveProfile}
                setEmailUpdates={setEmailUpdates}
                setName={setName}
                setTimezone={setTimezone}
                t={t}
                timezone={timezone}
              />
            ) : null}
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function TenantSummary({
  t,
  tenant,
  timezone,
}: {
  t: (typeof dictionaries)[Locale];
  tenant: TenantSnapshot | null;
  timezone: string;
}) {
  return (
    <Card className="shadow-none">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {t.portal.currentTenant}
          </p>
          <h3 className="mt-2 text-3xl font-semibold tracking-normal">
            {tenant?.organization.name ?? t.portal.noWorkspace}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            {tenant ? t.portal.tenantBoundary : t.portal.workspaceEmpty}
          </p>
        </div>
        <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground">
          {tenant
            ? t.portal.roleLabel.replace(
                "{role}",
                t.roles[tenant.membership.role],
              )
            : t.portal.noRole}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
        {[
          [t.fields.workspace, tenant?.workspace.name],
          [t.fields.displayName, tenant?.workspace.settings.displayName],
          [t.fields.timezone, tenant?.workspace.settings.timezone ?? timezone],
          [
            t.portal.members,
            tenant
              ? t.portal.memberCount.replace(
                  "{count}",
                  String(tenant.memberships.length),
                )
              : undefined,
          ],
        ].map(([label, value]) => (
          <div
            className="rounded-md border border-border bg-muted p-3"
            key={label}
          >
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 truncate text-sm font-semibold">
              {value ?? t.portal.notCreated}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function WorkspaceSettings({
  busyAction,
  createOrganization,
  organizationName,
  saveWorkspaceSettings,
  setOrganizationName,
  setWorkspaceDisplayName,
  setWorkspaceName,
  t,
  tenant,
  workspaceDisplayName,
  workspaceName,
}: {
  busyAction: string | null;
  createOrganization: () => void;
  organizationName: string;
  saveWorkspaceSettings: () => void;
  setOrganizationName: (value: string) => void;
  setWorkspaceDisplayName: (value: string) => void;
  setWorkspaceName: (value: string) => void;
  t: (typeof dictionaries)[Locale];
  tenant: TenantSnapshot | null;
  workspaceDisplayName: string;
  workspaceName: string;
}) {
  return (
    <Card className="max-w-2xl shadow-none">
      <CardHeader>
        <CardTitle>{t.portal.workspaceSettings}</CardTitle>
      </CardHeader>
      <div className="grid gap-3">
        <Label>
          {t.fields.organization}
          <Input
            value={organizationName}
            onChange={(event) => setOrganizationName(event.target.value)}
          />
        </Label>
        <Label>
          {t.fields.workspace}
          <Input
            value={workspaceName}
            onChange={(event) => setWorkspaceName(event.target.value)}
          />
        </Label>
        <Label>
          {t.fields.displayName}
          <Input
            value={workspaceDisplayName}
            onChange={(event) => setWorkspaceDisplayName(event.target.value)}
          />
        </Label>
        <Button
          disabled={
            busyAction === "workspace" || tenant?.membership.role === "member"
          }
          onClick={tenant ? saveWorkspaceSettings : createOrganization}
          type="button"
        >
          {busyAction === "workspace"
            ? t.portal.saving
            : tenant
              ? t.fields.saveWorkspace
              : t.fields.createWorkspace}
        </Button>
        {tenant?.membership.role === "member" ? (
          <p className="text-sm text-muted-foreground">
            {t.portal.ownerSettingsOnly}
          </p>
        ) : null}
      </div>
    </Card>
  );
}

function MembersPage({
  addMember,
  busyAction,
  memberEmail,
  setMemberEmail,
  t,
  tenant,
}: {
  addMember: () => void;
  busyAction: string | null;
  memberEmail: string;
  setMemberEmail: (value: string) => void;
  t: (typeof dictionaries)[Locale];
  tenant: TenantSnapshot | null;
}) {
  return (
    <Card className="max-w-2xl shadow-none">
      <CardHeader>
        <CardTitle>{t.portal.members}</CardTitle>
      </CardHeader>
      {tenant?.membership.role === "owner" ? (
        <div className="grid gap-3">
          <Label>
            {t.fields.memberEmail}
            <Input
              type="email"
              value={memberEmail}
              onChange={(event) => setMemberEmail(event.target.value)}
            />
          </Label>
          <Button
            disabled={busyAction === "member"}
            onClick={addMember}
            type="button"
          >
            {busyAction === "member" ? t.portal.saving : t.fields.addMember}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {t.portal.ownerSettingsOnly}
        </p>
      )}
    </Card>
  );
}

function ProfilePage({
  busyAction,
  email,
  emailUpdates,
  name,
  saveProfile,
  setEmailUpdates,
  setName,
  setTimezone,
  t,
  timezone,
}: {
  busyAction: string | null;
  email: string;
  emailUpdates: boolean;
  name: string;
  saveProfile: () => void;
  setEmailUpdates: (value: boolean) => void;
  setName: (value: string) => void;
  setTimezone: (value: string) => void;
  t: (typeof dictionaries)[Locale];
  timezone: string;
}) {
  return (
    <Card className="max-w-2xl shadow-none">
      <CardHeader>
        <CardTitle>{t.portal.profile}</CardTitle>
      </CardHeader>
      <div className="grid gap-3">
        <Label>
          {t.fields.name}
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Label>
        <Label>
          {t.fields.email}
          <Input readOnly value={email} />
        </Label>
        <Label>
          {t.fields.timezone}
          <Input
            value={timezone}
            onChange={(event) => setTimezone(event.target.value)}
          />
        </Label>
        <Label className="grid-cols-[auto_1fr] content-center items-center gap-3">
          <Input
            checked={emailUpdates}
            className="min-h-4 w-4"
            onChange={(event) => setEmailUpdates(event.target.checked)}
            type="checkbox"
          />
          {t.fields.emailUpdates}
        </Label>
        <Button
          disabled={busyAction === "profile"}
          onClick={saveProfile}
          type="button"
        >
          {busyAction === "profile" ? t.portal.saving : t.fields.saveChanges}
        </Button>
      </div>
    </Card>
  );
}
