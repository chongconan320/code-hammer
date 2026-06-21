import {
  passwordResetConfirmRequestSchema,
  passwordResetRequestSchema,
  signInRequestSchema,
  signUpRequestSchema,
} from "@code-hammer/shared";
import type { Express, Response } from "express";
import {
  clearSessionCookie,
  readSessionToken,
  setSessionCookie,
} from "../auth/cookies";
import { AuthError, authService } from "../auth/service";
import { validateRequest } from "../validation";

export function registerAuthRoutes(app: Express) {
  app.post(
    "/auth/signup",
    validateRequest({
      body: signUpRequestSchema,
    }),
    async (request, response, next) => {
      try {
        const result = await authService.signUp(request.body);
        setSessionCookie(response, result.sessionToken);
        response.status(201).json({
          user: result.user,
        });
      } catch (error) {
        handleAuthError(error, response, next);
      }
    },
  );

  app.post(
    "/auth/signin",
    validateRequest({
      body: signInRequestSchema,
    }),
    async (request, response, next) => {
      try {
        const result = await authService.signIn(
          request.body.email,
          request.body.password,
        );
        setSessionCookie(response, result.sessionToken);
        response.json({
          user: result.user,
        });
      } catch (error) {
        handleAuthError(error, response, next);
      }
    },
  );

  app.post("/auth/signout", async (request, response) => {
    await authService.signOut(readSessionToken(request));
    clearSessionCookie(response);
    response.json({ ok: true });
  });

  app.post(
    "/auth/password-reset/request",
    validateRequest({
      body: passwordResetRequestSchema,
    }),
    async (request, response) => {
      const resetToken = await authService.requestPasswordReset(
        request.body.email,
      );

      response.json({
        ok: true,
        ...(resetToken ? { resetToken } : {}),
      });
    },
  );

  app.post(
    "/auth/password-reset/confirm",
    validateRequest({
      body: passwordResetConfirmRequestSchema,
    }),
    async (request, response, next) => {
      try {
        await authService.confirmPasswordReset(
          request.body.token,
          request.body.password,
        );
        response.json({ ok: true });
      } catch (error) {
        handleAuthError(error, response, next);
      }
    },
  );
}

function handleAuthError(
  error: unknown,
  response: Response,
  next: (error: unknown) => void,
) {
  console.error(error);
  if (error instanceof AuthError) {
    response.status(error.statusCode).json({
      error: error.code,
      message: error.message,
    });
    return;
  }

  next(error);
}
