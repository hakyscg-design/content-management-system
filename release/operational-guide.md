# FTV v2 MVP Operational Guide

## Prerequisites

- Node.js 24 LTS line.
- pnpm 11.

## Install

```text
pnpm install
```

## Validate

```text
pnpm validate
```

For targeted checks:

```text
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:contract
pnpm test:integration
pnpm test
```

## Manual Operation Paths

| Area           | Manual Path                                                                              |
| -------------- | ---------------------------------------------------------------------------------------- |
| Asset          | Manual source capture, approval, asset registration, rights update, duplicate review     |
| Media          | Manual processing job creation, start, completion, failure visibility, retry by operator |
| Content        | Manual brief, package, and version creation                                              |
| Review         | Manual review request, assignment, decision, rejection, approval, override reason        |
| Publishing     | Manual checklist completion and manual publishing reference recording                    |
| Performance    | Manual metric definition, import staging, fact recording, import completion              |
| Analytics      | Manual report and learning summary creation                                              |
| Workflow       | Manual workflow run start, step completion, failure, and completion                      |
| Governance     | Manual role/relation setup, rule evaluation, audit event recording                       |
| Administration | Manual non-authoritative inspection and display metadata configuration                   |

## Fallback Procedures

- Use owner-service records as the source of truth.
- Keep manual actor and reason context for critical actions.
- When automation or integration fails, return to direct owner-service/manual operations.
- Record failures visibly through job, workflow, import, or audit records.
- Do not bypass review, approval, rights, governance, or audit boundaries.

## Production Boundary

This release candidate is not a production deployment package. Deployment, scaling, cloud infrastructure, external connectors, and production launch decisions require a separate approved execution phase.
