---
type: functional-requirement
vertical: E-commerce Assistant
fr_id: ECOM-FR-003
status: draft
---
# ECOM-FR-003: Human Approval Flow

## Requirement

The system must let a seller review, edit, approve, or reject AI-generated customer replies.

## Scope

- Draft only mode
- Edit draft
- Approve draft
- Reject draft
- Confidence warning

## Acceptance Criteria

- Given the assistant creates a draft, when the seller reviews it, then the seller can edit, approve, or reject it.
- Given confidence is low, when a draft is shown, then the UI clearly marks it for review.

## Out of Scope

- Auto-send for high-risk messages
- Team approval workflows
