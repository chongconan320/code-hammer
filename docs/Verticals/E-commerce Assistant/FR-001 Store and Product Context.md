---
type: functional-requirement
vertical: E-commerce Assistant
fr_id: ECOM-FR-001
status: draft
---
# ECOM-FR-001: Store and Product Context

## Requirement

The system must store approved store and product information for customer replies.

## Scope

- Store name
- Brand tone
- Shipping policy
- Return/refund policy
- FAQ
- Product names
- Product descriptions
- Variants and pricing

## Acceptance Criteria

- Given store information exists, when the AI drafts a customer reply, then it uses approved store context.
- Given product information is missing, when asked about it, then the AI does not invent details.

## Out of Scope

- Inventory management
- Multi-store management
