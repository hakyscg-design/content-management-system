# FTV v2 Implementation Stage-6 - Human Review & Approval

## Implementation Plan

Stage-6 builds the MVP Human Review & Approval layer for FTV-SVC-05. It accepts review-ready content targets from Stage-5, creates review assignments, assigns reviewers, records decisions, tracks approval state, and preserves review history and audit traceability.

This stage does not mutate content records and does not implement publishing, performance import, analytics, or workflow coordination.

## Roadmap Confirmation

| Roadmap field | Stage-6 resolution |
|---|---|
| Purpose | Add authoritative review assignment, decision, and approval status gates. |
| Services | FTV-SVC-05; FTV-SVC-03 by reference; FTV-SVC-09 for governance. |
| Domains | Review Domain; Content Domain by reference; Governance Domain by check/audit. |
| Capabilities | CAP-12; supporting CAP-05 and CAP-11. |
| Components | FTV-COMP-013; FTV-COMP-024; FTV-COMP-027; FTV-COMP-028. |
| Repositories | Directus ADAPT; Payload ADAPT; AppFlowy REFERENCE ONLY; Camunda REFERENCE ONLY. |
| Dependencies | Stage-1; Stage-5. |
| Deliverables | Review assignment; approval status lifecycle; approve/reject/override concepts; review manual fallback. |
| Acceptance Criteria | Content review target can move requested -> assigned -> approved/rejected with owner/audit clarity. |
| Exit Criteria | Publishing preparation can consume approval status. |
| Risks | Directus license boundary; review workflow may overfit to platform. |
| Out of Scope | BPMN/user-task engine adoption. |

## Dependency Verification

| Dependency | Verification |
|---|---|
| Stage-1 | Governance service imports and regression tests pass. |
| Stage-2 | Source intake regression tests pass for upstream content setup. |
| Stage-3 | Asset registry regression tests pass for upstream content setup. |
| Stage-4 | Media processing regression tests pass for upstream content setup. |
| Stage-5 | Content production regression tests pass; Stage-6 validates `ready_for_review` targets. |
| Blocking issue | None found. |

## Folder Structure

```text
src/ftv/human_review/
tests/ftv/human_review/
build/stages/stage-6/
```

## Project Layout

```text
C:\repository-acquisition-framework
|-- src\ftv\human_review
|-- tests\ftv\human_review
|-- build\stages\stage-6
`-- build\stages\STAGE-6_HUMAN_REVIEW_APPROVAL.md
```

## Package Layout

```text
ftv.human_review
```

## Module Layout

| Module | Responsibility |
|---|---|
| `constants.py` | Frozen Stage-6 service/entity identifiers. |
| `errors.py` | Stage-6 validation, lookup, and transition errors. |
| `state.py` | Review and approval state machine. |
| `models.py` | Assignment, decision, approval, metadata, and history models. |
| `contracts.py` | Command DTOs for review lifecycle actions. |
| `interfaces.py` | Repository, target gateway, and reviewer policy protocols. |
| `repository_adapters.py` | In-memory MVP repository adapters. |
| `policies.py` | Replaceable reviewer availability policy. |
| `validators.py` | Request, assignment, decision, cancellation, and duplicate-active-review validation. |
| `content_gateway.py` | Stage-5 content target validation gateway. |
| `governance.py` | Stage-1 governance and audit gateway. |
| `service.py` | FTV-SVC-05 human review application service. |
| `config.py` | Stage-6 in-memory service assembly. |

## Source Tree

```text
src/ftv/human_review/__init__.py
src/ftv/human_review/config.py
src/ftv/human_review/constants.py
src/ftv/human_review/content_gateway.py
src/ftv/human_review/contracts.py
src/ftv/human_review/errors.py
src/ftv/human_review/governance.py
src/ftv/human_review/interfaces.py
src/ftv/human_review/models.py
src/ftv/human_review/policies.py
src/ftv/human_review/repository_adapters.py
src/ftv/human_review/service.py
src/ftv/human_review/state.py
src/ftv/human_review/validators.py
tests/ftv/human_review/test_service_integration.py
tests/ftv/human_review/test_smoke.py
tests/ftv/human_review/test_state.py
tests/ftv/human_review/test_validators.py
```

## Interfaces

| Interface | Purpose |
|---|---|
| `ReviewAssignmentRepository` | Owns assignment persistence and queue views. |
| `ReviewDecisionRepository` | Owns approval/rejection/return/override decision records. |
| `ApprovalStatusRepository` | Owns approval state for review targets. |
| `ReviewHistoryRepository` | Owns assignment and decision history records. |
| `ReviewerAvailabilityPolicy` | Keeps reviewer availability replaceable and non-hard-coded. |
| `ReviewTargetGateway` | Validates external target readiness without taking ownership. |

## Domain Models

| Model | Ownership |
|---|---|
| `ReviewAssignment` | FTV-SVC-05 authoritative record. |
| `ReviewDecision` | FTV-SVC-05 authoritative record. |
| `ApprovalStatus` | FTV-SVC-05 authoritative record. |
| `ReviewHistoryEntry` | FTV-SVC-05 review audit/history record. |
| `ReviewMetadata` | Review-owned metadata value. |

## DTOs and Contracts

| DTO | Use |
|---|---|
| `RequestReviewCommand` | Request review for a ready target. |
| `AssignReviewerCommand` | Assign an available reviewer. |
| `StartReviewCommand` | Move assigned review into active review. |
| `RecordReviewDecisionCommand` | Record approve/reject/return/override decision. |
| `CancelReviewCommand` | Cancel requested, assigned, or in-review assignment. |

## Review State Machine

| Current | Allowed Next |
|---|---|
| `requested` | `assigned`, `cancelled` |
| `assigned` | `in_review`, `cancelled` |
| `in_review` | `approved`, `rejected`, `returned`, `cancelled` |
| `approved` | terminal |
| `rejected` | terminal |
| `returned` | terminal |
| `cancelled` | terminal |

## Approval Models

`ApprovalStatus` starts as `pending` when a review is requested. Decision recording moves it to `approved`, `rejected`, `returned`, or `override_approved`. Cancellation moves it to `cancelled`. Approval state belongs to FTV-SVC-05 and does not edit content.

## Assignment Models

`ReviewAssignment` stores the target reference, requested actor, reviewer assignment, priority, status, and timestamps. `list_review_queue()` exposes requested/assigned/in-review work only.

## Audit Models

`ReviewHistoryEntry` records previous state, current state, actor, message, decision ID, override flag, and timestamp. Formal governance audit events are recorded through FTV-SVC-09 for governed mutations.

## Repository Adapters

Stage-6 uses in-memory repositories only:

- `InMemoryReviewAssignmentRepository`
- `InMemoryReviewDecisionRepository`
- `InMemoryApprovalStatusRepository`
- `InMemoryReviewHistoryRepository`

No database, review platform, BPMN engine, external workflow engine, or infrastructure was added.

## Internal Modules

| Internal module | MVP implementation |
|---|---|
| Review Assignment Queue | `ReviewAssignmentRepository` plus `list_review_queue()`. |
| Approval Status Tracker | `ApprovalStatusRepository` and decision-to-approval transition mapping. |

## Configurations

`build_stage6_human_review_service()` wires Stage-6 to Stage-1 governance and Stage-5 content production. Reviewer availability is injected through `StaticReviewerAvailabilityPolicy`, so reviewers and approval rules are not hard-coded.

## Constants

Stage-6 constants include FTV-SVC-05, FTV-SVC-03, FTV-SVC-04, FTV-SVC-09, and owner entity names for Review assignment, Review decision, and Approval status.

## Error Handling

Errors are explicit:

- `ReviewValidationError`
- `ReviewStateTransitionError`
- `ReviewAssignmentNotFoundError`
- `ReviewDecisionNotFoundError`
- `ApprovalStatusNotFoundError`

## Logging

Stage-6 uses Python standard-library logging for accepted lifecycle actions. Audit remains authoritative and is recorded through FTV-SVC-09.

## Tests

| Test file | Coverage |
|---|---|
| `test_state.py` | State transition rules and terminal states. |
| `test_validators.py` | Request validation and duplicate active review validation. |
| `test_service_integration.py` | Request, assignment, start, approve, reject, return, override, cancel, queue, target readiness, content non-mutation. |
| `test_smoke.py` | Stage-6 service assembly. |

## Validation

Validation performed:

```text
Stage-6 test suite: 15 tests OK
Stage-1 regression suite: 10 tests OK
Stage-2 regression suite: 8 tests OK
Stage-3 regression suite: 13 tests OK
Stage-4 regression suite: 12 tests OK
Stage-5 regression suite: 13 tests OK
Stage-1 through Stage-6 explicit chain suite: 71 tests OK
```

## Review

- Architecture: no frozen architecture, service, domain, ownership, repository decision, or roadmap change.
- Scope: limited to Stage-6 CAP-12 with supporting CAP-05/CAP-11 concepts.
- Service ownership: FTV-SVC-05 owns Review assignment, Review decision, and Approval status. FTV-SVC-03 owns Content package/version. FTV-SVC-09 owns governance/audit.
- Repository decisions: Directus/Payload patterns are adapted internally; AppFlowy and Camunda remain reference only.
- MVP posture: manual-first, repository-neutral, in-memory, no new framework or infrastructure.

## Known Limitations

- No real Directus/Payload review UI integration.
- No publishing package review target yet, because Stage-7 is not built.
- No workflow coordination.
- No reviewer calendar or workload service.
- No persistence beyond in-memory repositories.

## Next Stage Dependency

Stage-7 can consume `ApprovalStatus` for a review target and require `approved` or `override_approved` before creating publishing preparation records. Stage-6 does not create publishing packages.

## Self Review Report

- CAP-12 is covered for MVP human review support.
- Stage-1 through Stage-5 remain unchanged.
- Content/review/publishing ownership is preserved.
- Review decisions do not mutate content package or content version state.
- Approval status is authoritative in FTV-SVC-05.
- No Stage-7 or later code was added.
- No Architecture Blueprint, System Assembly, Build Roadmap, or frozen discovery artifact changed.
