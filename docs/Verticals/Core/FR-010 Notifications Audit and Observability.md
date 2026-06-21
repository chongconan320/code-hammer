---
type: functional-requirement
vertical: Core
fr_id: CORE-FR-010
status: draft
---
# CORE-FR-010: Notifications, Audit, and Observability

## Requirement

The application must notify users about important system events, audit sensitive actions, and expose basic operational health.

## Scope

- Email notifications
- In-app notifications
- Human review needed
- Job completed
- Job failed
- Audit logs
- Error tracking with Sentry
- Metrics
- Health checks

## Acceptance Criteria

- Given a workflow needs human review, when it pauses, then the user receives a notification.
- Given a sensitive action occurs, when it completes, then an audit log entry is recorded.
- Given the API, worker, database, Redis, or Milvus is unhealthy, when health checks run, then the issue is detectable.

## Out of Scope

- Full admin observability suite
- Complex alert-routing policies
