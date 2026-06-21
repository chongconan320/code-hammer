import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type {
  PublicUser,
  SignUpRequest,
  UpdateProfileRequest,
  UserPreferences,
} from "@code-hammer/shared";
import {
  createUser,
  findUserByEmail as findDbUserByEmail,
  findUserById as findDbUserById,
  updateUserPassword,
  updateUserProfile,
} from "./queries";

type StoredUser = PublicUser & {
  passwordHash: string;
  passwordSalt: string;
};

type Session = {
  token: string;
  userId: string;
  expiresAt: Date;
};

type PasswordResetToken = {
  token: string;
  userId: string;
  expiresAt: Date;
};

const defaultPreferences: UserPreferences = {
  timezone: "Asia/Kuala_Lumpur",
  emailUpdates: true,
};

export class AuthService {
  private readonly sessionsByToken = new Map<string, Session>();
  private readonly resetTokensByToken = new Map<string, PasswordResetToken>();

  async signUp(input: SignUpRequest) {
    const email = normalizeEmail(input.email);

    if (await findDbUserByEmail(email)) {
      throw new AuthError("email_taken", "Email is already registered.", 409);
    }

    const passwordSalt = randomBytes(16).toString("hex");
    const passwordHash = hashPassword(input.password, passwordSalt);
    const user = await createUser({
      name: input.name,
      email,
      preferences: {
        ...defaultPreferences,
        ...input.preferences,
      },
      passwordHash,
      passwordSalt,
    });

    if (!user) {
      throw new AuthError(
        "database_unavailable",
        "Database connection is required.",
        503,
      );
    }

    return {
      user: toPublicUser(user),
      sessionToken: this.createSession(user.id),
    };
  }

  async signIn(emailInput: string, password: string) {
    const user = await this.findUserByEmail(emailInput);
    if (
      !user ||
      !verifyPassword(password, user.passwordSalt, user.passwordHash)
    ) {
      throw new AuthError(
        "invalid_credentials",
        "Invalid email or password.",
        401,
      );
    }

    return {
      user: toPublicUser(user),
      sessionToken: this.createSession(user.id),
    };
  }

  async signOut(token: string | undefined) {
    if (token) {
      this.sessionsByToken.delete(token);
    }
  }

  async getUserForSession(token: string | undefined) {
    if (!token) {
      return undefined;
    }

    const session = this.sessionsByToken.get(token);
    if (!session || session.expiresAt.getTime() < Date.now()) {
      this.sessionsByToken.delete(token);
      return undefined;
    }

    const user = await this.findUserById(session.userId);
    return user ? toPublicUser(user) : undefined;
  }

  async findPublicUserByEmail(emailInput: string) {
    const user = await this.findUserByEmail(emailInput);
    return user ? toPublicUser(user) : undefined;
  }

  async updateProfile(token: string | undefined, input: UpdateProfileRequest) {
    const session = token ? this.sessionsByToken.get(token) : undefined;
    if (!session || session.expiresAt.getTime() < Date.now()) {
      throw new AuthError("unauthorized", "Authentication is required.", 401);
    }

    const user = await this.findUserById(session.userId);
    if (!user) {
      throw new AuthError("unauthorized", "Authentication is required.", 401);
    }

    const nextUser = {
      ...user,
      ...(input.name ? { name: input.name } : {}),
      ...(input.preferences
        ? { preferences: { ...user.preferences, ...input.preferences } }
        : {}),
    };

    const dbUser = isDatabaseUserId(user.id)
      ? await updateUserProfile(user.id, {
          ...(input.name ? { name: input.name } : {}),
          ...(input.preferences ? { preferences: nextUser.preferences } : {}),
        })
      : undefined;

    if (dbUser) {
      return toPublicUser(dbUser);
    }

    throw new AuthError(
      "database_unavailable",
      "Database connection is required.",
      503,
    );
  }

  async requestPasswordReset(emailInput: string) {
    const user = await this.findUserByEmail(emailInput);
    if (!user) {
      return undefined;
    }

    const token = randomId("rst");
    this.resetTokensByToken.set(token, {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30),
    });

    return token;
  }

  async confirmPasswordReset(token: string, password: string) {
    const resetToken = this.resetTokensByToken.get(token);
    if (!resetToken || resetToken.expiresAt.getTime() < Date.now()) {
      throw new AuthError(
        "invalid_reset_token",
        "Password reset token is invalid or expired.",
        400,
      );
    }

    const user = await this.findUserById(resetToken.userId);
    if (!user) {
      throw new AuthError(
        "invalid_reset_token",
        "Password reset token is invalid or expired.",
        400,
      );
    }

    const passwordSalt = randomBytes(16).toString("hex");
    const passwordHash = hashPassword(password, passwordSalt);
    const dbUser = isDatabaseUserId(user.id)
      ? await updateUserPassword(user.id, {
          passwordHash,
          passwordSalt,
        })
      : undefined;
    if (!dbUser) {
      throw new AuthError(
        "database_unavailable",
        "Database connection is required.",
        503,
      );
    }
    this.resetTokensByToken.delete(token);

    for (const [sessionToken, session] of this.sessionsByToken.entries()) {
      if (session.userId === user.id) {
        this.sessionsByToken.delete(sessionToken);
      }
    }
  }

  private createSession(userId: string) {
    const token = randomId("ses");
    this.sessionsByToken.set(token, {
      token,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    return token;
  }

  private async findUserByEmail(emailInput: string) {
    return findDbUserByEmail(normalizeEmail(emailInput));
  }

  private async findUserById(userId: string) {
    if (!isDatabaseUserId(userId)) {
      return undefined;
    }

    return findDbUserById(userId);
  }
}

export class AuthError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
  }
}

export const authService = new AuthService();

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isDatabaseUserId(userId: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    userId,
  );
}

function randomId(prefix: string) {
  return `${prefix}_${randomBytes(24).toString("base64url")}`;
}

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex");
}

function verifyPassword(password: string, salt: string, hash: string) {
  const actual = Buffer.from(hashPassword(password, salt), "hex");
  const expected = Buffer.from(hash, "hex");

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    preferences: user.preferences,
  };
}
