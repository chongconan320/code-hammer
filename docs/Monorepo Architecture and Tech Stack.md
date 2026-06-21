---
type: architecture
tags:
  - sdd
  - architecture
  - monorepo
  - tech-stack
status: draft
created: 2026-06-19
---
# Monorepo Architecture and Tech Stack

## Purpose

This document defines the technical foundation for Code Hammer.

The architecture should support multiple verticals while keeping the codebase small enough for a solo founder to maintain.

## Principles

- One monorepo.
- One reusable AI core.
- Vertical features are modules, not separate products.
- Shared contracts live in packages.
- Feature code is separated by file inside every package.
- Background work runs through queues.
- Every external integration has a clear boundary.
- Avoid custom customer-specific code paths.

## Tech Stack

| Layer                   | Choice                      | Purpose                                         |
| ----------------------- | --------------------------- | ----------------------------------------------- |
| Monorepo                | Turborepo                   | Manage apps, packages, builds, and shared tasks |
| Runtime/package manager | Bun                         | Fast installs, scripts, and local development   |
| Web app                 | Next.js                     | Main SaaS application                           |
| Styling                 | Tailwind CSS + CSS variables | Utility-first UI styling with centralized theme tokens |
| UI components           | shadcn-style components     | Reusable accessible component primitives        |
| Internationalization    | First-class i18n dictionaries | English, Simplified Chinese, and Bahasa Melayu UI copy |
| Language                | TypeScript                  | End-to-end type safety                          |
| Backend                 | Express                     | Lightweight HTTP API and middleware layer       |
| Database                | PostgreSQL                  | Primary relational data store                   |
| ORM                     | Drizzle                     | Typed schema and migrations                     |
| AI orchestration        | Mastra                      | Agents, workflows, and AI tool orchestration    |
| Validation              | Zod                         | Runtime validation and shared contracts         |
| Code quality            | Biome                       | Formatting and linting                          |
| Jobs                    | BullMQ                      | Async jobs and workers                          |
| Cache/job backend       | Redis                       | Queue backend and cache                         |
| Vector database         | Milvus                      | Embeddings and semantic retrieval               |
| Deployment              | Docker, VPS, GitHub Actions | Build, release, and deploy                      |
| Monitoring              | Grafana, Prometheus, Sentry | Metrics, dashboards, errors                     |

## Proposed Repository Layout

```text
.
├── apps
│   ├── web
│   └── api
├── packages
│   ├── ai
│   ├── db
│   ├── queue
│   ├── shared
│   ├── integrations
│   └── config
├── verticals
│   ├── clinic
│   ├── sales-ops
│   ├── ecommerce
│   └── personal-productivity
├── docs
├── turbo.json
├── package.json
└── bun.lock
```

## Apps

### `apps/web`

The user-facing SaaS application.

Responsibilities:

- Tailwind CSS styling
- shadcn-style reusable UI components
- Authentication screens
- Workspace UI
- Document upload UI
- Chat UI
- Vertical module screens
- Billing and account settings
- Admin or owner dashboard

Frontend UI standard:

- All application UI should be built with Tailwind CSS.
- Shared interface elements should use shadcn-style components before creating custom one-off components.
- Prefer each feature to have its own route and page. Do not keep adding unrelated post-login features into the login/auth page.
- Authentication pages should only handle authentication flows such as sign in, sign up, sign out, password reset, and session recovery.
- After authentication, route users into feature pages such as workspace setup, tenant settings, member management, profile, documents, chat, integrations, billing, and vertical module pages.
- Tenant and member management should live on dedicated workspace or organization settings pages, not inside the login page after a user is authenticated.
- Theme colors must be defined as semantic CSS variables in the global stylesheet before being exposed through Tailwind.
- Avoid hardcoded color values in page components. Page UI should use semantic tokens such as `background`, `card`, `foreground`, `primary`, `muted`, `border`, and `sidebar`.
- i18n is a first-class frontend requirement. User-facing copy should be served through locale dictionaries for English, Simplified Chinese, and Bahasa Melayu.
- New screens should not hardcode visible strings directly in components unless the string is temporary debug-only text.
- Portal screens should look like production SaaS workspace screens, not technical demos or feature-spec mockups.
- Visible UI copy should use product language only. Do not expose FR, FS, roadmap, monorepo, scaffold, or implementation wording to end users.
- All SVG icons should use Iconify (`@iconify/react`). Avoid inline SVG markup in components. Prefer the `lucide` icon set when the icon is available there.
- Workspace content panels should be near-full-width on standard laptop screens (≈1440px viewport). Tables and data-rich layouts should fill their container with minimal side gutters. Form pages may use a slightly narrower cap for readability but should still be wider than `max-w-xl`. On screens wider than a laptop, content should be centered with a reasonable max-width to keep it readable.
- User-facing feedback from click events and form submissions (errors, success confirmations, status updates) should be shown as toast notifications in the top-right corner. Do not render inline success/error messages inside page content. Prefer `useToast()` from the shared toast component.

Should not contain:

- Direct database access
- Long-running AI processing
- Integration secrets
- Background job workers

### `apps/api`

The backend API and application service layer.

Responsibilities:

- Express routes and middleware
- Swagger/OpenAPI documentation for every endpoint
- Zod validation before endpoint handler logic
- Auth/session validation
- Tenant and role enforcement
- API endpoints
- Queue job creation
- Integration webhooks
- Calls into `packages/ai`, `packages/db`, and `packages/queue`

Should not contain:

- UI components
- Vertical-specific logic that can live in reusable packages
- Direct unvalidated AI output usage

## Packages

Package code organization standard:

- Each feature should live in its own file or feature folder inside the relevant package.
- Package `index.ts` files should be public barrels only. They should re-export feature files and contain only small package metadata when needed.
- Do not keep adding contracts, validators, queue jobs, or helpers for multiple features into one growing `index.ts`.
- This applies across `packages/db`, `packages/shared`, `packages/queue`, `packages/ai`, `packages/integrations`, and `packages/config`.
- Prefer names that match the feature or domain, such as `auth.ts`, `tenant.ts`, `documents.ts`, `workflow-runs.ts`, or a same-named folder when the feature needs multiple files.

### `packages/shared`

Shared contracts and utilities.

Contains:

- Zod contracts and request validators
- Shared TypeScript types
- API DTOs
- Error codes
- Constants

Organization rule:

- Split shared contracts by feature file.
- Use `Contract` for shared entity shapes and `RequestSchema` / `ResponseSchema` for API validation.
- Do not define database tables or Drizzle schema in `packages/shared`.
- Keep `src/index.ts` as a barrel export.

### `packages/db`

Database schema and persistence.

Contains:

- Drizzle schema
- Migrations
- Database client
- Repository helpers
- Seed scripts if needed

Organization rule:

- All database table schemas must live under `packages/db`.
- Database schema means Drizzle table definitions, relations, indexes, migrations, and persistence-only database types.
- Split Drizzle tables by feature file, for example `src/auth.ts`, `src/tenant.ts`, and `src/documents.ts`.
- Keep `src/index.ts` as a barrel export. Do not define tables directly in `src/index.ts`.

### `packages/ai`

AI orchestration layer.

Contains:

- Mastra agents
- AI workflows
- Prompt contracts
- Structured output schemas
- Retrieval helpers
- Model/provider configuration

### `packages/queue`

Async job definitions and workers.

Contains:

- BullMQ queue setup
- Job schemas
- Worker registration
- Retry conventions
- Dead-letter handling

Organization rule:

- Split queue names, job payload schemas, and workers by feature file.
- Keep `src/index.ts` as a barrel export.

### `packages/integrations`

External system connectors.

Contains:

- Practice-management connectors
- Spreadsheet connectors
- CRM connectors
- Marketplace connectors
- Messaging/email connectors

### `packages/config`

Shared configuration loading.

Contains:

- Environment schemas
- App config
- API config
- Worker config

## Vertical Modules

Vertical modules should reuse the same core packages.

```text
verticals/
├── clinic
├── sales-ops
├── ecommerce
└── personal-productivity
```

Each vertical can define:

- Feature flags
- Domain workflows
- Vertical-specific prompts
- Vertical-specific integrations
- Vertical-specific UI routes

Vertical modules should not fork the platform into separate products.

## Core Data Model

Initial shared entities:

- Organization
- User
- Membership
- Role
- Workspace
- Document
- Conversation
- Message
- IntegrationConnection
- Workflow
- WorkflowRun
- JobRun
- AuditLog

Vertical-specific entities should be added only when needed by a validated workflow.

## Queue Strategy

Use BullMQ for work that should not block the API request.

Initial queues:

- `document-processing`
- `ai-workflow`
- `integration-sync`
- `notification`
- `report-generation`

Rules:

- Every job payload must have a Zod schema.
- Every job must include `tenantId` when tenant data is involved.
- Retries must be explicit.
- Failed jobs must be inspectable.
- Long-running AI work should run in a worker, not inside a request handler.

## AI Strategy

Mastra owns AI workflows and agent orchestration.

Rules:

- Prompts must have named contracts.
- AI outputs used by the system must be structured and validated.
- Risky actions require confidence handling or human review.
- Agents must not cross tenant data boundaries.
- Vertical-specific agents should reuse shared tools where possible.

## Integration Strategy

Each external integration should have:

- Connection model
- Auth/token storage plan
- Sync strategy
- Webhook strategy if available
- Rate-limit handling
- Error and retry behavior
- Data ownership boundaries

Start with one integration per vertical.

## Local Development

Expected commands:

```bash
bun install
bun dev
bun lint
bun format
bun typecheck
bun test
```

Exact scripts should be finalized when the repo is scaffolded.

## Deployment Shape

Initial VPS deployment:

- Web container
- API container
- Worker container
- PostgreSQL
- Redis
- Milvus
- Reverse proxy
- Monitoring/error tracking

GitHub Actions should handle:

- Install
- Lint
- Typecheck
- Test
- Build
- Deploy

## Open Decisions

| ID | Decision | Options | Status |
|---|---|---|---|
| D-001 | Auth provider | Custom auth, Better Auth, Auth.js, Clerk | Open |
| D-002 | Billing provider | Stripe, Billplz, other local provider | Open |
| D-003 | First AI providers | OpenAI, Gemini, Claude, open-source models | Open |
| D-004 | First vertical integration | Clinic PMS, Google Sheets, CRM, marketplace | Open |
| D-005 | Deployment target | Single VPS first, managed services later | Open |

## Links

- [[SDD on clinic-agent/README]]
- [[Roadmap - Code Hammer]]
- [[Kanban]]
