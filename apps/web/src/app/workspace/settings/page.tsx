"use client";

import { useState } from "react";
import { useWorkspace } from "@/app/workspace/workspace-console";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WorkspaceSettingsPage() {
  const { t, tenant, createOrganization, saveWorkspaceSettings } =
    useWorkspace();

  const [orgName, setOrgName] = useState(tenant?.organization.name ?? "");
  const [wsName, setWsName] = useState(tenant?.workspace.name ?? "");
  const [display, setDisplay] = useState(
    tenant?.workspace.settings.displayName ?? tenant?.workspace.name ?? "",
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSave() {
    setBusy(true);
    const err = tenant
      ? await saveWorkspaceSettings({ displayName: display })
      : await createOrganization({
          organizationName: orgName,
          workspaceName: wsName,
          workspaceDisplayName: display,
        });
    setMsg(
      err ?? (tenant ? t.portal.workspaceSaved : t.portal.workspaceCreated),
    );
    setBusy(false);
  }

  const isOwner = tenant?.membership.role === "owner";

  return (
    <div className="max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm xl:max-w-3xl xl:mx-auto">
      <h3 className="text-base font-semibold">{t.portal.workspaceSettings}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Configure your organization and workspace details.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            {t.fields.organization}
          </label>
          <Input
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            disabled={!!tenant}
          />
          {!!tenant && (
            <p className="mt-1 text-xs text-muted-foreground">
              Organization name cannot be changed after creation.
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            {t.fields.workspace}
          </label>
          <Input
            value={wsName}
            onChange={(e) => setWsName(e.target.value)}
            disabled={!!tenant}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            {t.fields.displayName}
          </label>
          <Input
            value={display}
            onChange={(e) => setDisplay(e.target.value)}
            disabled={!isOwner}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            How this workspace appears to members.
          </p>
        </div>

        <Button onClick={handleSave} disabled={busy || !isOwner} type="button">
          {busy
            ? t.portal.saving
            : tenant
              ? t.fields.saveWorkspace
              : t.fields.createWorkspace}
        </Button>

        {!isOwner && (
          <p className="text-sm text-muted-foreground">
            {t.portal.ownerSettingsOnly}
          </p>
        )}

        {msg ? <p className="text-sm text-muted-foreground">{msg}</p> : null}
      </div>
    </div>
  );
}
