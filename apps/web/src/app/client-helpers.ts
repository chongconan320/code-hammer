import type { Locale } from "@/i18n";
import { isLocale } from "@/i18n";
import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosRequestConfig,
} from "axios";

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
const MAX_RETRIES = 2;

export const apiClient = axios.create({
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  config.baseURL = apiUrl();
  return config;
});

apiClient.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as
    | (AxiosRequestConfig & { retryCount?: number })
    | undefined;
  const status = error.response?.status;
  const shouldRetry = !status || status >= 500;

  if (!config || !shouldRetry) {
    throw error;
  }

  config.retryCount = config.retryCount ?? 0;
  if (config.retryCount >= MAX_RETRIES) {
    if (typeof window !== "undefined") {
      window.location.assign("/500");
    }
    throw error;
  }

  config.retryCount += 1;
  return apiClient(config);
});

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLocale = window.localStorage.getItem(localeStorageKey);
  return storedLocale && isLocale(storedLocale) ? storedLocale : "en";
}

export async function apiRequest(
  path: string,
  method: "GET" | "POST" | "PATCH",
  body?: unknown,
) {
  const response = await apiClient.request({
    url: path,
    method,
    data: body,
    headers: body ? { "content-type": "application/json" } : undefined,
    validateStatus: (status) => status < 500,
  });

  return {
    ok: response.status >= 200 && response.status < 300,
    status: response.status,
    headers: new Headers(
      Object.entries(
        response.headers instanceof AxiosHeaders
          ? response.headers.toJSON()
          : response.headers,
      ).map(([key, value]) => [key, String(value)]),
    ),
    json: async () => response.data,
  };
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
