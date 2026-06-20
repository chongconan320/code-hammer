# CORE-FR-001: Authentication and User Profile Evidence

This implementation adds the first authentication and profile foundation.

## Included

- Sign up endpoint with Zod validation
- Sign in endpoint with Zod validation
- Sign out endpoint with session invalidation
- Password reset request and confirm endpoints
- HttpOnly session cookie handling
- Password hashing with per-user salt
- Authenticated profile read and update endpoints
- OpenAPI documentation for auth and profile endpoints
- Tailwind and shadcn-style web authentication/profile UI
- Drizzle schema boundary for users, sessions, and password reset tokens
- API tests for signup, signin, signout, profile update, password reset, and validation errors

## Notes

- The current API uses an in-memory auth service for local development.
- The persistence target is defined in `packages/db`; database-backed auth can replace the in-memory service when the database integration FR is implemented.
