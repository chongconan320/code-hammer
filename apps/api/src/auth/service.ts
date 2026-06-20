import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type {
  PublicUser,
  SignUpRequest,
  UpdateProfileRequest,
  UserPreferences,
} from "@code-hammer/shared";

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
  private readonly usersById = new Map<string, StoredUser>();
  private readonly userIdsByEmail = new Map<string, string>();
  private readonly sessionsByToken = new Map<string, Session>();
  private readonly resetTokensByToken = new Map<string, PasswordResetToken>();

  async signUp(input: SignUpRequest) {
    const email = normalizeEmail(input.email);

    if (this.userIdsByEmail.has(email)) {
      throw new AuthError("email_taken", "Email is already registered.", 409);
    }

    const userId = randomId("usr");
    const passwordSalt = randomBytes(16).toString("hex");
    const passwordHash = hashPassword(input.password, passwordSalt);
    const user: StoredUser = {
      id: userId,
      name: input.name,
      email,
      preferences: {
        ...defaultPreferences,
        ...input.preferences,
      },
      passwordHash,
      passwordSalt,
    };

    this.usersById.set(userId, user);
    this.userIdsByEmail.set(email, userId);

    return {
      user: toPublicUser(user),
      sessionToken: this.createSession(userId),
    };
  }

  async signIn(emailInput: string, password: string) {
    const user = this.findUserByEmail(emailInput);
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

    const user = this.usersById.get(session.userId);
    return user ? toPublicUser(user) : undefined;
  }

  async updateProfile(token: string | undefined, input: UpdateProfileRequest) {
    const session = token ? this.sessionsByToken.get(token) : undefined;
    if (!session || session.expiresAt.getTime() < Date.now()) {
      throw new AuthError("unauthorized", "Authentication is required.", 401);
    }

    const user = this.usersById.get(session.userId);
    if (!user) {
      throw new AuthError("unauthorized", "Authentication is required.", 401);
    }

    if (input.name) {
      user.name = input.name;
    }

    if (input.preferences) {
      user.preferences = {
        ...user.preferences,
        ...input.preferences,
      };
    }

    this.usersById.set(user.id, user);
    return toPublicUser(user);
  }

  async requestPasswordReset(emailInput: string) {
    const user = this.findUserByEmail(emailInput);
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

    const user = this.usersById.get(resetToken.userId);
    if (!user) {
      throw new AuthError(
        "invalid_reset_token",
        "Password reset token is invalid or expired.",
        400,
      );
    }

    user.passwordSalt = randomBytes(16).toString("hex");
    user.passwordHash = hashPassword(password, user.passwordSalt);
    this.usersById.set(user.id, user);
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

  private findUserByEmail(emailInput: string) {
    const userId = this.userIdsByEmail.get(normalizeEmail(emailInput));
    return userId ? this.usersById.get(userId) : undefined;
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
