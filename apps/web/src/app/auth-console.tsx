"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/toast";
import {
  type Locale,
  dictionaries,
  isLocale,
  localeLabels,
  locales,
} from "@/i18n";
import {
  apiRequest,
  getStoredLocale,
  localeStorageKey,
} from "@/app/client-helpers";

type AuthMode = "signin" | "signup";

const brandTiles = [
  "top-left",
  "top-center-left",
  "top-center-right",
  "top-right",
  "middle-left",
  "middle-center-left",
  "middle-center-right",
  "middle-right",
  "bottom-left",
  "bottom-center-left",
  "bottom-center-right",
  "bottom-right",
] as const;

export function AuthConsole() {
  const [locale, setLocale] = useState<Locale>(getStoredLocale);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("Conan Chong");
  const [email, setEmail] = useState("admin@codehammer.local");
  const [password, setPassword] = useState("strong-password");
  const [timezone, setTimezone] = useState("Asia/Kuala_Lumpur");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const toast = useToast();
  const t = dictionaries[locale];

  async function submitAuth() {
    setBusyAction("auth");
    const endpoint = mode === "signup" ? "/auth/signup" : "/auth/signin";
    const body =
      mode === "signup"
        ? {
            name,
            email,
            password,
            preferences: {
              timezone,
              emailUpdates,
            },
          }
        : {
            email,
            password,
          };

    try {
      const response = await apiRequest(endpoint, "POST", body);
      const data = await response.json();

      if (!response.ok) {
        toast.show(data.message ?? data.error ?? t.auth.authFailed, "error");
        return;
      }

      window.location.assign("/workspace");
    } finally {
      setBusyAction(null);
    }
  }

  async function requestPasswordReset() {
    setBusyAction("reset");
    const response = await apiRequest("/auth/password-reset/request", "POST", {
      email,
    });
    const data = await response.json();

    if (!response.ok) {
      toast.show(
        data.message ?? data.error ?? t.auth.resetUnavailable,
        "error",
      );
      setBusyAction(null);
      return;
    }

    toast.show(t.auth.resetSent, "success");
    setBusyAction(null);
  }

  function changeLocale(value: string) {
    if (!isLocale(value)) {
      return;
    }

    setLocale(value);
    localStorage.setItem(localeStorageKey, value);
    toast.show(dictionaries[value].auth.defaultMessage, "info");
  }

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-background p-4 text-foreground md:p-6">
      <section className="grid w-full max-w-[760px] overflow-hidden rounded-lg border border-border bg-card shadow-panel lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col justify-between bg-sidebar p-6 text-sidebar-foreground">
          <div>
            <div className="mb-8 inline-flex rounded-md border border-sidebar-border px-3 py-2 text-xs font-semibold">
              {t.brand}
            </div>
            <h1 className="text-2xl font-semibold leading-tight tracking-normal">
              {t.auth.heroTitle}
            </h1>
            <p className="mt-4 text-sm leading-6 text-sidebar-muted">
              {t.auth.heroBody}
            </p>
          </div>

          <div className="mt-10 grid gap-4">
            <div className="grid size-24 place-items-center rounded-lg border border-sidebar-border bg-sidebar-foreground/10 text-3xl font-semibold">
              {t.auth.brandInitials}
            </div>
            <div className="grid grid-cols-4 gap-2" aria-hidden="true">
              {brandTiles.map((tile, index) => (
                <div
                  className={
                    index === 5 || index === 10
                      ? "h-8 rounded-md bg-primary"
                      : "h-8 rounded-md border border-sidebar-border bg-sidebar-foreground/5"
                  }
                  key={tile}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid content-center p-5 md:p-7">
          <Card className="p-4 shadow-none">
            <CardHeader>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.auth.workspaceAccess}
                  </p>
                  <CardTitle>
                    {mode === "signin"
                      ? t.auth.signInTitle
                      : t.auth.signUpTitle}
                  </CardTitle>
                </div>
                <Label className="min-w-32">
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
              </div>
            </CardHeader>

            <div className="mb-5 grid grid-cols-2 gap-2 rounded-md bg-muted p-1">
              <Button
                onClick={() => setMode("signin")}
                type="button"
                variant={mode === "signin" ? "default" : "ghost"}
              >
                {t.auth.signIn}
              </Button>
              <Button
                onClick={() => setMode("signup")}
                type="button"
                variant={mode === "signup" ? "default" : "ghost"}
              >
                {t.auth.signUp}
              </Button>
            </div>

            <div className="grid gap-3">
              {mode === "signup" ? (
                <Label>
                  {t.fields.name}
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </Label>
              ) : null}
              <Label>
                {t.fields.email}
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Label>
              <Label>
                {t.fields.password}
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Label>
              {mode === "signup" ? (
                <>
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
                      onChange={(event) =>
                        setEmailUpdates(event.target.checked)
                      }
                      type="checkbox"
                    />
                    {t.fields.emailUpdates}
                  </Label>
                </>
              ) : null}
            </div>

            <div className="mt-5 grid gap-2">
              <Button
                disabled={busyAction === "auth"}
                onClick={submitAuth}
                type="button"
              >
                {busyAction === "auth"
                  ? t.auth.checking
                  : mode === "signin"
                    ? t.auth.openPortal
                    : t.auth.createAccount}
              </Button>
              <Button
                disabled={busyAction === "reset"}
                onClick={requestPasswordReset}
                type="button"
                variant="outline"
              >
                {t.auth.resetPassword}
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
