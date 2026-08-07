# FTV v2 Implementation Stage-5 - Content Production Core

## Implementation Plan

Stage-5 builds the MVP Content Production Core for FTV-SVC-03. It creates content briefs, registers content packages from READY asset/media references, tracks version history with immutable snapshots, and allows a completed package to reach `ready_for_review`.

This stage consumes Stage-1 governance, Stage-3 asset registry, and optional Stage-4 media processing references. It does not implement review, approval, publishing, performance import, analytics, workflow coordination, or AI generation.

## Roadmap Confirmation

| Roadmap field | Stage-5 resolution |
|---|---|
| Purpose | Build content brief, content package, and content version flow from approved assets. |
| Services | FTV-SVC-03; FTV-SVC-01 by reference; FTV-SVC-09 for governance. |
| Domains | Content Domain; Asset Domain by reference; Governance Domain by check/audit. |
| Capabilities | CAP-04. |
| Components | FTV-COMP-009; FTV-COMP-010; FTV-COMP-011. |
| Repositories | Payload ADAPT; AppFlowy REFERENCE ONLY; Strapi REFERENCE ONLY. |
| Dependencies | Stage-1; Stage-3; Stage-4. |
| Deliverables | Content brief flow; package/version lifecycle; review-ready state. |
| Acceptance Criteria | A content package can be created from ready assets and versioned before review. |
| Exit Criteria | Human review can receive content review targets. |
| Risks | Payload/Directus boundary confusion. |
| Out of Scope | Full workspace/collaboration platform; AI content generation. |

## Dependency Verification

| Dependency | Verification |
|---|---|
| Stage-1 | Governance service imports and regression tests pass. |
| Stage-2 | Source intake regression tests pass for source/rights prerequisites. |
| Stage-3 | Asset registry regression tests pass and Stage-5 validates READY asset references. |
| Stage-4 | Media processing regression tests pass and Stage-5 can validate derivative references when provided. |
| Blocking issue | None found. |

## Folder Structure

```text
src/ftv/content_production/
tests/ftv/content_production/
build/stages/stage-5/
```

## Project Layout

```text
C:\repository-acquisition-framework
|-- src\ftv\content_production
|-- tests\ftv\content_production
|-- build\stages\stage-5
`-- build\stages\STAGE-5_CONTENT_PRODUCTION_CORE.md
```

## Package Layout

```text
ftv.content_production
```

## Module Layout

| Module | Responsibility |
|---|---|
| `constants.py` | Frozen Stage-5 service/entity identifiers. |
| `errors.py` | Stage-5 validation, lookup, and transition errors. |
| `state.py` | Content package state machine. |
| `models.py` | Brief, package, version, snapshot, metadata, asset reference, dependency models. |
| `contracts.py` | Command DTOs for content production lifecycle. |
| `interfaces.py` | Repository and version strategy protocols. |
| `repository_adapters.py` | In-memory MVP repository adapters. |
| `versioning.py` | Replaceable version number strategy. |
| `validators.py` | Required field, package completeness, and ready-for-review validation. |
| `asset_gateway.py` | Stage-3 asset readiness/rights gateway. |
| `media_gateway.py` | Optional Stage-4 derivative reference gateway. |
| `governance.py` | Stage-1 governance and audit gateway. |
| `service.py` | FTV-SVC-03 content production application service. |
| `config.py` | Stage-5 in-memory service assembly. |

## Source Tree

```text
src/ftv/content_production/__init__.py
src/ftv/content_production/asset_gateway.py
src/ftv/content_production/config.py
src/ftv/content_production/constants.py
src/ftv/content_production/contracts.py
src/ftv/content_production/errors.py
src/ftv/content_production/governance.py
src/ftv/content_production/interfaces.py
src/ftv/content_production/media_gateway.py
src/ftv/content_production/models.py
src/ftv/content_production/repository_adapters.py
src/ftv/content_production/service.py
src/ftv/content_production/state.py
src/ftv/content_production/validators.py
src/ftv/content_production/versioning.py
tests/ftv/content_production/test_service_integration.py
tests/ftv/content_production/test_smoke.py
tests/ftv/content_production/test_state.py
tests/ftv/content_production/test_validators.py
```

## Interfaces

| Interface | Purpose |
|---|---|
| `ContentBriefRepository` | Owns content brief persistence. |
| `ContentPackageRepository` | Owns content package persistence and state. |
| `ContentVersionRepository` | Owns append-oriented content versions. |
| `PackageDependencyRepository` | Owns package dependency records. |
| `VersionNumberStrategy` | Keeps version increment strategy replaceable. |

## Domain Models

| Model | Ownership |
|---|---|
| `ContentBrief` | FTV-SVC-03 authoritative record. |
| `ContentPackage` | FTV-SVC-03 authoritative record. |
| `ContentVersion` | FTV-SVC-03 authoritative record. |
| `ContentSnapshot` | Immutable version snapshot value. |
| `ContentMetadata` | Package/brief/version metadata value. |
| `PackageAssetReference` | Reference to FTV-SVC-01 asset and optional FTV-SVC-02 derivatives. |
| `PackageDependency` | FTV-SVC-03 package dependency record. |

## DTOs and Contracts

| DTO | Use |
|---|---|
| `CreateContentBriefCommand` | Create a content brief. |
| `CreateContentPackageCommand` | Register a package from a brief and ready assets. |
| `AddAssetToPackageCommand` | Add another ready asset reference to a package. |
| `CreateContentVersionCommand` | Append a new immutable version snapshot. |
| `AddPackageDependencyCommand` | Record a package dependency. |
| `MarkContentReadyForReviewCommand` | Move complete content package to ready-for-review. |
| `ArchiveContentPackageCommand` | Archive a content package. |

## Content State Machine

| Current | Allowed Next |
|---|---|
| `draft` | `in_progress`, `archived` |
| `in_progress` | `ready_for_review`, `archived` |
| `ready_for_review` | `in_progress`, `archived` |
| `archived` | terminal |

## Package Models

`ContentPackage` stores brief reference, title, producer, content state, asset references, metadata, and current version reference. It does not own asset, media, review, approval, or publishing records.

## Version Models

`ContentVersion` stores immutable snapshots with version number, previous version reference, active flag, rollback reference, and creator. New versions append records and deactivate the previous active version; old snapshots are not overwritten.

## Dependency Models

`PackageDependency` records a package-to-package dependency with reason and creator. Dependencies do not merge package ownership or lifecycle.

## Repository Adapters

Stage-5 uses in-memory repositories only:

- `InMemoryContentBriefRepository`
- `InMemoryContentPackageRepository`
- `InMemoryContentVersionRepository`
- `InMemoryPackageDependencyRepository`

No database, CMS platform, external workspace, storage provider, or infrastructure was added.

## Internal Modules

| Internal module | MVP implementation |
|---|---|
| Content Package Manager | `ContentProductionService` package commands and package repository. |
| Version Tracker | `ContentVersionRepository` plus `VersionNumberStrategy`. |

## Configurations

`build_stage5_content_production_service()` wires Stage-5 to Stage-1 governance, Stage-3 asset registry, and optional Stage-4 media processing. `required_ready_metadata_keys` and `version_strategy` are injected so content rules and version strategy are not hard-coded.

## Constants

Stage-5 constants include FTV-SVC-03, FTV-SVC-01, FTV-SVC-02, FTV-SVC-09, and owner entity names for Content brief, Content package, and Content version.

## Error Handling

Errors are explicit:

- `ContentValidationError`
- `ContentStateTransitionError`
- `ContentBriefNotFoundError`
- `ContentPackageNotFoundError`
- `ContentVersionNotFoundError`
- `ContentDependencyNotFoundError`

## Logging

Stage-5 uses Python standard-library logging for accepted mutations. Audit remains authoritative and is recorded through FTV-SVC-09.

## Tests

| Test file | Coverage |
|---|---|
| `test_state.py` | State transition rules and terminal archive state. |
| `test_validators.py` | Required fields and asset/media reference validation. |
| `test_service_integration.py` | Brief/package/version lifecycle, Stage-3/Stage-4 dependencies, ready-for-review, dependency records, immutable history. |
| `test_smoke.py` | Stage-5 service assembly. |

## Validation

Validation performed:

```text
Stage-5 test suite: 13 tests OK
Stage-1 regression suite: 10 tests OK
Stage-2 regression suite: 8 tests OK
Stage-3 regression suite: 13 tests OK
Stage-4 regression suite: 12 tests OK
Stage-1 through Stage-5 explicit chain suite: 56 tests OK
```

## Review

- Architecture: no frozen architecture, service, domain, ownership, repository decision, or roadmap change.
- Scope: limited to Stage-5 CAP-04.
- Service ownership: FTV-SVC-03 owns Content brief, Content package, and Content version. FTV-SVC-01 owns Asset/Rights. FTV-SVC-02 owns media processing jobs/derivatives. FTV-SVC-09 owns governance/audit.
- Repository decisions: Payload patterns are adapted internally; AppFlowy and Strapi remain reference only.
- MVP posture: manual-first, repository-neutral, in-memory, no new framework or infrastructure.

## Known Limitations

- No real CMS/Payload integration.
- No collaborative workspace UI.
- No AI content generation.
- No review assignment, approval status, publishing package, performance import, analytics report, or workflow run.
- No persistence beyond in-memory repositories.

## Next Stage Dependency

Stage-6 can receive content review targets by referencing a package in `ready_for_review` state and its current content version. Stage-5 does not create review assignments or approval statuses.

## Self Review Report

- CAP-04 is covered for MVP content production.
- Stage-1, Stage-2, Stage-3, and Stage-4 remain unchanged.
- Content/review/publishing ownership is preserved.
- Asset/media references are validated through owner-service gateways and not mutated.
- Old content versions are preserved and not overwritten.
- No Stage-6 or later code was added.
- No Architecture Blueprint, System Assembly, Build Roadmap, or frozen discovery artifact changed.
