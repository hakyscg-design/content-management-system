# CMS v1.0 Operational Guide

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

| Area           | Manual Path                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| Project        | Select active CMS project from the operator console                                                             |
| Asset          | Manual source capture and ready asset registration through Source & Assets                                      |
| Content        | Manual content package creation through Content Production                                                      |
| Review         | Manual human approval before publishing preparation                                                             |
| Publishing     | Manual publishing package preparation and manual publishing completion reference recording                      |
| Performance    | Manual performance metric import and fact recording for completed publishing packages                           |
| Analytics      | Manual analytics report and learning summary creation                                                           |
| Workflow       | Project-scoped pending actions, failure visibility, and manual recovery confirmation                            |
| Administration | Canonical project visibility, local operator preferences, runtime health, storage visibility, and local backups |

## Fallback Procedures

- Use owner-service records as the source of truth.
- Keep manual actor and reason context for critical actions.
- When automation or integration fails, return to direct owner-service/manual operations.
- Record failures visibly through job, workflow, import, or audit records.
- Do not bypass review, approval, rights, governance, or audit boundaries.

## Production Boundary

CMS v1.0 is the accepted local operator baseline. Deployment, scaling, cloud infrastructure, external connectors, and production launch decisions require a separate approved execution phase.
