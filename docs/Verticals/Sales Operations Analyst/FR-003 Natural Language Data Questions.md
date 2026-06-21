---
type: functional-requirement
vertical: Sales Operations Analyst
fr_id: SALES-FR-003
status: draft
---
# SALES-FR-003: Natural Language Data Questions

## Requirement

The system must allow users to ask questions about business data in plain English.

## Scope

- Revenue questions
- Sales pipeline questions
- Customer questions
- Product or service performance questions
- Follow-up questions

## Acceptance Criteria

- Given a user asks a question answerable from the dataset, when the system responds, then it returns an answer with the fields used.
- Given the question cannot be answered from the data, when the system responds, then it explains what data is missing.

## Out of Scope

- Unverified predictions
- Financial advice
