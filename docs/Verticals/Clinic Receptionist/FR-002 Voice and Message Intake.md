---
type: functional-requirement
vertical: Clinic Receptionist
fr_id: CLINIC-FR-002
status: draft
---
# CLINIC-FR-002: Voice and Message Intake

## Requirement

The system must accept patient enquiries through voice or text and classify the caller/message intent.

## Scope

- Speech-to-text for calls
- Text message intake
- Intent detection
- Basic enquiry handling
- Appointment request detection
- Escalation detection

## Acceptance Criteria

- Given a patient calls or sends a message, when the input is processed, then the system identifies whether it is a basic enquiry, appointment request, appointment change, or human handoff case.
- Given speech recognition confidence is low, when the system cannot understand the caller, then it asks for clarification or hands off.

## Out of Scope

- Fully autonomous emergency handling
- Multi-language support in the first version
