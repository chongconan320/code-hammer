"use client";

import { Icon } from "@iconify/react";
import { useWorkspace } from "@/app/workspace/workspace-console";

export default function WorkspaceOverviewPage() {
  const { t, tenant, user } = useWorkspace();

  const cards = [
    {
      icon: <Icon icon="lucide:file-text" width="18" height="18" />,
      title: t.portal.cards[0].title,
      value: t.portal.cards[0].value,
      detail: t.portal.cards[0].detail,
    },
    {
      icon: <Icon icon="lucide:clipboard-check" width="18" height="18" />,
      title: t.portal.cards[1].title,
      value: t.portal.cards[1].value,
      detail: t.portal.cards[1].detail,
    },
    {
      icon: <Icon icon="lucide:message-square" width="18" height="18" />,
      title: t.portal.cards[2].title,
      value: t.portal.cards[2].value,
      detail: t.portal.cards[2].detail,
    },
  ];

  return (
    <div className="xl:max-w-[1440px] xl:mx-auto">
      {/* Tenant banner */}
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-card p-5 shadow-sm md:flex-row md:items-start">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {tenant
              ? t.portal.roleLabel.replace(
                  "{role}",
                  t.roles[tenant.membership.role],
                )
              : t.portal.noRole}
          </span>
          <h3 className="mt-3 text-[1.625rem] font-bold">
            {tenant?.organization.name ?? t.portal.noWorkspace}
          </h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {tenant ? t.portal.tenantBoundary : t.portal.workspaceEmpty}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              [t.fields.workspace, tenant?.workspace.name],
              [t.fields.displayName, tenant?.workspace.settings.displayName],
              [
                t.fields.timezone,
                tenant?.workspace.settings.timezone ??
                  user?.preferences.timezone,
              ],
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
                key={label}
                className="flex flex-col gap-0.5 rounded-md border border-border bg-muted px-3 py-2"
              >
                <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                </span>
                <span className="text-sm font-semibold">
                  {value ?? t.portal.notCreated}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ icon, title, value, detail }) => (
          <div
            key={title}
            className="rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary"
          >
            <div className="mb-3 inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              {icon}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>

      {/* Activity */}
      <h3 className="mt-6 text-sm font-semibold">{t.portal.activityTitle}</h3>
      <div className="mt-3 flex flex-col gap-2">
        {t.portal.activityItems.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-md border border-border bg-card px-3.5 py-2.5 text-sm shadow-sm"
          >
            <span className="size-2 shrink-0 rounded-full bg-primary" />
            {item}
            <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[0.6875rem] font-semibold text-muted-foreground">
              {t.portal.pending}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
