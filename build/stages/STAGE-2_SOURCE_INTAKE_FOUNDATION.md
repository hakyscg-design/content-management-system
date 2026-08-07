# STAGE-2_SOURCE_INTAKE_FOUNDATION.md

**Project:** Football Troll Vault v2  
**Phase:** IMPLEMENTATION / BUILD  
**Stage:** Stage-2 - Source Intake Foundation  
**Status:** Ready for review  
**Date:** 2026-07-30  
**Source of truth:** Frozen design artifacts + frozen Stage-1 output  

---

## 1. Dependency Verification

| Dependency check | Result |
|---|---|
| Stage-1 output exists | Pass |
| Stage-1 status is `READY FOR REVIEW` | Pass |
| Stage-1 tests pass | Pass |
| Stage-1 provides owner lookup/rule/audit foundation | Pass |
| No Stage-1 code changed for Stage-2 | Pass |
| No blocking issue found | Pass |

---

## 2. Stage-2 Implementation Plan

| Field | Stage-2 scope |
|---|---|
| Purpose | Build manual approved source capture and source-to-asset traceability foundation. |
| Services | FTV-SVC-01 Source & Asset Registry; FTV-SVC-09 Governance & Rule. |
| Domains | Source Domain; Asset Domain; Governance Domain. |
| Capabilities | CAP-01, CAP-02, CAP-11. |
| Components | FTV-COMP-001; FTV-COMP-002; FTV-COMP-004. |
| Repositories | ResourceSpace; Directus as admin/reference pattern. |
| Dependencies | Stage-1. |
| Deliverables | Source reference flow; provenance capture; rights status baseline; manual source acquisition module candidate. |
| Acceptance Criteria | A source reference can be captured, linked to provenance, and held in a rights-known or rights-pending state. |
| Exit Criteria | Asset registration can rely on source/provenance records. |
| Risks | ResourceSpace license/module uncertainty. |
| Out of Scope | Automated source discovery/download connectors; Asset Registry; Duplicate Detection; Media Processing. |

---

## 3. Folder Structure

```text
src/
  ftv/
    source_intake/
tests/
  ftv/
    source_intake/
build/
  stages/
    stage-2/
```

---

## 4. Project Layout

| Area | Path | Purpose |
|---|---|---|
| Source package | `src/ftv/source_intake` | Stage-2 source intake implementation. |
| Tests | `tests/ftv/source_intake` | Unit, integration, and smoke tests. |
| Stage docs | `build/stages/stage-2` | README, manual validation guide, acceptance checklist. |
| Stage report | `build/stages/STAGE-2_SOURCE_INTAKE_FOUNDATION.md` | Review and validation output. |

---

## 5. Package Layout

```text
ftv.source_intake
  config
  constants
  contracts
  errors
  governance
  interfaces
  models
  repository_adapters
  service
  state
  validators
```

The package depends on Stage-1 `ftv.governance` for rule evaluation and audit recording. It does not add a framework, database, queue, storage, auth solution, deployment, or infrastructure.

---

## 6. Module Layout

| Module | Responsibility |
|---|---|
| `models.py` | Source reference, source metadata, provenance, rights decision. |
| `state.py` | Source status, rights status, allowed source transitions. |
| `contracts.py` | Command DTOs for registration, provenance, rights, approval, rejection. |
| `interfaces.py` | Repository protocols for source, provenance, rights decisions. |
| `repository_adapters.py` | In-memory repository-independent adapters. |
| `validators.py` | Source registration, evidence, rights decision, manual approval validation. |
| `governance.py` | Stage-1 governance/audit gateway for source mutations. |
| `service.py` | SourceIntakeService facade. |
| `config.py` | Stage-2 dependency assembly. |
| `constants.py` | Frozen service/entity identifiers. |
| `errors.py` | Source intake errors. |

---

## 7. Source Tree

```text
src/ftv/source_intake/__init__.py
src/ftv/source_intake/config.py
src/ftv/source_intake/constants.py
src/ftv/source_intake/contracts.py
src/ftv/source_intake/errors.py
src/ftv/source_intake/governance.py
src/ftv/source_intake/interfaces.py
src/ftv/source_intake/models.py
src/ftv/source_intake/repository_adapters.py
src/ftv/source_intake/service.py
src/ftv/source_intake/state.py
src/ftv/source_intake/validators.py
```

---

## 8. Interfaces

| Interface | Purpose |
|---|---|
| `SourceReferenceRepository` | Store and retrieve source references. |
| `SourceProvenanceRepository` | Store provenance evidence linked to source IDs. |
| `RightsDecisionRepository` | Store rights decisions linked to source IDs. |

Interfaces use Python `Protocol` and stay repository independent.

---

## 9. Domain Models

| Model | Purpose |
|---|---|
| `SourceReference` | Authoritative Stage-2 source reference record. |
| `SourceMetadata` | Source metadata key/value payload. |
| `SourceProvenance` | Provenance evidence linked to a source. |
| `RightsDecision` | Human rights decision linked to a source. |
| `SourceStatus` | Source lifecycle state. |
| `RightsStatus` | Rights status state. |

No Asset model, Duplicate model, or Media model was introduced.

---

## 10. DTOs

DTOs are command dataclasses in `contracts.py`.

| DTO | Purpose |
|---|---|
| `RegisterSourceCommand` | Register a manual source reference. |
| `CaptureProvenanceCommand` | Capture provenance evidence. |
| `MarkRightsPendingCommand` | Move validated source into rights pending. |
| `RecordRightsDecisionCommand` | Record known rights decision. |
| `ApproveSourceCommand` | Manually approve a source after known usable rights. |
| `RejectSourceCommand` | Manually reject a source. |

---

## 11. Contracts

| Contract | Governance/Audit behavior |
|---|---|
| Register Source | Requests Stage-1 rule evaluation and audit recording. |
| Validate Source | Requests Stage-1 rule evaluation and audit recording. |
| Capture Provenance | Requests Stage-1 rule evaluation and audit recording. |
| Mark Rights Pending | Requests Stage-1 rule evaluation and audit recording. |
| Record Rights Decision | Requests Stage-1 rule evaluation and audit recording. |
| Approve/Reject Source | Requests Stage-1 rule evaluation and audit recording. |

No API, schema, protocol, OpenAPI, GraphQL, database schema, or event schema was created.

---

## 12. Repository Adapters

| Adapter | Purpose |
|---|---|
| `InMemorySourceReferenceRepository` | Testable source reference storage. |
| `InMemorySourceProvenanceRepository` | Testable provenance storage. |
| `InMemoryRightsDecisionRepository` | Testable rights decision storage. |

Adapters are in-memory only and do not select database/infrastructure.

---

## 13. Internal Modules

| Internal module | Implemented by |
|---|---|
| Approved Source Acquisition | `SourceIntakeService.register_source` + `SourceValidator` |
| Provenance Capture | `SourceIntakeService.capture_provenance` |
| Rights Manager, Stage-2 portion | Rights status model, pending/known decision flow, approval guard |

No Stage-3 Duplicate Decision Handler and no Asset Registry were built.

---

## 14. Configurations

| Configuration | Path | Rule |
|---|---|---|
| Stage-2 service assembly | `config.py` | Wires source intake to Stage-1 governance and in-memory adapters. |
| Frozen service/entity IDs | `constants.py` | Keeps traceability to FTV-SVC-01 and FTV-SVC-09. |

---

## 15. Validators

| Validator | Behavior |
|---|---|
| Source registration | Requires URI, supported URI scheme, origin label, submitted actor. |
| Provenance evidence | Requires non-empty evidence. |
| Rights decision | Requires known final rights status and reason. |
| Manual approval/rejection | Requires reason. |
| Source approval | Requires known usable rights: approved or restricted. |

---

## 16. State Models

| State model | Values |
|---|---|
| SourceStatus | captured, validated, rights_pending, rights_known, approved, rejected |
| RightsStatus | unknown, pending, approved, restricted, rejected, expired |

Allowed source transitions:

```text
captured -> validated -> rights_pending -> rights_known -> approved
captured/validated/rights_pending/rights_known/approved -> rejected where allowed by state model
```

Invalid direct transitions, such as `captured -> approved`, are rejected.

---

## 17. Error Handling

| Error | Meaning |
|---|---|
| `SourceIntakeError` | Base source intake error. |
| `SourceValidationError` | Invalid source command/record. |
| `SourceStateTransitionError` | Invalid source lifecycle transition. |
| `SourceNotFoundError` | Source reference not found. |

---

## 18. Logging

No logging framework was added.

Stage-2 uses Stage-1 audit event recording through `SourceGovernanceGateway` for governance-significant source mutations.

---

## 19. Tests

| Test file | Type | Coverage |
|---|---|---|
| `tests/ftv/source_intake/test_validators.py` | Unit | URI validation and approval rights guard. |
| `tests/ftv/source_intake/test_state.py` | Unit | Valid/invalid source status transitions. |
| `tests/ftv/source_intake/test_service_integration.py` | Integration | Registration -> validation -> provenance -> rights pending -> rights known -> manual approval. |
| `tests/ftv/source_intake/test_smoke.py` | Smoke | Stage-2 service assembly. |

Commands run:

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

Package discovery checks:

```text
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest discover -s tests\ftv\source_intake
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest discover -s tests\ftv\governance
```

Result:

```text
Source intake: Ran 8 tests, OK
Governance: Ran 10 tests, OK
```

---

## 20. Validation Guide

Manual validation guide created at:

```text
build/stages/stage-2/MANUAL_VALIDATION.md
```

It verifies source lifecycle, provenance, rights status, manual approval, governance/audit dependency, and absence of Stage-3/Stage-4 code.

---

## 21. README

Stage-2 README created at:

```text
build/stages/stage-2/README.md
```

It documents scope, out-of-scope boundaries, and validation commands.

---

## 22. Known Limitations

| Limitation | Reason |
|---|---|
| In-memory adapters only | Stage-2 must not choose database/infrastructure. |
| No ResourceSpace runtime integration | Repository role is approved as pattern/adapted source only; no external runtime chosen. |
| No automated source discovery/download | Explicitly out of scope for Stage-2. |
| No Asset Registry | Stage-3 owns asset registry. |
| No Duplicate Detection | Stage-3 owns duplicate control. |
| No Media Processing | Stage-4 owns media processing. |

---

## 23. Next Stage Dependency

Stage-3 can depend on Stage-2 for:

| Dependency | Provided by Stage-2 |
|---|---|
| Source reference identity | `SourceReference.source_id` |
| Source metadata | `SourceMetadata` |
| Provenance evidence | `SourceProvenance` |
| Rights status baseline | `RightsStatus` and `RightsDecision` |
| Manual approval state | `SourceStatus.APPROVED` |
| Governance/audit checks | Stage-1 through `SourceGovernanceGateway` |

Stage-3 must not start until Stage-2 review confirmation.

---

## 24. Self Review Report

| Check | Result |
|---|---|
| Correct Build Roadmap Stage-2 scope | Pass |
| Correct architecture | Pass |
| Correct dependency on Stage-1 | Pass |
| Correct service ownership: FTV-SVC-01 owns Source reference; FTV-SVC-09 governs/audits | Pass |
| Correct repository decision: ResourceSpace/Directus pattern roles only | Pass |
| Correct internal module plan | Pass |
| Stage-1 not changed | Pass |
| No Stage-3 Asset Registry built | Pass |
| No Stage-3 Duplicate Detection built | Pass |
| No Stage-4 Media Processing built | Pass |
| Frozen artifacts not edited | Pass |
| No framework/database/queue/storage/auth/deployment/infrastructure added | Pass |
| Tests passed | Pass |

---

## 25. Stage Status

READY FOR REVIEW

