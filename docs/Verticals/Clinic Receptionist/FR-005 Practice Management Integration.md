---
type: functional-requirement
vertical: Clinic Receptionist
fr_id: CLINIC-FR-005
status: draft
---
# CLINIC-FR-005: Practice Management Integration

## Requirement

The system should integrate with one practice-management system to read availability and create or update appointments.

## Scope

- One practice-management system only
- Read available slots
- Create appointment
- Update appointment
- Handle integration failure

## Acceptance Criteria

- Given the integration is connected, when a patient books an appointment, then the appointment is created in the practice-management system.
- Given the integration fails, when booking is attempted, then the system records the failure and notifies staff.

## Out of Scope

- Multiple practice-management systems
- Insurance forms
- Payment collection
