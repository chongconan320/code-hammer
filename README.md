# Code Hammer

Code Hammer is a modular AI desk assistant for SMEs and professionals.

This repository starts with `CORE-FR-011: Repository Setup`: a Bun/Turborepo monorepo foundation aligned with the Code Hammer SDD architecture.

## Workspace

```text
.
├── apps
│   ├── web                 # Next.js SaaS application
│   └── api                 # Express backend API
├── packages
│   ├── ai                  # Mastra-facing AI orchestration contracts
│   ├── config              # Zod-validated runtime configuration
│   ├── db                  # Drizzle + PostgreSQL schema boundary
│   ├── integrations        # External connector contracts
│   ├── queue               # BullMQ + Redis job contracts
│   └── shared              # Shared TypeScript types and helpers
├── verticals
│   ├── clinic
│   ├── ecommerce
│   ├── personal-productivity
│   └── sales-ops
└── scripts
```

## Tech Stack

- Turborepo for monorepo task orchestration
- Bun for runtime, package management, and test execution
- Next.js, React, TypeScript, Tailwind CSS, and shadcn-style components for the web app
- CSS-variable theme tokens in the global stylesheet for centralized color and shadow control
- First-class i18n dictionaries for English, Simplified Chinese, and Bahasa Melayu
- Express for the HTTP API and middleware layer
- Drizzle ORM and PostgreSQL for application data
- Milvus for vector search and knowledge retrieval
- Mastra as the AI orchestration layer
- Zod for runtime validation and shared contracts
- Biome for linting and formatting
- BullMQ and Redis for asynchronous jobs

## API Rules

- Every Express endpoint must be represented in the OpenAPI document.
- Every endpoint with request input must validate that input with Zod before handler logic runs.
- Swagger UI is available at `/docs` during local API development.
- Raw OpenAPI JSON is available at `/openapi.json`.

## Current Core Features

- `CORE-FR-001`: Authentication and user profile foundation
- `CORE-FR-002`: Organization, tenant, and workspace foundation
- `CORE-FR-011`: Repository setup

## Commands

```bash
bun install
bun dev
bun build
bun lint
bun format
bun typecheck
bun test
```

Product behavior should be implemented one FR at a time, with each vertical depending on reusable core modules instead of one-off custom work.
