export * from "./auth";
export * from "./billing";
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
    "plans",
    "subscriptions",
    "usageRecords",
  ],
} as const;
