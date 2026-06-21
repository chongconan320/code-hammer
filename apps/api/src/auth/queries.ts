import { users } from "@code-hammer/db";
import { eq } from "drizzle-orm";
import { db } from "../db";
import type { UserPreferences } from "@code-hammer/shared";

const userSelection = {
  id: users.id,
  name: users.name,
  email: users.email,
  preferences: users.preferences,
  passwordHash: users.passwordHash,
  passwordSalt: users.passwordSalt,
};

export async function createUser(input: {
  email: string;
  name: string;
  passwordHash: string;
  passwordSalt: string;
  preferences: UserPreferences;
}) {
  if (!db) {
    return undefined;
  }

  const [user] = await db.insert(users).values(input).returning(userSelection);

  return user;
}

export async function findUserByEmail(email: string) {
  if (!db) {
    return undefined;
  }

  const [user] = await db
    .select(userSelection)
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user;
}

export async function findUserById(id: string) {
  if (!db) {
    return undefined;
  }

  const [user] = await db
    .select(userSelection)
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user;
}

export async function updateUserProfile(
  id: string,
  patch: {
    name?: string;
    preferences?: UserPreferences;
  },
) {
  if (!db) {
    return undefined;
  }

  const [user] = await db
    .update(users)
    .set(patch)
    .where(eq(users.id, id))
    .returning(userSelection);

  return user;
}

export async function updateUserPassword(
  id: string,
  password: {
    passwordHash: string;
    passwordSalt: string;
  },
) {
  if (!db) {
    return undefined;
  }

  const [user] = await db
    .update(users)
    .set(password)
    .where(eq(users.id, id))
    .returning(userSelection);

  return user;
}
