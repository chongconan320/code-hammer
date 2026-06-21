---
type: functional-requirement
vertical: Core
fr_id: CORE-FR-003
status: draft
---
# CORE-FR-003: Billing Plans and Usage Limits

## Requirement

The application must support subscription plans and usage limits for SaaS monetization.

## Scope

- Free or trial plan
- Starter plan
- Professional plan
- Business plan
- Document limits
- AI message limits
- Storage limits
- Workflow/job limits
- Billing status

## Acceptance Criteria

- Given a user is on a plan, when usage is checked, then the system enforces the plan limits.
- Given billing status is inactive or past due, when the user accesses paid features, then access is restricted according to policy.

## Out of Scope

- Enterprise procurement workflows
- Complex usage-based billing in the first version
