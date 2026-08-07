# STAGE-1_GOVERNANCE_OWNERSHIP_FOUNDATION.md

**Project:** Football Troll Vault v2  
**Phase:** IMPLEMENTATION / BUILD  
**Stage:** Stage-1 - Governance & Ownership Foundation  
**Status:** Ready for review  
**Date:** 2026-07-30  
**Source of truth:** Frozen design artifacts only  

---

## 1. Stage-1 Implementation Plan

| Field | Stage-1 scope |
|---|---|
| Purpose | Establish single-owner rules, authorization/rule/audit concepts, and domain lifecycle guardrails. |
| Services | FTV-SVC-09 Governance & Rule; FTV-SVC-11 Core Data Administration as reference consumer. |
| Domains | Governance Domain; Administration Domain. |
| Capabilities | CAP-09, CAP-10, CAP-11. |
| Components | FTV-COMP-021; FTV-COMP-022; FTV-COMP-024; FTV-COMP-025; FTV-COMP-026; FTV-COMP-023. |
| Repositories | OpenFGA; Directus; Camunda reference; DataHub reference; OpenMetadata reference; Grafana reference. |
| Dependencies | Stage-0 only. |
| Deliverables | Ownership rule baseline; role/relation/rule/audit lifecycle baseline; admin non-authority policy. |
| Acceptance Criteria | Each governed record has one owner; rule evaluation and audit concepts are available to later stages. |
| Exit Criteria | Later stages can request rule/authorization/audit checks without changing ownership. |
| Risks | Governance becomes too heavy for MVP. |
| Out of Scope | Auth technology, policy engine implementation, database/security schema, Stage-2 source intake, Stage-3 asset registry. |

---

## 2. Folder Structure

```text
src/
  ftv/
    governance/
tests/
  ftv/
    governance/
build/
  stages/
    stage-1/
```

---

## 3. Project Layout

| Area | Path | Purpose |
|---|---|---|
| Source package | `src/ftv/governance` | Stage-1 governance and ownership foundation. |
| Tests | `tests/ftv/governance` | Unit, integration, and smoke tests. |
| Stage docs | `build/stages/stage-1` | README, manual validation guide, acceptance checklist. |
| Stage report | `build/stages/STAGE-1_GOVERNANCE_OWNERSHIP_FOUNDATION.md` | Review and validation output. |

---

## 4. Package Layout

```text
ftv.governance
  admin
  audit
  authorization
  config
  constants
  contracts
  errors
  interfaces
  models
  ownership
  repository_adapters
  rules
  service
```

No framework, database, queue, storage, auth solution, infrastructure, deployment, or external OSS runtime was added.

---

## 5. Module Layout

| Module | Responsibility |
|---|---|
| `models.py` | Domain models for actors, record references, relations, evaluations, audit events, owner records, admin view config. |
| `interfaces.py` | Protocol interfaces for repositories/adapters. |
| `ownership.py` | Single-owner catalog and ownership guard. |
| `authorization.py` | Authorization relation grant/check behavior. |
| `rules.py` | Lightweight business-rule validation for ownership and admin non-authority. |
| `audit.py` | Audit event recorder. |
| `admin.py` | Core Data Administration non-authoritative view policy. |
| `repository_adapters.py` | In-memory repository adapters for Stage-1 tests. |
| `contracts.py` | Command DTOs for rule evaluation, authorization check, audit recording, admin view config. |
| `config.py` | Stage-1 dependency assembly using frozen ownership constants. |
| `service.py` | GovernanceService facade. |

---

## 6. Source Tree

```text
src/ftv/__init__.py
src/ftv/governance/__init__.py
src/ftv/governance/admin.py
src/ftv/governance/audit.py
src/ftv/governance/authorization.py
src/ftv/governance/config.py
src/ftv/governance/constants.py
src/ftv/governance/contracts.py
src/ftv/governance/errors.py
src/ftv/governance/interfaces.py
src/ftv/governance/models.py
src/ftv/governance/ownership.py
src/ftv/governance/repository_adapters.py
src/ftv/governance/rules.py
src/ftv/governance/service.py
```

---

## 7. Interfaces

| Interface | Purpose |
|---|---|
| `AuthorizationRelationRepository` | Store/check authorization relations without binding to a database. |
| `RuleEvaluationRepository` | Store rule evaluations. |
| `AuditEventRepository` | Store audit events. |
| `AdminViewRepository` | Store admin view configuration. |

Interfaces use Python `Protocol` to stay dependency-injection friendly and repository independent.

---

## 8. Contracts

| Contract | Purpose |
|---|---|
| `EvaluateRuleCommand` | Request ownership/rule validation from FTV-SVC-09. |
| `CheckAuthorizationCommand` | Request authorization check. |
| `RecordAuditEventCommand` | Request append-style audit event recording. |
| `ConfigureAdminViewCommand` | Request non-authoritative admin view configuration. |

No API, schema, protocol, OpenAPI, GraphQL, database schema, or event schema was created.

---

## 9. Core Classes

| Class | Responsibility |
|---|---|
| `GovernanceService` | Stage-1 service facade for rule, authorization, audit, and admin view operations. |
| `OwnershipCatalog` | Enforces one owner per entity type. |
| `AuthorizationService` | Grants/checks relation-based authorization concepts. |
| `LightweightBusinessRuleValidator` | Denies non-owner mutations and admin-owned business-record mutation. |
| `AuditService` | Records audit events. |
| `CoreDataAdministrationPolicy` | Allows admin views while preserving non-authoritative status. |

---

## 10. Repository Adapters

| Adapter | Purpose |
|---|---|
| `InMemoryAuthorizationRelationRepository` | Testable relation storage. |
| `InMemoryRuleEvaluationRepository` | Testable rule evaluation storage. |
| `InMemoryAuditEventRepository` | Testable audit event storage. |
| `InMemoryAdminViewRepository` | Testable admin view config storage. |

These are repository-independent adapters for Stage-1 only. They do not select database or infrastructure.

---

## 11. Internal Modules

| Internal module | Implemented by |
|---|---|
| Lightweight Business Rule Validation | `LightweightBusinessRuleValidator` |
| Audit Event Recorder | `AuditService` |

No Stage-2 or later internal module was built.

---

## 12. Configurations

| Configuration | Path | Rule |
|---|---|---|
| Frozen owner entity mapping | `constants.py` | Mirrors frozen ownership matrix for Stage-1 traceability. |
| Stage-1 service assembly | `config.py` | Wires interfaces to in-memory adapters without infrastructure choices. |

Ownership is not hidden in business logic. It is assembled from an explicit Stage-1 configuration derived from frozen artifacts.

---

## 13. Constants

| Constant group | Purpose |
|---|---|
| Service IDs | Trace FTV-SVC-09 and FTV-SVC-11. |
| Owner entity types | Stage-1 ownership registry from frozen artifacts. |
| Admin non-authoritative entity types | Prevent Core Data Administration from owning business records. |
| Relation names | Minimal relation vocabulary for Stage-1 tests. |

---

## 14. Domain Models

| Model | Purpose |
|---|---|
| `Actor` | Human/system actor reference for rule/audit operations. |
| `RecordReference` | Entity type + record ID reference. |
| `AuthorizationRelation` | Subject-relation-object relation. |
| `RuleContext` | Rule evaluation context. |
| `RuleEvaluation` | Allow/deny rule result with reason. |
| `AuditEvent` | Audit record with actor/action/target/outcome/reason. |
| `OwnerRecord` | Entity owner mapping. |
| `AdminViewConfig` | Non-authoritative admin view configuration. |

---

## 15. DTOs

DTOs are represented by command dataclasses in `contracts.py`.

| DTO | Receiver |
|---|---|
| `EvaluateRuleCommand` | FTV-SVC-09 |
| `CheckAuthorizationCommand` | FTV-SVC-09 |
| `RecordAuditEventCommand` | FTV-SVC-09 |
| `ConfigureAdminViewCommand` | FTV-SVC-11 policy through governance foundation |

---

## 16. Validation

| Validation type | Implementation |
|---|---|
| Duplicate owner validation | `OwnershipCatalog` rejects duplicated entity owner records. |
| Unknown entity validation | `OwnershipCatalog` rejects unknown entity type lookups. |
| Non-owner mutation validation | `LightweightBusinessRuleValidator` denies mutation by non-owner service. |
| Admin non-authority validation | `LightweightBusinessRuleValidator` and `CoreDataAdministrationPolicy` block admin mutation of business records. |
| Required field validation | Domain dataclasses validate required identifiers. |

---

## 17. Error Handling

| Error | Meaning |
|---|---|
| `GovernanceError` | Base governance error. |
| `UnknownEntityTypeError` | Entity type is not in ownership registry. |
| `OwnershipViolationError` | Service attempts to mutate another owner's record. |
| `AuthorizationDeniedError` | Reserved for denied authorization paths. |
| `ValidationError` | Invalid command/configuration/model state. |

---

## 18. Logging

No logging framework was added.

Stage-1 records governance-significant outcomes as domain audit events through `AuditService`. Diagnostic logging remains a future technical concern and must not replace audit ownership.

---

## 19. Tests

| Test file | Type | Coverage |
|---|---|---|
| `tests/ftv/governance/test_ownership.py` | Unit | Ownership lookup, duplicate owner rejection, non-owner mutation rejection. |
| `tests/ftv/governance/test_rules.py` | Unit | Owner mutation allow, non-owner deny, admin non-authority deny. |
| `tests/ftv/governance/test_service_integration.py` | Integration | Service facade, relation grant/check, rule evaluation + audit, admin view config. |
| `tests/ftv/governance/test_smoke.py` | Smoke | Stage-1 service assembly builds and resolves key owners. |

Commands run:

```text
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.governance.test_ownership tests.ftv.governance.test_rules tests.ftv.governance.test_service_integration tests.ftv.governance.test_smoke
```

Result:

```text
Ran 10 tests
OK
```

Full test discovery:

```text
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest discover -s tests
```

Result:

```text
Ran 11 tests
OK (skipped=1)
```

---

## 20. Documentation

| File | Purpose |
|---|---|
| `build/stages/stage-1/README.md` | Stage-1 scope and validation command. |
| `build/stages/stage-1/MANUAL_VALIDATION.md` | Manual validation guide. |
| `build/stages/stage-1/ACCEPTANCE_CHECKLIST.md` | Stage-1 acceptance checklist. |
| `build/stages/STAGE-1_GOVERNANCE_OWNERSHIP_FOUNDATION.md` | Stage-1 implementation report. |

---

## 21. README cho Stage-1

README created at:

```text
build/stages/stage-1/README.md
```

It documents Stage-1 scope, out-of-scope boundaries, and validation command.

---

## 22. Known Limitations

| Limitation | Reason |
|---|---|
| In-memory adapters only | Stage-1 must not choose database/infrastructure. |
| No external OpenFGA/Directus runtime integration | Repository integration is conceptual/adapted at this stage; no runtime stack decision. |
| Authorization model is minimal | Stage-1 establishes relation concepts, not final policy engine implementation. |
| Admin view config is non-authoritative | Required by frozen ownership rules. |
| No Stage-2 source/asset behavior | Explicitly out of scope. |

---

## 23. Next Stage Dependency

Stage-2 can depend on Stage-1 for:

| Dependency | Provided by Stage-1 |
|---|---|
| Owner lookup | `OwnershipCatalog` |
| Rule evaluation | `LightweightBusinessRuleValidator` through `GovernanceService` |
| Audit event recording | `AuditService` through `GovernanceService` |
| Authorization relation check | `AuthorizationService` through `GovernanceService` |
| Admin non-authority policy | `CoreDataAdministrationPolicy` |

Stage-2 must not start until Stage-1 review confirmation.

---

## 24. Self Review Report

| Check | Result |
|---|---|
| Read Build Roadmap and Stage-1 scope | Pass |
| Correct services: FTV-SVC-09 and FTV-SVC-11 reference consumer only | Pass |
| Correct domains: Governance and Administration | Pass |
| Correct capabilities: CAP-09, CAP-10, CAP-11 | Pass |
| Correct components: FTV-COMP-021, 022, 024, 025, 026, 023 | Pass |
| Correct repositories: OpenFGA, Directus, Camunda/DataHub/OpenMetadata/Grafana reference roles only | Pass |
| No repository decision changed | Pass |
| No ownership changed | Pass |
| No bounded context changed | Pass |
| No architecture artifact changed | Pass |
| No Stage-2/Stage-3 code built | Pass |
| No framework/database/queue/storage/auth/deployment/infrastructure added | Pass |
| Tests passed | Pass |

---

## 25. Stage Status

READY FOR REVIEW

