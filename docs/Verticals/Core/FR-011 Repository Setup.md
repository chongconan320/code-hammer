---
type: functional-requirement
vertical: Core
fr_id: CORE-FR-011
status: done
---
# CORE-FR-011: Repository Setup

## Requirement

The application must have a maintainable monorepo repository foundation before product features are implemented.

## Scope

- Turborepo workspace
- Bun package management
- Root `package.json`
- `turbo.json`
- Workspace package structure
- Next.js web application shell
- Express API application shell
- Swagger/OpenAPI documentation foundation
- Shared TypeScript package
- Zod-validated configuration package
- Zod request validation foundation
- Drizzle + PostgreSQL database package boundary
- Milvus-ready vector database configuration
- Mastra-facing AI orchestration package boundary
- BullMQ + Redis queue package boundary
- Integrations package boundary
- Biome configuration
- TypeScript configuration
- Basic development scripts

## Acceptance Criteria

- Given the repository is cloned, when `bun install` is run, then dependencies install successfully.
- Given setup is complete, when the developer runs the dev command, then the web app and API app can start locally.
- Given setup is complete, when lint, format, and typecheck commands run, then they complete without configuration errors.
- Given the monorepo is created, when packages import shared code, then workspace imports resolve correctly.
- Given the repository is ready for feature work, when a new FR is implemented, then the implementation has a clear app or package location.
- Given a developer needs implementation guidance, when they read [[Monorepo Architecture and Tech Stack]], then the repository structure and package responsibilities are clear.

## Out of Scope

- Full authentication implementation
- Full database schema
- Production deployment automation
- Complete CI/CD pipeline
- Business vertical implementation
