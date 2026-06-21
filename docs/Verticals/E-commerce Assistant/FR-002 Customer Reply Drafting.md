---
type: functional-requirement
vertical: E-commerce Assistant
fr_id: ECOM-FR-002
status: draft
---
# ECOM-FR-002: Customer Reply Drafting

## Requirement

The system must draft replies to common customer messages.

## Scope

- Product questions
- Shipping questions
- Return/refund questions
- Order status questions
- Complaint escalation

## Acceptance Criteria

- Given a customer message is received, when the assistant drafts a reply, then the reply follows store policy and brand tone.
- Given the message is risky or unclear, when the assistant responds, then it marks the reply for human review.

## Out of Scope

- Fully autonomous sending
- Refund approval
