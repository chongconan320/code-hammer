---
type: functional-requirement
vertical: Clinic Receptionist
fr_id: CLINIC-FR-003
status: draft
---
# CLINIC-FR-003: Appointment Request Workflow

## Requirement

The system must collect appointment request details and either confirm the appointment or send it for staff review.

## Scope

- Service selection
- Preferred date/time
- Patient name
- Patient contact
- Appointment confirmation
- Staff notification

## Acceptance Criteria

- Given a patient asks to book, when required details are collected, then the system creates a booking request.
- Given calendar integration is unavailable, when a patient requests a booking, then the system records the request and notifies staff for manual confirmation.

## Out of Scope

- Multi-location scheduling
- Insurance eligibility checks
