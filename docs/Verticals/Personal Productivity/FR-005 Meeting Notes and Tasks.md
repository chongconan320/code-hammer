---
type: functional-requirement
vertical: Personal Productivity
fr_id: PERSONAL-FR-005
status: draft
---
# PERSONAL-FR-005: Meeting Notes and Tasks

## Requirement

The system must turn pasted meeting notes or transcripts into decisions, action items, and follow-up drafts.

## Scope

- Meeting summary
- Decisions
- Action items
- Owners
- Due dates if stated
- Follow-up email draft

## Acceptance Criteria

- Given meeting notes are provided, when the assistant processes them, then it extracts decisions and action items.
- Given owners or due dates are not stated, when output is generated, then the assistant marks them as missing instead of inventing them.

## Out of Scope

- Calendar automation
- Real-time meeting transcription
