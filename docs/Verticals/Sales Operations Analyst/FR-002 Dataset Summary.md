---
type: functional-requirement
vertical: Sales Operations Analyst
fr_id: SALES-FR-002
status: draft
---
# SALES-FR-002: Dataset Summary

## Requirement

The system must summarize uploaded business data before answering questions.

## Scope

- Column names
- Row count
- Date ranges
- Missing values
- Numeric fields
- Possible measures and dimensions

## Acceptance Criteria

- Given a dataset is uploaded, when summary generation completes, then the user can see what data the system understands.
- Given columns are ambiguous, when the summary is generated, then ambiguity is shown instead of hidden.

## Out of Scope

- Advanced data cleaning
- Business-specific accounting interpretation
