import type { Locale } from "@/i18n";
import { isLocale } from "@/i18n";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  preferences: {
    timezone: string;
    emailUpdates: boolean;
  };
};

export type TenantSnapshot = {
  organization: {
    id: string;
    name: string;
    ownerId: string;
  };
  workspace: {
    id: string;
    organizationId: string;
    name: string;
    settings: {
      displayName?: string;
      timezone?: string;
    };
  };
  membership: {
    role: "owner" | "member";
  };
  memberships: Array<{
    userId: string;
    role: "owner" | "member";
  }>;
};

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
export const localeStorageKey = "code-hammer-locale";

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLocale = window.localStorage.getItem(localeStorageKey);
  return storedLocale && isLocale(storedLocale) ? storedLocale : "en";
}

export function apiRequest(
  path: string,
  method: "GET" | "POST" | "PATCH",
  body?: unknown,
) {
  return fetch(`${apiUrl()}${path}`, {
    method,
    credentials: "include",
    headers: body
      ? {
          "content-type": "application/json",
        }
      : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiUrl() {
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
  ) {
    return `${window.location.protocol}//${window.location.hostname}:3001`;
  }

  return configuredApiUrl ?? "http://127.0.0.1:3001";
}
