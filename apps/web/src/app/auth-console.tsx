"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  type Locale,
  dictionaries,
  isLocale,
  localeLabels,
  locales,
} from "../i18n";

type PublicUser = {
  id: string;
  name: string;
  email: string;
  preferences: {
    timezone: string;
    emailUpdates: boolean;
  };
};

type AuthMode = "signin" | "signup";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3001";
const localeStorageKey = "code-hammer-locale";
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
  const [email, setEmail] = useState("conan@example.com");
  const [password, setPassword] = useState("strong-password");
  const [timezone, setTimezone] = useState("Asia/Kuala_Lumpur");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [message, setMessage] = useState(
    () => dictionaries[getStoredLocale()].auth.defaultMessage,
  );
  const t = dictionaries[locale];

  async function submitAuth() {
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

    const response = await apiRequest(endpoint, "POST", body);
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message ?? data.error ?? t.auth.authFailed);
      return;
    }

    applyUser(data.user);
    setMessage(
      mode === "signup" ? t.auth.workspaceCreated : t.auth.welcomeBack,
    );
  }

  async function requestPasswordReset() {
    const response = await apiRequest("/auth/password-reset/request", "POST", {
      email,
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message ?? data.error ?? t.auth.resetUnavailable);
      return;
    }

    setMessage(t.auth.resetSent);
  }

  async function loadProfile() {
    const response = await apiRequest("/profile", "GET");
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message ?? data.error ?? t.portal.profileUnavailable);
      setUser(null);
      return;
    }

    applyUser(data.user);
    setMessage(t.portal.profileRefreshed);
  }

  async function saveProfile() {
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
      return;
    }

    applyUser(data.user);
    setMessage(t.portal.profileSaved);
  }

  async function signOut() {
    const response = await apiRequest("/auth/signout", "POST");
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message ?? data.error ?? t.portal.signOutFailed);
      return;
    }

    setUser(null);
    setMessage(t.auth.signedOut);
  }

  function changeLocale(value: string) {
    if (!isLocale(value)) {
      return;
    }

    setLocale(value);
    localStorage.setItem(localeStorageKey, value);
    setMessage(dictionaries[value].auth.defaultMessage);
  }

  function applyUser(nextUser: PublicUser) {
    setUser(nextUser);
    setName(nextUser.name);
    setEmail(nextUser.email);
    setTimezone(nextUser.preferences.timezone);
    setEmailUpdates(nextUser.preferences.emailUpdates);
  }

  if (user) {
    return (
      <main className="min-h-screen bg-background p-4 text-foreground md:p-8">
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
              {t.portal.nav.map((item, index) => (
                <button
                  className={
                    index === 0
                      ? "rounded-md bg-card px-3 py-2 text-left font-medium text-sidebar"
                      : "rounded-md px-3 py-2 text-left text-sidebar-muted hover:bg-sidebar-foreground/10"
                  }
                  key={item}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 bg-background">
            <header className="flex flex-col justify-between gap-4 border-b border-border bg-card p-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t.portal.greeting.replace("{name}", user.name)}
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-normal">
                  {t.portal.commandCenter}
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
                <Button onClick={loadProfile} type="button" variant="outline">
                  {t.portal.refresh}
                </Button>
                <Button onClick={signOut} type="button" variant="outline">
                  {t.portal.signOut}
                </Button>
              </div>
            </header>

            <div className="grid gap-5 p-5">
              <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {t.portal.cards.map((card) => (
                  <Card className="shadow-none" key={card.title}>
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <div className="mt-3 text-2xl font-semibold">
                      {card.value}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {card.detail}
                    </p>
                  </Card>
                ))}
              </section>

              <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
                <Card className="shadow-none">
                  <CardHeader>
                    <CardTitle>{t.portal.activityTitle}</CardTitle>
                  </CardHeader>
                  <div className="grid gap-3">
                    {t.portal.activityItems.map((item) => (
                      <div
                        className="flex items-center justify-between rounded-md border border-border bg-muted p-3 text-sm"
                        key={item}
                      >
                        <span>{item}</span>
                        <span className="text-muted-foreground">
                          {t.portal.pending}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="shadow-none">
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
                        onChange={(event) =>
                          setEmailUpdates(event.target.checked)
                        }
                        type="checkbox"
                      />
                      {t.fields.emailUpdates}
                    </Label>
                    <Button onClick={saveProfile} type="button">
                      {t.fields.saveChanges}
                    </Button>
                  </div>
                </Card>
              </section>

              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </div>
        </section>
      </main>
    );
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
          <Card className="shadow-none p-4">
            <CardHeader>
              <p className="text-sm font-medium text-muted-foreground">
                {t.auth.workspaceAccess}
              </p>
              <CardTitle>
                {mode === "signin" ? t.auth.signInTitle : t.auth.signUpTitle}
              </CardTitle>
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
              <Button onClick={submitAuth} type="button">
                {mode === "signin" ? t.auth.openPortal : t.auth.createAccount}
              </Button>
              <Button
                onClick={requestPasswordReset}
                type="button"
                variant="outline"
              >
                {t.auth.resetPassword}
              </Button>
            </div>

            <p className="mt-4 min-h-5 text-sm text-muted-foreground">
              {message}
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
}

function getStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLocale = window.localStorage.getItem(localeStorageKey);

  return storedLocale && isLocale(storedLocale) ? storedLocale : "en";
}

async function apiRequest(
  path: string,
  method: "GET" | "POST" | "PATCH",
  body?: unknown,
) {
  return fetch(`${apiUrl}${path}`, {
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
