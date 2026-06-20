"use client";

import { useState } from "react";
import { useWorkspace } from "../workspace-console";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function MembersPage() {
  const { t, tenant, addMember } = useWorkspace();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const isOwner = tenant?.membership.role === "owner";

  async function handleAdd() {
    if (!email.trim()) return;
    setBusy(true);
    const err = await addMember(email.trim());
    if (err) {
      setMsg(err);
    } else {
      setMsg(t.portal.memberAdded);
      setEmail("");
    }
    setBusy(false);
  }

  return (
    <div className="max-w-3xl rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border p-5">
        <h3 className="text-base font-semibold">{t.portal.members}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage who has access to this workspace.
        </p>
      </div>

      {/* Members table */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted text-left text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
            <th className="px-4 py-2.5">Member</th>
            <th className="px-4 py-2.5">Email</th>
            <th className="px-4 py-2.5">Role</th>
          </tr>
        </thead>
        <tbody>
          {tenant?.memberships.map((m, i) => (
            <tr key={m.userId} className="border-b border-border last:border-b-0">
              <td className="px-4 py-2.5 text-sm font-semibold">
                {m.role === "owner" ? "Owner" : `Member ${i}`}
              </td>
              <td className="px-4 py-2.5 text-sm text-muted-foreground">
                — {/* emails come from profile data in a real app */}
              </td>
              <td className="px-4 py-2.5">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                    m.role === "owner"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {t.roles[m.role]}
                </span>
              </td>
            </tr>
          ))}
          {(!tenant?.memberships || tenant.memberships.length === 0) && (
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-sm text-muted-foreground">
                No members yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add member row */}
      {isOwner && (
        <div className="flex gap-2 border-t border-border bg-muted px-4 py-3">
          <Input
            type="email"
            placeholder={t.fields.memberEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAdd} disabled={busy} type="button">
            {busy ? t.portal.saving : t.fields.addMember}
          </Button>
        </div>
      )}

      {!isOwner && (
        <p className="px-5 py-4 text-sm text-muted-foreground">
          {t.portal.ownerSettingsOnly}
        </p>
      )}

      {msg ? (
        <p className="border-t border-border px-5 py-3 text-sm text-muted-foreground">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
