---
type: functional-requirement
vertical: Core
fr_id: CORE-FR-006
status: draft
---
# CORE-FR-006: AI Runtime and Guardrails

## Requirement

The application must provide a reusable AI runtime for agents, prompts, tools, structured outputs, and safety guardrails.

## Scope

- Mastra agent setup
- Prompt contracts
- Tool calling
- Structured output validation
- Provider configuration
- Cost tracking
- Confidence handling
- Human review support

## Acceptance Criteria

- Given an AI workflow runs, when output is used by the system, then the output is validated before use.
- Given the AI is uncertain or missing data, when it responds, then it asks for clarification or routes to human review.
- Given tenant data is involved, when the AI retrieves context, then it only uses allowed tenant data.

## Out of Scope

- Complex multi-provider routing in the first version
- Autonomous high-risk decisions
