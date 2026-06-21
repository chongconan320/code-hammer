---
type: functional-requirement
vertical: Clinic Receptionist
fr_id: CLINIC-FR-004
status: draft
---
# CLINIC-FR-004: Human Handoff and Safety

## Requirement

The system must hand off sensitive, uncertain, or high-risk conversations to a human staff member.

## Scope

- Medical questions
- Emergency symptoms
- Angry or confused caller
- Low-confidence AI answer
- Policy exceptions

## Acceptance Criteria

- Given a patient asks for medical advice, when the system detects the risk, then it refuses to advise and routes to human staff.
- Given the AI is uncertain, when confidence is low, then it does not invent an answer.

## Out of Scope

- Medical triage
- Clinical decision-making
