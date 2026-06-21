---
type: functional-requirement
vertical: Personal Productivity
fr_id: PERSONAL-FR-003
status: draft
---
# PERSONAL-FR-003: Chat With Document

## Requirement

The system must allow users to ask questions about uploaded documents.

## Scope

- Document question answering
- Source context
- Uncertainty handling
- Follow-up questions

## Acceptance Criteria

- Given a question can be answered from the document, when the assistant responds, then it includes source context.
- Given a question cannot be answered from the document, when the assistant responds, then it says the document does not contain enough information.

## Out of Scope

- Answers from private documents outside the selected context
- Unsupported claims
