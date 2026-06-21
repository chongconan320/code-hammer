---
type: functional-requirement
vertical: Core
fr_id: CORE-FR-005
status: draft
---
# CORE-FR-005: Chat With Documents

## Requirement

The application must allow users to ask questions about uploaded documents and receive answers with source context.

## Scope

- Conversation list
- Messages
- Document-grounded answers
- Source references
- Uncertainty handling
- Unsupported-claim prevention

## Acceptance Criteria

- Given a document contains the answer, when a user asks a question, then the assistant answers with source context.
- Given the answer is not present, when the user asks a question, then the assistant says the document does not contain enough information.

## Out of Scope

- Cross-tenant document search
- Unsupported answers from outside selected context
