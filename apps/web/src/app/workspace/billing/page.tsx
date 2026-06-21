"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useWorkspace } from "@/app/workspace/workspace-console";
import { apiRequest } from "@/app/client-helpers";

type PlanData = {
  plan: { id: string; name: string; limits: PlanLimits };
  subscription: {
    id: string;
    planId: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
  };
  usage: UsageData;
};

type PlanLimits = {
  maxDocuments: number;
  maxAiMessages: number;
  maxStorageBytes: number;
  maxWorkflowRuns: number;
  maxMembers: number;
};

type UsageData = {
  documents: number;
  aiMessages: number;
  storageBytes: number;
  workflowRuns: number;
};

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

function UsageBar({
  label,
  used,
  limit,
  icon,
}: {
  label: string;
  used: number;
  limit: number;
  icon: string;
}) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Icon icon={icon} width="16" height="16" />
          {label}
        </span>
        <span className="text-muted-foreground">
          {used.toLocaleString()} /{" "}
          {limit === 999 ? "∞" : limit.toLocaleString()}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function BillingPage() {
  const { t, tenant } = useWorkspace();
  const [data, setData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/billing/plan", "GET");
        const json = await res.json();
        if (!res.ok) {
          const msg = json.message ?? "Could not load billing data.";
          setError(msg);
          return;
        }
        setData(json);
      } catch {
        const msg = "Could not connect to billing service.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Loading billing…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          No billing information available. Create an organization first.
        </p>
      </div>
    );
  }

  const { plan, subscription, usage } = data;

  const statusColors: Record<string, string> = {
    trialing: "bg-blue-100 text-blue-800",
    active: "bg-green-100 text-green-800",
    past_due: "bg-red-100 text-red-800",
    canceled: "bg-gray-100 text-gray-600",
    inactive: "bg-gray-100 text-gray-600",
  };

  const periodEnd = new Date(subscription.currentPeriodEnd);

  return (
    <div className="space-y-6 xl:max-w-[1440px] xl:mx-auto">
      {/* Plan header */}
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-card p-5 shadow-sm md:flex-row md:items-start">
        <div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              statusColors[subscription.status] ??
              "bg-muted text-muted-foreground"
            }`}
          >
            {subscription.status}
          </span>
          <h3 className="mt-3 text-[1.625rem] font-bold">{plan.name} Plan</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {subscription.status === "trialing"
              ? `Trial ends ${periodEnd.toLocaleDateString()}`
              : `Current period ends ${periodEnd.toLocaleDateString()}`}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-10 items-center rounded-md border border-primary bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          onClick={() => {
            /* Stripe checkout placeholder */
          }}
        >
          Upgrade
        </button>
      </div>

      {/* Usage */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h4 className="mb-4 text-sm font-semibold">Current Usage</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <UsageBar
            label="Documents"
            used={usage.documents}
            limit={plan.limits.maxDocuments}
            icon="lucide:file-text"
          />
          <UsageBar
            label="AI Messages"
            used={usage.aiMessages}
            limit={plan.limits.maxAiMessages}
            icon="lucide:message-square"
          />
          <UsageBar
            label="Storage"
            used={usage.storageBytes}
            limit={plan.limits.maxStorageBytes}
            icon="lucide:hard-drive"
          />
          <UsageBar
            label="Workflow Runs"
            used={usage.workflowRuns}
            limit={plan.limits.maxWorkflowRuns}
            icon="lucide:play"
          />
        </div>
      </div>

      {/* Plan comparison */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <h4 className="mb-4 text-sm font-semibold">Available Plans</h4>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["free", "starter", "professional", "business"].map((planId) => {
            const isCurrent = plan.id === planId;
            const names: Record<string, string> = {
              free: "Free",
              starter: "Starter",
              professional: "Pro",
              business: "Business",
            };
            return (
              <div
                key={planId}
                className={`rounded-md border p-4 ${
                  isCurrent ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{names[planId]}</span>
                  {isCurrent && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.625rem] font-semibold text-primary">
                      Current
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
