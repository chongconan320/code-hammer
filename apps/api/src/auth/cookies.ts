import type { Request, Response } from "express";

export const sessionCookieName = "ch_session";

export function readSessionToken(request: Request): string | undefined {
  return request.cookies?.[sessionCookieName];
}

export function setSessionCookie(response: Response, token: string) {
  response.cookie(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie(response: Response) {
  response.clearCookie(sessionCookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
}
