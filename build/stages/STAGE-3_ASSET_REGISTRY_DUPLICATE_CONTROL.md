# STAGE-3_ASSET_REGISTRY_DUPLICATE_CONTROL.md

**Project:** Football Troll Vault v2  
**Phase:** IMPLEMENTATION / BUILD  
**Stage:** Stage-3 - Asset Registry & Duplicate Control  
**Status:** Ready for review  
**Date:** 2026-07-30  
**Source of truth:** Frozen design artifacts + frozen Stage-1 and Stage-2 outputs  

---

## 1. Dependency Verification

| Dependency check | Result |
|---|---|
| Stage-1 output exists | Pass |
| Stage-1 status is `READY FOR REVIEW` | Pass |
| Stage-1 regression tests pass | Pass |
| Stage-2 output exists | Pass |
| Stage-2 status is `READY FOR REVIEW` | Pass |
| Stage-2 regression tests pass | Pass |
| Stage-2 provides approved source and provenance/rights baseline | Pass |
| No blocking issue found | Pass |

---

## 2. Stage-3 Implementation Plan

| Field | Stage-3 scope |
|---|---|
| Purpose | Establish asset records, lifecycle, rights use checks, and duplicate-match handling. |
| Services | FTV-SVC-01 Source & Asset Registry; FTV-SVC-09 Governance & Rule. |
| Domains | Asset Domain; Governance Domain. |
| Capabilities | CAP-02. |
| Components | FTV-COMP-003; FTV-COMP-004; FTV-COMP-005. |
| Repositories | ResourceSpace; LibrePhotos; Immich reference; PhotoPrism reference; Nextcloud rejected; Stalwart rejected. |
| Dependencies | Stage-1; Stage-2. |
| Deliverables | Asset registry; rights status transitions; duplicate match records; manual duplicate resolution. |
| Acceptance Criteria | Registered assets have provenance, rights status, duplicate state, and clear ready/blocked status. |
| Exit Criteria | Media processing can accept registered asset references. |
| Risks | Duplicate logic may be too broad if copied from larger photo systems. |
| Out of Scope | Full DAM platform adoption; broad ML asset search; Media Processing; FFmpeg; OCR; STT; Thumbnail Generation; Content Package; Review; Publishing. |

---

## 3. Folder Structure

```text
src/
  ftv/
    asset_registry/
tests/
  ftv/
    asset_registry/
build/
  stages/
    stage-3/
```

---

## 4. Project Layout

| Area | Path | Purpose |
|---|---|---|
| Source package | `src/ftv/asset_registry` | Stage-3 asset registry and duplicate control implementation. |
| Tests | `tests/ftv/asset_registry` | Unit, integration, and smoke tests. |
| Stage docs | `build/stages/stage-3` | README, manual validation guide, acceptance checklist. |
| Stage report | `build/stages/STAGE-3_ASSET_REGISTRY_DUPLICATE_CONTROL.md` | Review and validation output. |

---

## 5. Package Layout

```text
ftv.asset_registry
  config
  constants
  contracts
  errors
  governance
  interfaces
  models
  repository_adapters
  service
  source_gateway
  state
  validators
```

The package depends on Stage-1 `ftv.governance` and Stage-2 `ftv.source_intake`. It does not add any framework, database, queue, storage, auth solution, deployment, infrastructure, or external OSS runtime.

---

## 6. Module Layout

| Module | Responsibility |
|---|---|
| `models.py` | Asset records, asset metadata, duplicate match records. |
| `state.py` | Asset status, asset rights state, duplicate match state, allowed transitions. |
| `contracts.py` | Command DTOs for asset registration, rights update, state change, duplicate candidate/resolution. |
| `interfaces.py` | Repository protocols for assets and duplicate matches. |
| `repository_adapters.py` | In-memory repository-independent adapters. |
| `validators.py` | Asset registration/readiness and duplicate candidate/resolution validation. |
| `source_gateway.py` | Stage-2 source approval and rights lookup. |
| `governance.py` | Stage-1 governance/audit gateway for asset and duplicate mutations. |
| `service.py` | AssetRegistryService facade. |
| `config.py` | Stage-3 dependency assembly. |
| `constants.py` | Frozen service/entity identifiers. |
| `errors.py` | Asset registry errors. |

---

## 7. Source Tree

```text
src/ftv/asset_registry/__init__.py
src/ftv/asset_registry/config.py
src/ftv/asset_registry/constants.py
src/ftv/asset_registry/contracts.py
src/ftv/asset_registry/errors.py
src/ftv/asset_registry/governance.py
src/ftv/asset_registry/interfaces.py
src/ftv/asset_registry/models.py
src/ftv/asset_registry/repository_adapters.py
src/ftv/asset_registry/service.py
src/ftv/asset_registry/source_gateway.py
src/ftv/asset_registry/state.py
src/ftv/asset_registry/validators.py
```

---

## 8. Interfaces

| Interface | Purpose |
|---|---|
| `AssetRepository` | Store, retrieve, and list asset records. |
| `DuplicateMatchRepository` | Store, retrieve, update, and list duplicate match records. |

Interfaces use Python `Protocol` and remain repository independent.

---

## 9. Domain Models

| Model | Purpose |
|---|---|
| `AssetRecord` | Authoritative Stage-3 asset record. |
| `AssetMetadata` | Asset metadata key/value payload. |
| `DuplicateMatch` | Duplicate candidate/review/resolution record. |
| `AssetStatus` | Asset lifecycle status. |
| `AssetRightsState` | Asset rights association state. |
| `DuplicateMatchState` | Duplicate review/resolution state. |

No Media Processing, Content Package, Review, or Publishing model was introduced.

---

## 10. DTOs

DTOs are command dataclasses in `contracts.py`.

| DTO | Purpose |
|---|---|
| `RegisterAssetCommand` | Register an asset from an approved source. |
| `UpdateAssetRightsCommand` | Update asset rights association and block unsafe assets. |
| `MarkAssetReadyCommand` | Move asset to ready state after usable rights. |
| `BlockAssetCommand` | Manually block an asset. |
| `ArchiveAssetCommand` | Archive an asset. |
| `RecordDuplicateCandidateCommand` | Record duplicate detection result/candidate match. |
| `ResolveDuplicateCommand` | Record human duplicate resolution decision. |

---

## 11. Contracts

| Contract | Governance/Audit behavior |
|---|---|
| Register Asset | Requires Stage-2 approved source and Stage-1 rule/audit path. |
| Update Asset Rights | Requests Stage-1 rule evaluation and audit recording. |
| Mark Asset Ready | Requires usable rights and Stage-1 rule/audit path. |
| Block/Archive Asset | Requires reason and Stage-1 rule/audit path. |
| Record Duplicate Candidate | Requires two existing distinct assets and Stage-1 rule/audit path. |
| Resolve Duplicate | Requires human decision, reason, valid duplicate transition, and Stage-1 rule/audit path. |

No API, schema, protocol, OpenAPI, GraphQL, database schema, or event schema was created.

---

## 12. State Machines

### 12.1 Asset State

```text
pending -> ready
pending -> blocked
pending -> archived
ready -> blocked
ready -> archived
blocked -> ready
blocked -> archived
archived -> terminal
```

### 12.2 Rights State

```text
unknown
pending
approved
restricted
rejected
expired
```

Asset can become ready only when rights are `approved` or `restricted`.

### 12.3 Duplicate State

```text
potential_duplicate -> confirmed_duplicate
potential_duplicate -> false_positive
potential_duplicate -> keep_separate_decided
confirmed_duplicate -> merge_decided
confirmed_duplicate -> keep_separate_decided
```

Automatic merge is not implemented. `merge_decided` records human intent only.

---

## 13. Duplicate Models

| Model/field | Meaning |
|---|---|
| `DuplicateMatch.primary_asset_id` | Existing asset in comparison. |
| `DuplicateMatch.candidate_asset_id` | Candidate duplicate asset. |
| `DuplicateMatch.evidence` | Human/system evidence summary. |
| `DuplicateMatch.confidence` | Candidate confidence between 0 and 1. |
| `DuplicateMatch.state` | Potential/confirmed/false-positive/merge/keep-separate state. |
| `DuplicateMatch.decision_by` | Human actor who resolved the duplicate. |
| `DuplicateMatch.decision_reason` | Required human resolution reason. |

---

## 14. Repository Adapters

| Adapter | Purpose |
|---|---|
| `InMemoryAssetRepository` | Testable asset record storage. |
| `InMemoryDuplicateMatchRepository` | Testable duplicate match storage. |

Adapters are in-memory only and do not select database/infrastructure.

---

## 15. Internal Modules

| Internal module | Implemented by |
|---|---|
| Rights Manager, Stage-3 extension | `AssetRightsState`, `update_asset_rights`, `mark_asset_ready`, readiness validation. |
| Duplicate Decision Handler | `DuplicateMatch`, duplicate state machine, `record_duplicate_candidate`, `resolve_duplicate`. |

No Stage-4 internal module was built.

---

## 16. Configurations

| Configuration | Path | Rule |
|---|---|---|
| Stage-3 service assembly | `config.py` | Wires asset registry to Stage-1 governance and Stage-2 source intake. |
| Frozen service/entity IDs | `constants.py` | Keeps traceability to FTV-SVC-01 and FTV-SVC-09. |

---

## 17. Validators

| Validator | Behavior |
|---|---|
| Asset registration | Requires source ID, media reference, registered actor. |
| Asset readiness | Requires approved or restricted rights. |
| Reason validation | Requires reason for rights/state changes. |
| Duplicate candidate | Requires two different existing assets, evidence, confidence 0..1. |
| Duplicate resolution | Requires allowed human decision and reason. |

---

## 18. Error Handling

| Error | Meaning |
|---|---|
| `AssetRegistryError` | Base asset registry error. |
| `AssetValidationError` | Invalid asset/duplicate command or record. |
| `AssetStateTransitionError` | Invalid asset lifecycle transition. |
| `DuplicateStateTransitionError` | Invalid duplicate lifecycle transition. |
| `AssetNotFoundError` | Asset not found. |
| `DuplicateMatchNotFoundError` | Duplicate match not found. |

---

## 19. Logging

No logging framework was added.

Stage-3 records governance-significant asset and duplicate mutations through Stage-1 audit event recording.

---

## 20. Tests

| Test file | Type | Coverage |
|---|---|---|
| `tests/ftv/asset_registry/test_state.py` | Unit | Asset lifecycle and duplicate state transitions. |
| `tests/ftv/asset_registry/test_validators.py` | Unit | Rights readiness guard and duplicate candidate validation. |
| `tests/ftv/asset_registry/test_service_integration.py` | Integration | Stage-2 approved source -> asset registration -> ready; rights rejection -> blocked; duplicate review/resolution. |
| `tests/ftv/asset_registry/test_smoke.py` | Smoke | Stage-3 service assembly. |

Commands run:

```text
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.asset_registry.test_state tests.ftv.asset_registry.test_validators tests.ftv.asset_registry.test_service_integration tests.ftv.asset_registry.test_smoke
```

Result:

```text
Ran 13 tests
OK
```

Stage-2 regression:

```text
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.source_intake.test_validators tests.ftv.source_intake.test_state tests.ftv.source_intake.test_service_integration tests.ftv.source_intake.test_smoke
```

Result:

```text
Ran 8 tests
OK
```

Stage-1 regression:

```text
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.governance.test_ownership tests.ftv.governance.test_rules tests.ftv.governance.test_service_integration tests.ftv.governance.test_smoke
```

Result:

```text
Ran 10 tests
OK
```

Explicit chain validation:

```text
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.governance.test_ownership tests.ftv.governance.test_rules tests.ftv.governance.test_service_integration tests.ftv.governance.test_smoke tests.ftv.source_intake.test_validators tests.ftv.source_intake.test_state tests.ftv.source_intake.test_service_integration tests.ftv.source_intake.test_smoke tests.ftv.asset_registry.test_state tests.ftv.asset_registry.test_validators tests.ftv.asset_registry.test_service_integration tests.ftv.asset_registry.test_smoke
```

Result:

```text
Ran 31 tests
OK
```

---

## 21. Validation Guide

Manual validation guide created at:

```text
build/stages/stage-3/MANUAL_VALIDATION.md
```

It verifies asset lifecycle, rights transition, duplicate review flow, duplicate resolution, traceability, and absence of Stage-4/Stage-5 code.

---

## 22. README

Stage-3 README created at:

```text
build/stages/stage-3/README.md
```

It documents scope, out-of-scope boundaries, and validation commands.

---

## 23. Known Limitations

| Limitation | Reason |
|---|---|
| In-memory adapters only | Stage-3 must not choose database/infrastructure. |
| No ResourceSpace/LibrePhotos runtime integration | Repository roles are adapted/reference patterns only at this stage. |
| Duplicate detection engine not implemented | Stage-3 records detection results and human resolution; it does not compute media similarity. |
| No automatic asset merge | Human merge decision is recorded only. |
| No Media Processing | Stage-4 owns media processing. |
| No Content Package | Stage-5 owns content production. |
| No Review/Publishing | Later stages own those capabilities. |

---

## 24. Next Stage Dependency

Stage-4 can depend on Stage-3 for:

| Dependency | Provided by Stage-3 |
|---|---|
| Asset identity | `AssetRecord.asset_id` |
| Asset media reference | `AssetRecord.media_reference` |
| Source/provenance traceability | `AssetRecord.source_id` |
| Asset rights association | `AssetRecord.rights_state` |
| Asset readiness | `AssetStatus.READY` |
| Blocked/pending/archive states | `AssetStatus` |
| Duplicate match records | `DuplicateMatch` |
| Manual duplicate resolution | `DuplicateMatchState` and decision fields |
| Governance/audit checks | Stage-1 through `AssetGovernanceGateway` |

Stage-4 must not start until Stage-3 review confirmation.

---

## 25. Self Review Report

| Check | Result |
|---|---|
| Correct Build Roadmap Stage-3 scope | Pass |
| Correct architecture | Pass |
| Correct dependency on Stage-1 and Stage-2 | Pass |
| Correct service ownership: FTV-SVC-01 owns Asset/Rights/Duplicate; FTV-SVC-09 governs/audits | Pass |
| Correct repository decision: ResourceSpace/LibrePhotos adapted patterns; Immich/PhotoPrism reference; Nextcloud/Stalwart rejected | Pass |
| Correct internal module plan | Pass |
| Stage-1 not changed | Pass |
| Stage-2 not changed | Pass |
| No Stage-4 Media Processing built | Pass |
| No Stage-5 Content Production built | Pass |
| No FFmpeg/OCR/STT/thumbnail/metadata extraction pipeline built | Pass |
| No Review/Publishing built | Pass |
| Frozen artifacts not edited | Pass |
| No framework/database/queue/storage/auth/deployment/infrastructure added | Pass |
| Tests passed | Pass |

---

## 26. Stage Status

READY FOR REVIEW

