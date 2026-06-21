---
type: functional-requirement
vertical: Sales Operations Analyst
fr_id: SALES-FR-005
status: draft
---
# SALES-FR-005: Scheduled Report Job

## Requirement

The system should generate recurring reports using background jobs.

## Scope

- BullMQ scheduled job
- Redis-backed queue
- Retry handling
- Notification on completion
- Failure logging

## Acceptance Criteria

- Given a report schedule exists, when the scheduled time arrives, then the report job runs in the background.
- Given report generation fails, when the job ends, then the user can see the failure state.

## Out of Scope

- Complex workflow builder
- Multi-channel notifications in the first version
