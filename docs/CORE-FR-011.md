# CORE-FR-011: Repository Setup Evidence

This scaffold implements the repository foundation required by `CORE-FR-011`.

## Included

- Turborepo workspace files
- Bun workspace configuration
- Root scripts
- Next.js web app shell
- Express API app shell
- Shared TypeScript package
- Zod-validated config package
- Drizzle + PostgreSQL database package boundary
- Mastra-facing AI package boundary
- BullMQ + Redis queue package boundary
- Integrations package boundary
- Biome configuration
- TypeScript base configuration
- Vertical module directories

## Verification

Run these commands from the repository root:

```bash
bun install
bun dev
bun build
bun lint
bun format
bun typecheck
bun test
```
