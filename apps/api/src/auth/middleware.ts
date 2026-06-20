import type { PublicUser } from "@code-hammer/shared";
import type { NextFunction, Request, Response } from "express";
import { readSessionToken } from "./cookies";
import { authService } from "./service";

export type AuthenticatedRequest = Request & {
  user: PublicUser;
  sessionToken: string;
};

export async function requireAuth(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const sessionToken = readSessionToken(request);
  const user = await authService.getUserForSession(sessionToken);

  if (!sessionToken || !user) {
    response.status(401).json({
      error: "unauthorized",
      message: "Authentication is required.",
    });
    return;
  }

  (request as AuthenticatedRequest).user = user;
  (request as AuthenticatedRequest).sessionToken = sessionToken;
  next();
}
