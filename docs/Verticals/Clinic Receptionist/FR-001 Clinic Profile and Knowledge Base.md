---
type: functional-requirement
vertical: Clinic Receptionist
fr_id: CLINIC-FR-001
status: draft
---
# CLINIC-FR-001: Clinic Profile and Knowledge Base

## Requirement

The system must allow a clinic to define the basic information the AI receptionist needs to answer common enquiries.

## Scope

- Clinic name
- Address
- Contact details
- Opening hours
- Services offered
- Policies and FAQs
- Pricing guidance if the clinic allows it
- Preparation instructions

## Acceptance Criteria

- Given a clinic owner enters clinic information, when the AI answers a basic enquiry, then it uses the clinic-approved information.
- Given information is missing, when a patient asks about it, then the AI says it does not have that information and offers human handoff.

## Out of Scope

- Medical advice
- Diagnosis
- Insurance claim processing
