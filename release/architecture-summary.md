# FTV v2 MVP Architecture Summary

## Architecture Position

The MVP remains a manual-first, human-governed Production Layer. The release candidate preserves the frozen logical architecture, service ownership boundaries, domain separation, repository neutrality, and manual fallback requirements.

## Preserved Boundaries

| Boundary                       | Release Candidate Status |
| ------------------------------ | ------------------------ |
| Architecture unchanged         | Preserved                |
| Service ownership unchanged    | Preserved                |
| Domain ownership unchanged     | Preserved                |
| Repository decisions unchanged | Preserved                |
| Manual-first operation         | Preserved                |
| Human approval gates           | Preserved                |
| Governance and auditability    | Preserved                |
| No autonomous publishing       | Preserved                |
| No production infrastructure   | Preserved                |

## Communication Model

Cross-service mutation is routed through owner-targeted commands. State notifications use events after owner-side state changes. Workflow orchestration owns workflow runs only and does not own business records.

## Governance Model

Governance & Rule owns roles, authorization relations, rule evaluations, and audit events. Critical manual actions require actor and reason context.
