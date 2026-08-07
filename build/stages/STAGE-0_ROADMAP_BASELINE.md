# STAGE-0_ROADMAP_BASELINE.md

**Project:** Football Troll Vault v2  
**Phase:** IMPLEMENTATION / BUILD  
**Stage:** Stage-0 - Roadmap Baseline  
**Status:** Ready for review  
**Date:** 2026-07-30  
**Source of truth:** Frozen design artifacts only  

---

## 1. Stage Scope

Stage-0 confirms the frozen source artifacts, roadmap scope, freeze discipline, non-goals, and traceability before implementation proceeds to Stage-1.

This stage does not implement runtime code. That is intentional: `FTV_BUILD_ROADMAP.md` defines Stage-0 deliverables as roadmap baseline, freeze-point policy, and traceability to frozen artifacts, with code, schemas, APIs, deployment, and task breakdown out of scope.

---

## 2. Frozen Source of Truth

| Artifact | Role in Stage-0 | Status |
|---|---|---|
| `CANDIDATE_REPOSITORY_INDEX.md` | Candidate repository/component source. | Freeze respected |
| `FTV_COMPONENT_CATALOG.md` | Component decisions and gaps. | Freeze respected |
| `FTV_SERVICE_CATALOG.md` | Service boundaries and ownership. | Freeze respected |
| `FTV_SYSTEM_ASSEMBLY.md` | Service interaction, events, commands, lifecycles. | Freeze respected |
| `FTV_ARCHITECTURE_BLUEPRINT.md` | Logical architecture, domains, bounded contexts, principles. | Freeze respected |
| `FTV_BUILD_ROADMAP.md` | Build stage order, dependencies, deliverables, validation. | Freeze respected |

No frozen artifact was edited in Stage-0.

---

## 3. Implementation Plan

| Item | Stage-0 decision |
|---|---|
| Current stage | Stage-0 - Roadmap Baseline |
| Build objective | Establish traceability and freeze discipline before Stage-1. |
| Services | All services by reference only. |
| Domains | All domains by reference only. |
| Capabilities | CAP-01 through CAP-12 by traceability only. |
| Components | All FTV components by reference only. |
| Repositories | All candidate repositories by inventory only. |
| Runtime implementation | Not started in Stage-0. |
| Next stage enabled | Stage-1 - Governance & Ownership Foundation, after review confirmation. |

---

## 4. Services, Components, Repositories, Dependencies

### 4.1 Services

| Service set | Stage-0 use |
|---|---|
| FTV-SVC-01 through FTV-SVC-11 | Referenced only to confirm the implementation source of truth. |

### 4.2 Components

| Component set | Stage-0 use |
|---|---|
| FTV-COMP-001 through FTV-COMP-028 | Referenced only; no component integration begins in Stage-0. |

### 4.3 Repositories

| Repository pool | Stage-0 use |
|---|---|
| 26 candidate repositories from `CANDIDATE_REPOSITORY_INDEX.md` | Inventory only; no repository is cloned, integrated, or reselected in Stage-0. |

### 4.4 Dependencies

| Dependency | Status |
|---|---|
| Stage-0 dependencies | None |
| Stage-1 dependency on Stage-0 | Stage-1 may start only after Stage-0 review confirmation. |

---

## 5. Folder Structure

Stage-0 creates only the implementation-stage artifact location:

```text
build/
  stages/
    STAGE-0_ROADMAP_BASELINE.md
```

No application source folder is created in Stage-0.

---

## 6. Package Structure

No runtime package structure is created in Stage-0.

Reason: package/module layout belongs to the first executable implementation stage. Stage-0 is explicitly scoped to roadmap baseline and freeze discipline.

---

## 7. Module Structure

No runtime module structure is created in Stage-0.

The next eligible module work begins in Stage-1:

| Stage-1 module candidate | Owner |
|---|---|
| Lightweight Business Rule Validation | FTV-SVC-09 |
| Audit Event Recorder | FTV-SVC-09 |

---

## 8. Source Tree

Stage-0 source tree addition:

```text
build/stages/STAGE-0_ROADMAP_BASELINE.md
```

No application code source tree exists yet.

---

## 9. Interface Design

No runtime interface design is created in Stage-0.

Stage-0 interface boundary is procedural:

| Interface | Rule |
|---|---|
| Frozen artifacts -> implementation stages | Read-only source of truth. |
| Stage output -> review | Each stage must produce reviewable artifact(s), validation, limitations, and next-stage dependency notes. |
| Review -> next stage | No next stage starts until confirmation. |

---

## 10. Repository Adapter

No repository adapter is implemented in Stage-0.

Repository integration begins only when the roadmap reaches the relevant stage:

| Repository category | Earliest stage |
|---|---|
| OpenFGA / Directus / governance references | Stage-1 |
| ResourceSpace | Stage-2 |
| LibrePhotos | Stage-3 |
| PhotoPrism reference | Stage-4 |
| Payload | Stage-5 |
| Ghost | Stage-7 |
| Metabase / Evidence | Stage-9 |
| Activepieces / Kestra | Stage-10 |

---

## 11. Internal Modules

No internal module is implemented in Stage-0.

Stage-0 records the first dependency-eligible internal modules for Stage-1:

| Internal module | Stage | Owner service |
|---|---|---|
| Lightweight Business Rule Validation | Stage-1 | FTV-SVC-09 |
| Audit Event Recorder | Stage-1 | FTV-SVC-09 |

---

## 12. Configuration

No runtime configuration is created in Stage-0.

Configuration rule established:

| Rule | Meaning |
|---|---|
| Configuration cannot change ownership | Any config that changes owner/service/domain boundary requires Change Request. |
| Configuration cannot bypass governance | Governed transitions must preserve rule/audit checks. |
| Configuration cannot select new stack | Framework/database/queue/storage/auth choices remain out of scope until explicitly approved in an implementation stage. |

---

## 13. Tests

No runtime tests are written in Stage-0 because no runtime code exists.

Stage-0 verification is artifact validation:

| Test type | Stage-0 result |
|---|---|
| Validation | Frozen artifact list confirmed. |
| Smoke Test | Stage artifact location exists. |
| Manual Test | Non-goals and freeze policy reviewed in this document. |
| Integration Test | Not applicable: no service integration in Stage-0. |
| Acceptance Test | Stage-0 acceptance criteria mapped and satisfied. |

---

## 14. Validation

| Roadmap acceptance criterion | Stage-0 result |
|---|---|
| Frozen artifact list confirmed | Pass |
| No architecture/service/ownership changes introduced | Pass |
| Roadmap scope confirmed | Pass |
| Non-goals preserved | Pass |
| Stage-1 remains blocked until review confirmation | Pass |

---

## 15. Review

### 15.1 Architecture Compliance

| Check | Result |
|---|---|
| Architecture unchanged | Pass |
| Services unchanged | Pass |
| Domains unchanged | Pass |
| Ownership unchanged | Pass |
| Repository decisions unchanged | Pass |
| Build Roadmap unchanged | Pass |
| No new framework/stack/database/infrastructure introduced | Pass |

### 15.2 Stage Discipline

| Check | Result |
|---|---|
| Did not skip Stage-0 | Pass |
| Did not start Stage-1 | Pass |
| Did not build multiple stages | Pass |
| Did not create runtime code | Pass |
| Did not create implementation detail outside Stage-0 scope | Pass |

---

## 16. Known Limitations

| Limitation | Impact |
|---|---|
| No runtime code yet | Expected for Stage-0. |
| No package/module/interface implementation yet | Expected for Stage-0; begins in Stage-1. |
| Frozen design artifacts are currently untracked in git status | This does not change their logical Freeze status; Stage-0 did not edit them. |
| License and repository verification remain unresolved | Deferred to relevant repository integration stages. |

---

## 17. Next Stage Dependency

| Next stage | Dependency from Stage-0 |
|---|---|
| Stage-1 - Governance & Ownership Foundation | May start only after Stage-0 review confirmation. |

Stage-1 must build only:

| Stage-1 scope | Source of truth |
|---|---|
| FTV-SVC-09 Governance & Rule | `FTV_SERVICE_CATALOG.md`, `FTV_SYSTEM_ASSEMBLY.md`, `FTV_ARCHITECTURE_BLUEPRINT.md`, `FTV_BUILD_ROADMAP.md` |
| FTV-SVC-11 Core Data Administration as reference consumer | Same frozen artifacts |
| CAP-09, CAP-10, CAP-11 | Same frozen artifacts |
| Components FTV-COMP-021, 022, 024, 025, 026, 023 | `FTV_COMPONENT_CATALOG.md`, `FTV_BUILD_ROADMAP.md` |

---

## 18. Freeze Policy

| Freeze rule | Requirement |
|---|---|
| Stage output freeze | After review confirmation, this Stage-0 output becomes frozen. |
| Frozen artifact protection | Frozen source artifacts must not be edited without Change Request. |
| Stage progression | Stage-1 cannot begin until Stage-0 is confirmed. |
| Architecture changes | Any change to architecture/service/domain/ownership/repository decisions must stop and request Change Request. |

---

## 19. Self Review

| Check | Result |
|---|---|
| Read Build Roadmap | Pass |
| Identified services/components/internal modules/repositories/dependencies | Pass |
| Code structure handled within Stage-0 scope | Pass |
| Package/module/interface sections included without premature implementation | Pass |
| No code implemented | Pass |
| No tests requiring runtime code added | Pass |
| Validation completed | Pass |
| Frozen artifacts not edited | Pass |
| Stage-1 not started | Pass |

---

## 20. Stage Status

READY FOR REVIEW

