export * from "./auth";
export * from "./tenant";

export const databasePackage = {
  orm: "Drizzle",
  database: "PostgreSQL",
  tables: [
    "organizations",
    "workspaces",
    "memberships",
    "users",
    "userSessions",
    "passwordResetTokens",
  ],
} as const;
