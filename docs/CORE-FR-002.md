# CORE-FR-002: Organization, Tenant, and Workspace Evidence

This implementation adds organization-level workspaces with tenant isolation.

## Included

- Authenticated organization creation endpoint
- Owner membership assignment on organization creation
- Workspace read endpoint with tenant boundary checks
- Workspace settings update endpoint scoped to the owning tenant
- Organization listing for the authenticated user
- OpenAPI documentation for tenant endpoints
- Zod validation for organization and workspace settings payloads
- Drizzle schema boundary for organizations, workspaces, and memberships
- Portal workspace card for creating a workspace and updating settings
- API tests for owner creation, cross-tenant denial, and scoped settings updates

## Notes

- The current API uses an in-memory tenant service for local development.
- Database-backed tenant persistence can replace the service when the database integration FR is implemented.
