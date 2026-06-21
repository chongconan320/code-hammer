"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import {
  WorkspaceProvider,
  useWorkspace,
} from "@/app/workspace/workspace-console";
import { apiRequest } from "@/app/client-helpers";
import { locales, localeLabels } from "@/i18n";

/* ── Sidebar nav items ── */

const NAV_ITEMS = [
  {
    href: "/workspace",
    labelKey: "overview",
    icon: <Icon icon="lucide:layout-dashboard" width="18" height="18" />,
  },
  {
    href: "/workspace/settings",
    labelKey: "settings",
    icon: <Icon icon="lucide:settings" width="18" height="18" />,
  },
  {
    href: "/workspace/members",
    labelKey: "members",
    icon: <Icon icon="lucide:users" width="18" height="18" />,
  },
  {
    href: "/workspace/profile",
    labelKey: "profile",
    icon: <Icon icon="lucide:user" width="18" height="18" />,
  },
  {
    href: "/workspace/billing",
    labelKey: "billing",
    icon: <Icon icon="lucide:credit-card" width="18" height="18" />,
  },
] as const;

const PAGE_TITLES: Record<string, string> = {
  "/workspace": "Overview",
  "/workspace/settings": "Workspace Settings",
  "/workspace/members": "Members",
  "/workspace/profile": "Profile",
  "/workspace/billing": "Billing",
};

/* ── Inner shell (has access to context) ── */

function WorkspaceShell({ children }: { children: ReactNode }) {
  const { locale, setLocale, t, user, refreshProfile } = useWorkspace();
  const pathname = usePathname();

  async function handleSignOut() {
    await apiRequest("/auth/signout", "POST");
    window.location.assign("/");
  }

  const pageTitle = pathname
    ? (PAGE_TITLES[pathname] ?? "Workspace")
    : "Workspace";

  return (
    <div style={{ display: "flex", minHeight: "100dvh" }}>
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 248,
          flexShrink: 0,
          background: "hsl(var(--color-sidebar))",
          color: "hsl(var(--color-sidebar-foreground))",
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem 1rem",
          gap: "1.5rem",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            padding: "0 0.5rem",
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "hsl(var(--color-primary))",
              color: "hsl(var(--color-primary-foreground))",
              display: "grid",
              placeItems: "center",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            CH
          </span>
          <span style={{ fontSize: "0.9375rem", fontWeight: 600 }}>
            {t.brand}
          </span>
        </div>

        {/* Nav */}
        <nav
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <span
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "hsl(0 0% 100% / 0.36)",
              padding: "1rem 0.625rem 0.375rem",
            }}
          >
            Workspace
          </span>
          {NAV_ITEMS.map(({ href, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  padding: "0.5rem 0.625rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.8125rem",
                  fontWeight: active ? 600 : 500,
                  color: active
                    ? "hsl(var(--color-sidebar-foreground))"
                    : "hsl(0 0% 100% / 0.64)",
                  background: active ? "hsl(0 0% 100% / 0.12)" : "transparent",
                  textDecoration: "none",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {icon}
                {href === "/workspace"
                  ? "Overview"
                  : href === "/workspace/settings"
                    ? "Settings"
                    : href === "/workspace/members"
                      ? "Members"
                      : href === "/workspace/profile"
                        ? "Profile"
                        : "Billing"}
              </Link>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        {/* User chip */}
        <div
          style={{
            borderTop: "1px solid hsl(0 0% 100% / 0.10)",
            paddingTop: "0.75rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.375rem 0.5rem",
              borderRadius: "0.5rem",
              fontSize: "0.8125rem",
              color: "hsl(0 0% 100% / 0.64)",
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "hsl(153 44% 27% / 0.28)",
                color: "hsl(var(--color-sidebar-foreground))",
                display: "grid",
                placeItems: "center",
                fontSize: "0.6875rem",
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
            </span>
            <span>{user?.name ?? "..."}</span>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Topbar */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1.5rem",
            gap: "1rem",
            background: "hsl(var(--color-card))",
            borderBottom: "1px solid hsl(var(--color-border))",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                margin: 0,
              }}
            >
              {pageTitle}
            </h2>
            <p
              style={{
                fontSize: "0.75rem",
                color: "hsl(var(--color-muted-foreground))",
                margin: "0.125rem 0 0",
              }}
            >
              {user
                ? t.portal.greeting.replace("{name}", user.name)
                : "Loading…"}
            </p>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            {/* Locale select */}
            <select
              value={locale}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "en" || v === "zh-CN" || v === "ms") setLocale(v);
              }}
              style={{
                height: "2.25rem",
                padding: "0 0.5rem",
                borderRadius: "0.5rem",
                border: "1px solid hsl(var(--color-border))",
                background: "hsl(var(--color-card))",
                color: "hsl(var(--color-foreground))",
                fontSize: "0.8125rem",
                cursor: "pointer",
              }}
            >
              {locales.map((l) => (
                <option key={l} value={l}>
                  {localeLabels[l]}
                </option>
              ))}
            </select>

            {/* Refresh */}
            <button
              type="button"
              onClick={() => refreshProfile()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: "2.25rem",
                padding: "0 0.875rem",
                borderRadius: "0.5rem",
                border: "1px solid hsl(var(--color-border))",
                background: "hsl(var(--color-card))",
                color: "hsl(var(--color-foreground))",
                fontSize: "0.8125rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Refresh
            </button>

            {/* Sign out */}
            <button
              type="button"
              onClick={handleSignOut}
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: "2.25rem",
                padding: "0 0.875rem",
                borderRadius: "0.5rem",
                border: "none",
                background: "transparent",
                color: "hsl(var(--color-muted-foreground))",
                fontSize: "0.8125rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: "1.5rem", flex: 1, overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Exported layout ── */

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider>
      <WorkspaceShell>{children}</WorkspaceShell>
    </WorkspaceProvider>
  );
}
