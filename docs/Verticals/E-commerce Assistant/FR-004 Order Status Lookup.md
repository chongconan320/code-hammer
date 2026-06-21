---
type: functional-requirement
vertical: E-commerce Assistant
fr_id: ECOM-FR-004
status: draft
---
# ECOM-FR-004: Order Status Lookup

## Requirement

The system should look up order status from one marketplace or store integration.

## Scope

- One integration first
- Order lookup
- Shipment status
- Tracking information if available
- Integration failure handling

## Acceptance Criteria

- Given an order exists, when a customer asks for status, then the assistant drafts a reply using actual order data.
- Given no order is found, when the assistant responds, then it asks for missing information or escalates.

## Out of Scope

- Multi-marketplace sync
- Refund processing
- Dispute handling
