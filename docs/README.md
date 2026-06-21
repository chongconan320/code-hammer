# Code Hammer

Specification workspace for a one-person AI SaaS.

Code Hammer is a modular AI desk assistant for SMEs and professionals. The system is organized by verticals, and every vertical contains functional requirements, or FRs. `Core` is treated as a vertical because it contains the basic application FRs required by every other vertical.

## Product Direction

- **Core**: basic platform requirements shared by the whole application.
- **Business verticals**: focused product areas built on top of Core.
- **Business model**: subscription SaaS.
- **Constraint**: solo-founder maintainability.
- **Rule**: do not build custom one-off customer software.

## Folder Structure

```text
SDD on clinic-agent/
├── Verticals/
│   ├── Core/
│   │   ├── FR-001 Authentication and User Profile.md
│   │   ├── FR-002 Organization Tenant and Workspace.md
│   │   ├── FR-011 Repository Setup.md
│   │   └── ...
│   ├── Clinic Receptionist/
│   │   ├── FR-001 Clinic Profile and Knowledge Base.md
│   │   ├── FR-002 Voice and Message Intake.md
│   │   └── ...
│   ├── E-commerce Assistant/
│   │   ├── FR-001 Store and Product Context.md
│   │   ├── FR-002 Customer Reply Drafting.md
│   │   └── ...
│   ├── Personal Productivity/
│   │   ├── FR-001 Document Upload.md
│   │   ├── FR-002 Document Summary.md
│   │   └── ...
│   └── Sales Operations Analyst/
│       ├── FR-001 Spreadsheet Data Ingestion.md
│       ├── FR-002 Dataset Summary.md
│       └── ...
├── Kanban.md
├── Monorepo Architecture and Tech Stack.md
├── Roadmap - Code Hammer.md
└── README.md
```

## FR Structure

Each `.md` file inside `Verticals/` is a functional requirement.

An FR should describe one required capability:

- Requirement
- Scope
- Acceptance criteria
- Out of scope

FR files are product requirement documents. They should not automatically become engineering tasks. An FR moves into development only after it is validated, scoped, and aligned with the core architecture.

## Verticals

| Vertical | Meaning |
|---|---|
| `Core` | Basic/core FRs required by the whole application, regardless of business vertical |
| `Clinic Receptionist` | Voice/text receptionist for clinics and dental practices |
| `Sales Operations Analyst` | Spreadsheet, CRM, reporting, and business insights assistant |
| `E-commerce Assistant` | Customer messages, order updates, marketing copy, and seller dashboards |
| `Personal Productivity` | Reusable document, email, and meeting-note features for individuals |

## Core FRs

`Verticals/Core` defines the basic platform requirements.

Examples:

- [CORE-FR-001: Authentication and User Profile](</Users/conanchong/Documents/Obsidian Vault/SDD on clinic-agent/Verticals/Core/FR-001 Authentication and User Profile.md>)
- [CORE-FR-002: Organization, Tenant, and Workspace](</Users/conanchong/Documents/Obsidian Vault/SDD on clinic-agent/Verticals/Core/FR-002 Organization Tenant and Workspace.md>)
- [CORE-FR-004: Document Upload, Processing, and Search](</Users/conanchong/Documents/Obsidian Vault/SDD on clinic-agent/Verticals/Core/FR-004 Document Upload Processing and Search.md>)
- [CORE-FR-006: AI Runtime and Guardrails](</Users/conanchong/Documents/Obsidian Vault/SDD on clinic-agent/Verticals/Core/FR-006 AI Runtime and Guardrails.md>)
- [CORE-FR-008: Queue and Background Jobs](</Users/conanchong/Documents/Obsidian Vault/SDD on clinic-agent/Verticals/Core/FR-008 Queue and Background Jobs.md>)
- [CORE-FR-011: Repository Setup](</Users/conanchong/Documents/Obsidian Vault/SDD on clinic-agent/Verticals/Core/FR-011 Repository Setup.md>)

Core should be built first because every other vertical depends on it.

## Business Vertical FRs

Examples:

- [CLINIC-FR-001: Clinic Profile and Knowledge Base](</Users/conanchong/Documents/Obsidian Vault/SDD on clinic-agent/Verticals/Clinic Receptionist/FR-001 Clinic Profile and Knowledge Base.md>)
- [SALES-FR-001: Spreadsheet Data Ingestion](</Users/conanchong/Documents/Obsidian Vault/SDD on clinic-agent/Verticals/Sales Operations Analyst/FR-001 Spreadsheet Data Ingestion.md>)
- [ECOM-FR-001: Store and Product Context](</Users/conanchong/Documents/Obsidian Vault/SDD on clinic-agent/Verticals/E-commerce Assistant/FR-001 Store and Product Context.md>)
- [PERSONAL-FR-001: Document Upload](</Users/conanchong/Documents/Obsidian Vault/SDD on clinic-agent/Verticals/Personal Productivity/FR-001 Document Upload.md>)

## Engineering Board

[Kanban.md](</Users/conanchong/Documents/Obsidian Vault/SDD on clinic-agent/Kanban.md>) is for programmer-related execution only.

It should track:

- Monorepo setup
- Next.js app scaffold
- Express API scaffold
- Shared packages
- Drizzle/PostgreSQL setup
- Mastra AI package
- BullMQ/Redis worker package
- Type safety
- Biome checks
- Tests
- Engineering releases

It should not track:

- Business discovery
- Roadmap planning
- Customer interviews
- Founder principles
- High-level product strategy

## Architecture

[Monorepo Architecture and Tech Stack.md](</Users/conanchong/Documents/Obsidian Vault/SDD on clinic-agent/Monorepo Architecture and Tech Stack.md>) defines the technical foundation.

Current stack:

- Turborepo
- Bun
- Next.js
- Tailwind
- TypeScript
- Express
- PostgreSQL
- Drizzle
- Mastra
- Zod
- Biome
- BullMQ
- Redis
- Milvus
- Docker
- VPS
- GitHub Actions
- Grafana
- Prometheus
- Sentry

## Roadmap

[Roadmap - Code Hammer.md](</Users/conanchong/Documents/Obsidian Vault/SDD on clinic-agent/Roadmap - Code Hammer.md>) holds the product roadmap and milestones.

The rough sequence:

1. Build the Core FRs needed for the first product slice.
2. Choose one business vertical to validate first.
3. Build the smallest useful vertical module on top of Core.
4. Add more FRs only when demand repeats.
5. Keep the product reusable and subscription-based.

## Operating Rule

Use this flow:

1. Identify the relevant vertical.
2. Create or update the FR.
3. Validate the pain and usefulness.
4. Confirm the FR can reuse Core.
5. Move only validated engineering work into Kanban.

## Current Priority

Build the smallest useful Core foundation, then choose one business vertical to validate first.
