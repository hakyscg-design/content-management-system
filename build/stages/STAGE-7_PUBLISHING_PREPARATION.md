# FTV v2 Implementation Stage-7 - Publishing Preparation

## Implementation Plan

Stage-7 builds the MVP Publishing Preparation layer for FTV-SVC-04. It converts approved content references into manual publishing packages, tracks checklist readiness, records export metadata, and captures manual publishing completion references.

This stage does not post to platforms, schedule publishing, import performance data, generate analytics, or coordinate workflow.

## Roadmap Confirmation

| Roadmap field | Stage-7 resolution |
|---|---|
| Purpose | Prepare approved content for human-managed publishing with checklist and metadata. |
| Services | FTV-SVC-04; FTV-SVC-05 by reference; FTV-SVC-09 for governance. |
| Domains | Publishing Domain; Review Domain by reference; Governance Domain by check/audit. |
| Capabilities | CAP-05. |
| Components | FTV-COMP-012; FTV-COMP-013; FTV-COMP-014. |
| Repositories | Ghost ADAPT; Payload ADAPT; Penpot REFERENCE ONLY; Strapi REFERENCE ONLY. |
| Dependencies | Stage-1; Stage-5; Stage-6. |
| Deliverables | Publishing package; publishing checklist; manual publishing completion reference; publishing package builder module. |
| Acceptance Criteria | Approved content can become a publishing package and be marked ready/completed manually. |
| Exit Criteria | Performance import can reference manual publishing output. |
| Risks | Scope creep into autonomous publishing. |
| Out of Scope | Automated posting, credential handling, platform posting API implementation. |

## Dependency Verification

| Dependency | Verification |
|---|---|
| Stage-1 | Governance service imports and regression tests pass. |
| Stage-5 | Content package/version can be referenced without mutation. |
| Stage-6 | Approved/override-approved approval status is required before publishing package creation. |
| Blocking issue | None found. |

## Folder Structure

```text
src/ftv/publishing_preparation/
tests/ftv/publishing_preparation/
build/stages/stage-7/
```

## Project Layout

```text
C:\repository-acquisition-framework
|-- src\ftv\publishing_preparation
|-- tests\ftv\publishing_preparation
|-- build\stages\stage-7
`-- build\stages\STAGE-7_PUBLISHING_PREPARATION.md
```

## Package Layout

```text
ftv.publishing_preparation
```

## Module Layout

| Module | Responsibility |
|---|---|
| `constants.py` | Frozen Stage-7 service/entity identifiers and checklist defaults. |
| `errors.py` | Stage-7 validation, lookup, and transition errors. |
| `state.py` | Publishing package state machine. |
| `models.py` | Publishing package, metadata, export, checklist, and history models. |
| `contracts.py` | Command DTOs for publishing preparation lifecycle actions. |
| `interfaces.py` | Repository and source gateway protocols. |
| `repository_adapters.py` | In-memory MVP repository adapters. |
| `validators.py` | Metadata, checklist, readiness, and manual completion validation. |
| `source_gateway.py` | Stage-5/Stage-6 approved content gateway. |
| `governance.py` | Stage-1 governance and audit gateway. |
| `service.py` | FTV-SVC-04 publishing preparation application service. |
| `config.py` | Stage-7 in-memory service assembly. |

## Source Tree

```text
src/ftv/publishing_preparation/__init__.py
src/ftv/publishing_preparation/config.py
src/ftv/publishing_preparation/constants.py
src/ftv/publishing_preparation/contracts.py
src/ftv/publishing_preparation/errors.py
src/ftv/publishing_preparation/governance.py
src/ftv/publishing_preparation/interfaces.py
src/ftv/publishing_preparation/models.py
src/ftv/publishing_preparation/repository_adapters.py
src/ftv/publishing_preparation/service.py
src/ftv/publishing_preparation/source_gateway.py
src/ftv/publishing_preparation/state.py
src/ftv/publishing_preparation/validators.py
tests/ftv/publishing_preparation/test_service_integration.py
tests/ftv/publishing_preparation/test_smoke.py
tests/ftv/publishing_preparation/test_state.py
tests/ftv/publishing_preparation/test_validators.py
```

## Interfaces

| Interface | Purpose |
|---|---|
| `PublishingPackageRepository` | Owns publishing package persistence. |
| `PublishingHistoryRepository` | Owns publishing package history records. |
| `PublishingSourceGateway` | Validates approved content/version/approval references without owning them. |

## Domain Models

| Model | Ownership |
|---|---|
| `PublishingPackage` | FTV-SVC-04 authoritative record. |
| `PublishingMetadata` | FTV-SVC-04 publishing metadata value. |
| `ExportInformation` | FTV-SVC-04 manual export/package information. |
| `PublishingChecklist` | FTV-SVC-04 readiness checklist value. |
| `PublishingHistoryEntry` | FTV-SVC-04 publishing history record. |

## DTOs and Contracts

| DTO | Use |
|---|---|
| `CreatePublishingPackageCommand` | Create package from approved content. |
| `UpdatePublishingMetadataCommand` | Update caption/platform/tags/export information. |
| `CompleteChecklistItemCommand` | Mark checklist item complete. |
| `MarkPublishingPackageReadyCommand` | Move package to ready after checklist validation. |
| `BlockPublishingPackageCommand` | Block preparing or ready package. |
| `ResumePublishingPackageCommand` | Resume blocked package to preparing. |
| `CancelPublishingPackageCommand` | Cancel preparing, ready, or blocked package. |
| `MarkManualPublishingCompleteCommand` | Record human publishing completion reference. |

## Publishing State Machine

| Current | Allowed Next |
|---|---|
| `preparing` | `ready`, `blocked`, `cancelled` |
| `ready` | `completed`, `blocked`, `cancelled` |
| `blocked` | `preparing`, `cancelled` |
| `completed` | terminal |
| `cancelled` | terminal |

## Publishing Package Models

`PublishingPackage` stores content package/version references, approval reference, asset/media references, platform target, caption, tags, export information, checklist, state, manual publish reference, and timestamps.

## Checklist Models

`PublishingChecklist` tracks required readiness items:

- content approved
- rights verified
- assets complete
- metadata complete
- required fields complete
- platform selected
- package ready
- manual verification
- final ready check

The required item list is injectable through configuration.

## Audit Models

`PublishingHistoryEntry` records actor, previous state, current state, message, and timestamp. Formal governance audit events are recorded through FTV-SVC-09.

## Repository Adapters

Stage-7 uses in-memory repositories only:

- `InMemoryPublishingPackageRepository`
- `InMemoryPublishingHistoryRepository`

No database, posting API, scheduler, credential store, external workflow engine, or infrastructure was added.

## Internal Modules

| Internal module | MVP implementation |
|---|---|
| Publishing Package Builder | `PublishingPreparationService.create_package()`. |
| Publishing Checklist | `PublishingChecklist` plus ready-state validation. |

## Configurations

`build_stage7_publishing_preparation_service()` wires Stage-7 to Stage-1 governance, Stage-5 content production, and Stage-6 human review. Required checklist items are injectable to avoid hard-coded publishing rules.

## Tests

| Test file | Coverage |
|---|---|
| `test_state.py` | Publishing state transition rules. |
| `test_validators.py` | Metadata and checklist validation. |
| `test_service_integration.py` | Approved content dependency, package creation, checklist readiness, manual completion, block/resume/cancel, unapproved content rejection. |
| `test_smoke.py` | Stage-7 service assembly. |

## Validation

Validation performed:

```text
Stage-7 test suite: 10 tests OK
Stage-1 regression suite: 10 tests OK
Stage-2 regression suite: 8 tests OK
Stage-3 regression suite: 13 tests OK
Stage-4 regression suite: 12 tests OK
Stage-5 regression suite: 13 tests OK
Stage-6 regression suite: 15 tests OK
Stage-1 through Stage-7 explicit chain suite: 81 tests OK
```

## Review

- Architecture: no frozen architecture, service, domain, ownership, repository decision, or roadmap change.
- Scope: limited to Stage-7 CAP-05.
- Service ownership: FTV-SVC-04 owns Publishing package. FTV-SVC-03 owns content package/version. FTV-SVC-05 owns approval status. FTV-SVC-09 owns governance/audit.
- Repository decisions: Ghost/Payload patterns are adapted internally; Penpot and Strapi remain reference only.
- MVP posture: manual-first, repository-neutral, in-memory, no new framework or infrastructure.

## Known Limitations

- No platform posting API.
- No scheduler.
- No credential management.
- No performance import.
- No analytics.
- No workflow coordination.
- No persistence beyond in-memory repositories.

## Next Stage Dependency

Stage-8 can reference a completed publishing package and its `manual_publish_reference` for performance import. Stage-7 does not create performance imports or facts.

## Self Review Report

- CAP-05 is covered for MVP publishing preparation.
- Stage-1 through Stage-6 remain unchanged.
- Content/review/publishing ownership is preserved.
- Publishing preparation records manual completion only; no autonomous posting exists.
- No Stage-8 or later code was added.
- No Architecture Blueprint, System Assembly, Build Roadmap, or frozen discovery artifact changed.
