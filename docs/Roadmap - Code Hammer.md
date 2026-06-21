---
type: roadmap
tags:
  - roadmap
  - sdd
  - ai-saas
  - modular-ai-desk-assistant
status: active
created: 2026-06-19
---
# Roadmap: Code Hammer

## Vision

Build Code Hammer, a modular AI desk assistant that helps SMEs and professionals automate daily desk work.

The product starts with one focused vertical, then expands through reusable modules for clinics, sales operations, e-commerce sellers, and personal productivity. The goal is one reusable AI core, not custom software for every customer.

## Product Direction

- **Core product**: one AI assistant platform with reusable modules
- **Initial verticals**: clinics, sales operations, e-commerce sellers
- **Reusable layer**: documents, email drafting, scheduling, analytics, messaging, workflow automation
- **Business model**: subscription SaaS
- **Constraint**: one-person company, no custom project work

## Modules

### Clinic Receptionist

- Voice/text receptionist
- Basic enquiries
- Appointment booking
- Human handoff
- One practice-management integration first

### Sales & Operations Analyst

- Spreadsheet and CRM connectors
- Plain-English business questions
- Charts and summaries
- Automated reports
- Basic anomaly detection and forecasting

### E-commerce Assistant

- Customer message replies
- Order status updates
- Basic marketing copy
- Sales dashboards
- One or two marketplace integrations first

### Personal Productivity

- Document summaries
- Email drafts
- Simple schedule support
- Reused from the core product, not a separate custom product

## Tech Stack

- Monorepo: Turborepo
- Runtime and package management: Bun
- Application: Next.js, Tailwind, TypeScript
- Backend: Express
- Database: PostgreSQL
- ORM: Drizzle
- AI orchestration: Mastra
- Validation and type safety: Zod
- Code quality: Biome
- Queue and asynchronous jobs: BullMQ
- Cache and job backend: Redis
- Vector database: Milvus
- Deployment: Docker, VPS, GitHub Actions
- Monitoring: Grafana, Prometheus, Sentry

## 24-Month Timeline

| Phase | Timing | Outcome |
|---|---:|---|
| Validate and scope | Months 0-1 | Interview clinics, sales teams, and e-commerce sellers; choose one starting vertical. |
| MVP core | Months 1-3 | Build authentication, chat, document understanding, and a speech API prototype. |
| First vertical module | Months 3-6 | Launch one focused module with one external integration and pilot users. |
| Analytics module | Months 6-9 | Add spreadsheet/CRM connectors, natural-language queries, reports, anomaly detection, and basic forecasting. |
| E-commerce module | Months 9-12 | Add marketplace integration, customer messaging, order updates, and sales dashboards. |
| Personal productivity | Months 12-16 | Package reusable document, email, and schedule features. |
| Scale and refine | Months 16-24 | Improve domain features, add integrations requested by paying users, and strengthen billing, onboarding, and support automation. |

## Milestones

### Month 1: Vertical Chosen

- Complete customer discovery across the serious candidate segments
- Compare clinics, sales operations, and e-commerce sellers
- Choose one starting vertical
- Define the first pilot workflow
- Identify at least 2 pilot candidates, or document the risk if none are available

### Month 3: MVP Core Ready

- Authentication
- Simple chat interface
- Core language functions
- Document upload and understanding
- PDF, Word, and Excel handling
- Speech API prototype for voice workflows
- Basic admin dashboard

### Month 6: First Vertical Pilot

- One live vertical module
- One external integration
- Pilot users onboarded
- Feedback loop active
- Clear decision on whether to continue, narrow, or pivot

### Month 9: Analytics Module

- Spreadsheet connector
- CRM connector
- Natural-language data questions
- Automated recurring reports
- Basic anomaly detection
- Basic forecasting

### Month 12: E-commerce Module

- One or two marketplace integrations
- Customer messaging automation
- Order update automation
- Basic marketing copy generation
- Sales dashboards

### Month 16: Personal Productivity Package

- Document summary features
- Email drafting
- Simple schedule support
- Optional freemium packaging if it helps adoption

### Month 24: Scale and Refine

- More integrations based on paying-user demand
- Stronger domain-specific features
- Subscription billing hardened
- Monitoring and support automation improved
- Sustainable solo-founder operating rhythm

## Validation Rules

- If 1 customer asks, note it.
- If 3 customers ask, consider it.
- If 10 customers ask, build it.

Before building deeply, validate:

- Pain level
- Budget
- Buying urgency
- Integration access
- Decision maker
- Existing software and admin costs

## Success Metrics

- Pilot users recruited
- Weekly active users
- Trial-to-paid conversion
- Monthly recurring revenue
- Churn
- Customer retention
- Useful automations completed per customer

## Founder Principles

- Focus on one vertical first.
- Build reusable modules only.
- Charge subscriptions.
- Avoid hourly work, one-time licenses, lifetime deals, and custom projects.
- Talk to customers every week.
- Ship something every week.
- Add features only when demand repeats across paying users.

## Current Execution

- Development board: [[Kanban]]
- Core platform FRs: [[Verticals/Core/FR-001 Authentication and User Profile]]
- Current priority: choose the first vertical through customer discovery.
