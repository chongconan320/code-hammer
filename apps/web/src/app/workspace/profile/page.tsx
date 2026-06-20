"use client";

import { useState } from "react";
import { useWorkspace } from "@/app/workspace/workspace-console";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { t, user, saveProfile } = useWorkspace();

  const [name, setName] = useState(user?.name ?? "");
  const [timezone, setTimezone] = useState(
    user?.preferences.timezone ?? "Asia/Kuala_Lumpur",
  );
  const [emailUpdates, setEmailUpdates] = useState(
    user?.preferences.emailUpdates ?? true,
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSave() {
    setBusy(true);
    const err = await saveProfile({
      name,
      preferences: { timezone, emailUpdates },
    });
    setMsg(err ?? t.portal.profileSaved);
    setBusy(false);
  }

  return (
    <div className="max-w-xl rounded-lg border border-border bg-card p-6 shadow-sm">
      <h3 className="text-base font-semibold">{t.portal.profile}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Update your personal information and preferences.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            {t.fields.name}
          </label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            {t.fields.email}
          </label>
          <Input value={user?.email ?? ""} readOnly />
          <p className="mt-1 text-xs text-muted-foreground">
            Contact support to change your email.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            {t.fields.timezone}
          </label>
          <Input
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={emailUpdates}
              onChange={(e) => setEmailUpdates(e.target.checked)}
              className="size-4 accent-primary"
            />
            {t.fields.emailUpdates}
          </label>
        </div>

        <Button onClick={handleSave} disabled={busy} type="button">
          {busy ? t.portal.saving : t.fields.saveChanges}
        </Button>

        {msg ? (
          <p className="text-sm text-muted-foreground">{msg}</p>
        ) : null}
      </div>
    </div>
  );
}
