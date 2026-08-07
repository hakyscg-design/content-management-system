# FTV_ARCHITECTURE_BLUEPRINT.md

**Project:** Football Troll Vault v2  
**Target:** FTV_MVP  
**Phase:** STEP-04 - Architecture Blueprint  
**Architecture type:** Logical architecture  
**Source artifacts:** `CANDIDATE_REPOSITORY_INDEX.md`, `FTV_COMPONENT_CATALOG.md`, `FTV_SERVICE_CATALOG.md`, `FTV_SYSTEM_ASSEMBLY.md`  
**Review date:** 2026-07-30  
**Status:** Draft for confirmation  

---

## 1. Architecture Overview

Football Troll Vault MVP is a manual-first, human-governed content vault and production system. Its logical architecture is organized around bounded domains that preserve single ownership of source, asset, content, publishing, review, performance, analytics, workflow, governance, and administration records.

This blueprint uses the frozen STEP-01, STEP-02, and STEP-03 artifacts as source of truth. It does not change component decisions, service boundaries, ownership, or capability mapping.

This blueprint is technology-neutral. It does not choose framework, language, database, queue, message broker, authentication technology, storage engine, deployment model, infrastructure, or implementation plan.

### 1.1 Architecture Goals

| Goal | Architectural response |
|---|---|
| Preserve provenance and rights | Source and asset records have a single authoritative owner and explicit governance checks. |
| Keep MVP manual-first | Human review, manual publishing, manual import fallback, and manual overrides remain first-class. |
| Avoid ownership drift | Each important entity belongs to exactly one bounded context and one owner service. |
| Support learning loop | Publishing references connect to performance imports and analytics reports without analytics owning production data. |
| Stay repository-neutral | Candidate repositories/components inform patterns only; no repository becomes architecture by itself. |

---

## 2. Overall Architecture

### 2.1 System Layers

| Layer | Responsibilities | Boundaries |
|---|---|---|
| Presentation | Human-facing screens, forms, dashboards, review views, admin views, manual action entry points. | Must not own business rules, authoritative records, or integration state. |
| Application | Coordinates commands, use cases, workflow steps, validation orchestration, and calls between domain services. | May call domain services and integration adapters; must not bypass domain ownership. |
| Domain | Owns business concepts, lifecycle rules, state transitions, ownership rules, and domain events. | Must not depend on presentation or infrastructure implementation details. |
| Integration | Handles cross-service contracts, event publication/consumption, command handoff, external/manual integration boundaries. | Must not own business records or mutate another domain's state directly. |
| Infrastructure | Provides persistence, file/media access, runtime support, logging transport, external adapter implementation. | Cannot own business logic, ownership rules, or domain lifecycle decisions. |
| External Systems | Manual source locations, manual publishing destinations, CSV/API metric sources, optional processing/runtime tools. | External systems are referenced through integration boundaries, not treated as owners. |

### 2.2 Allowed Dependencies

| Dependency | Rule |
|---|---|
| Presentation -> Application | Allowed for user actions and queries. |
| Application -> Domain | Allowed to execute use cases and domain commands. |
| Application -> Integration | Allowed for cross-service coordination and external/manual triggers. |
| Domain -> Domain events/contracts | Allowed through published events and owned commands. |
| Integration -> Infrastructure | Allowed for technical execution of accepted contracts. |
| Infrastructure -> External Systems | Allowed through adapters or manual channels. |
| Administration -> Owner services | Allowed as non-authoritative inspection/reference. |

### 2.3 Forbidden Dependencies

| Dependency | Reason |
|---|---|
| Domain -> Presentation | Prevents UI concerns from shaping business state. |
| Domain -> Infrastructure implementation | Preserves technology neutrality and replaceability. |
| Analytics -> direct Content mutation | Analytics may inform learning, but cannot rewrite content records. |
| Workflow -> direct domain state mutation without owner command | Workflow coordinates; owner service mutates. |
| Administration -> authoritative business record mutation without owner | Admin views are non-authoritative. |
| External System -> authoritative owner bypass | Prevents hidden integration and provenance loss. |
| Any service -> another service's record mutation | Maintains single owner. |

---

## 3. Architecture Domains

| Domain | Purpose | Responsibilities | Owned services | Owned entities | Inbound dependencies | Outbound dependencies |
|---|---|---|---|---|---|---|
| Source Domain | Capture and qualify external source references. | Source intake, source status, source-to-asset traceability. | FTV-SVC-01 | Source reference | Human operator; Governance | Asset Domain; Administration |
| Asset Domain | Manage asset registry, provenance, rights, duplicates. | Asset lifecycle, provenance, rights status, duplicate decision. | FTV-SVC-01 | Asset; Asset provenance; Rights status; Duplicate match | Source; Media; Review; Governance | Media; Content; Publishing; Review |
| Media Domain | Produce derivatives and metadata from assets. | Processing jobs, normalization, thumbnails, metadata, optional enrichment. | FTV-SVC-02 | Media processing job | Asset; Workflow; Governance | Asset; Content; Administration |
| Content Domain | Produce content packages from approved assets. | Briefs, content packages, versions, production state. | FTV-SVC-03 | Content brief; Content package; Content version | Asset; Review; Governance | Publishing; Review; Analytics |
| Publishing Domain | Prepare approved content for manual publishing. | Publishing package, metadata checklist, manual publishing reference. | FTV-SVC-04 | Publishing package | Content; Review; Governance | Performance; Review; Analytics |
| Review Domain | Own human review and approval gates. | Assignment, decision, approval state, rejection/override reason. | FTV-SVC-05 | Review assignment; Review decision; Approval status | Asset; Content; Publishing; Governance | Asset; Content; Publishing; Workflow |
| Performance Domain | Own imported and normalized performance data. | Import lifecycle, metric mapping, facts, metric definitions. | FTV-SVC-06 | Performance import; Performance fact; Metric definition | Publishing; Workflow; Governance | Analytics; Administration |
| Analytics Domain | Produce reports and learning summaries. | Dashboards/report definitions, narrative reports, learning outputs. | FTV-SVC-07 | Analytics report | Performance; Content; Publishing | Content learning references; Administration |
| Workflow Domain | Coordinate visible workflow runs. | Workflow run, triggers, retries, run status. | FTV-SVC-08 | Workflow run | Asset; Review; Performance; Governance | Media; Review; Performance |
| Governance Domain | Enforce authorization, rule checks, auditability. | Role, authorization relation, rule evaluation, audit event. | FTV-SVC-09 | User role; Authorization relation; Rule evaluation; Audit event | All governed services | All governed services |
| Administration Domain | Provide non-authoritative cross-domain visibility. | Admin view config, display metadata, inspection surfaces. | FTV-SVC-11 | Admin view configuration; schema/display metadata | All owner services | Human admins; owner service references |
| Reference Pattern Domain | Preserve reference-only patterns. | Reference notes only; no runtime ownership. | FTV-SVC-10 | None | Frozen artifacts | Later approved review only |

---

## 4. Bounded Contexts

| Bounded context | Owned entities | Shared/reference entities | Published events | Consumed events | Exposed commands | Consumed commands | Upstream contexts | Downstream contexts |
|---|---|---|---|---|---|---|---|---|
| Source & Asset Registry | Source reference; Asset; Asset provenance; Rights status; Duplicate match | Media processing job; Review decision; Rule evaluation | SourceReferenceCaptured; AssetRegistered; RightsStatusUpdated; DuplicateMatchRecorded; AssetReadyForProduction | MediaProcessingCompleted; DuplicateCandidateDetected; ReviewApproved; ReviewRejected; RuleViolationDetected | Capture Source Reference; Register Asset; Update Rights Status; Record Duplicate Decision | Start Media Processing; Evaluate Rule; Record Audit Event | Source; Media; Review; Governance | Media; Content; Publishing; Review |
| Media Processing | Media processing job | Asset; Workflow run; Audit event | MediaProcessingStarted; MediaProcessingCompleted; MediaProcessingFailed; ThumbnailGenerated; MetadataExtracted; DuplicateCandidateDetected | AssetRegistered; StartMediaProcessingRequested; WorkflowStarted; RetryRequested | Start Media Processing; Retry Media Processing; Generate Thumbnail; Extract Metadata | Update Asset Processing Result; Record Audit Event | Asset; Workflow; Governance | Asset; Content; Workflow |
| Content Production | Content brief; Content package; Content version | Asset; Rights status; Review decision; Analytics report | ContentBriefCreated; ContentPackageCreated; ContentVersionCreated; ContentReadyForReview | AssetReadyForProduction; ReviewRejected; ReviewApproved; RuleViolationDetected; LearningSummaryCreated | Create Content Brief; Create Content Package; Create Content Version; Mark Content Ready For Review | Request Review; Evaluate Rule; Record Audit Event | Asset; Review; Analytics; Governance | Publishing; Review; Analytics |
| Publishing Preparation | Publishing package | Content version; Approval status; Rights status; Performance import | PublishingPackageCreated; PublishingPackageReady; PublishingPackageBlocked; ManualPublishingCompleted | ReviewApproved; ContentPackageUpdated; RuleViolationDetected | Create Publishing Package; Update Publishing Metadata; Mark Publishing Package Ready; Mark Manual Publishing Complete | Request Publishing Review; Evaluate Rule; Record Audit Event | Content; Review; Asset; Governance | Review; Performance; Analytics |
| Human Review & Approval | Review assignment; Review decision; Approval status | Asset; Content version; Publishing package; Rule evaluation | ReviewRequested; ReviewAssigned; ReviewApproved; ReviewRejected; ApprovalStatusChanged; ManualOverrideRecorded | ContentReadyForReview; PublishingPackageReady; RuleViolationDetected; WorkflowFailed | Request Review; Assign Reviewer; Approve Package; Reject Package; Record Override | Evaluate Review Rules; Notify Workflow; Record Audit Event | Asset; Content; Publishing; Governance | Asset; Content; Publishing; Workflow |
| Performance Data | Performance import; Performance fact; Metric definition | Publishing package; Content package; Workflow run | PerformanceImportStarted; PerformanceImported; PerformanceImportFailed; MetricsNormalized; MetricMappingUpdated | ManualPublishingCompleted; ImportMetricsRequested; RetryRequested | Import Metrics; Import CSV; Import API Metrics; Map Metric; Normalize Metrics | Generate Report; Record Audit Event | Publishing; Workflow; Governance | Analytics |
| Analytics & Reporting | Analytics report | Performance fact; Metric definition; Content package; Publishing package | AnalyticsGenerated; AnalyticsGenerationFailed; LearningSummaryCreated | PerformanceImported; MetricsNormalized; GenerateReportRequested | Generate Report; Refresh Dashboard; Create Narrative Report; Record Learning Summary | Record Report Snapshot; Notify Content Production of Learning | Performance; Content; Publishing | Content |
| Workflow Orchestration | Workflow run | Target records owned by other contexts; Rule evaluation | WorkflowStarted; WorkflowStepCompleted; WorkflowCompleted; WorkflowFailed; RetryRequested | AssetRegistered; ReviewRequested; ReviewApproved; ImportMetricsRequested; RuleViolationDetected | Start Workflow; Trigger Processing; Trigger Import; Retry Workflow; Cancel Workflow | Start Media Processing; Request Review; Import Metrics; Evaluate Workflow Rules | Asset; Review; Performance; Governance | Media; Review; Performance |
| Governance & Rule | User role; Authorization relation; Rule evaluation; Audit event | Target records from all owner contexts | RuleEvaluationCompleted; RuleViolationDetected; AuthorizationRelationUpdated; AuditEventRecorded | Governed command request; ApprovalStatusChanged; RightsStatusUpdated; WorkflowFailed | Evaluate Rule; Check Authorization; Update User Role; Update Authorization Relation; Record Audit Event | Block Action; Request Manual Override; Notify Review | All governed contexts | All governed contexts |
| Core Data Administration | Admin view configuration; schema/display metadata | All owner records by reference | AdminViewUpdated; AdminRecordInspectionRequested | Owner service events; AuditEventRecorded | Configure Admin View; Inspect Record; Update Display Metadata | Redirect To Owner Service; Request Owner Record Update | All owner contexts | Human admins |
| Reference Pattern Library | None | Reference-only component notes | None | None | None | None | Frozen artifact context | Later approved architecture/design work |

---

## 5. Layer Interaction Rules

| Rule ID | Rule | Reason |
|---|---|---|
| LIR-01 | Presentation may call Application for commands and queries. | Keeps UI thin and use-case driven. |
| LIR-02 | Presentation must not mutate domain records directly. | Preserves ownership and validation. |
| LIR-03 | Application may coordinate multiple domain services through commands/events. | Supports system assembly without hiding owners. |
| LIR-04 | Application must route mutations to the authoritative owner service. | Prevents shared ownership. |
| LIR-05 | Domain owns lifecycle, validation, and business invariants. | Keeps core rules independent of tools. |
| LIR-06 | Domain must not call Presentation. | Avoids reverse dependency. |
| LIR-07 | Domain must not depend on infrastructure implementation details. | Maintains technology neutrality. |
| LIR-08 | Integration may translate commands/events/contracts between services. | Enables cross-service communication without ownership transfer. |
| LIR-09 | Integration must not own authoritative business records. | Prevents hidden ownership. |
| LIR-10 | Infrastructure may persist, transport, log, and connect externally. | Restricts infrastructure to technical concerns. |
| LIR-11 | Infrastructure cannot own business logic. | Keeps replacement possible. |
| LIR-12 | External systems cannot become authoritative owners inside FTV. | Preserves traceability and governance. |
| LIR-13 | Administration may inspect owner records by reference. | Supports CAP-10 without changing ownership. |
| LIR-14 | Administration must issue owner-service commands for mutation. | Prevents direct cross-domain writes. |

---

## 6. Dependency Rules

### 6.1 Allowed Domain Dependencies

| Dependency | Allowed reason |
|---|---|
| Content -> Asset | Content packages need approved asset references and rights context. |
| Publishing -> Content | Publishing packages are prepared from approved content versions. |
| Publishing -> Review | Publishing readiness depends on approval status. |
| Review -> Asset/Content/Publishing | Review targets and context come from owner domains. |
| Media -> Asset | Processing requires registered asset/media references. |
| Asset -> Media | Asset registry consumes processing results and duplicate candidates. |
| Performance -> Publishing | Performance imports need manual publishing references. |
| Analytics -> Performance | Reports depend on performance facts and metric definitions. |
| Content -> Analytics | Future briefs may reference learning summaries, not mutate reports. |
| Workflow -> Target domains | Workflow coordinates commands, but target domains own mutation. |
| Governance -> All governed domains | Rule, authorization, and audit are cross-cutting checks. |
| Administration -> All owner domains | Admin visibility references owner records without ownership. |

### 6.2 Forbidden Domain Dependencies

| Dependency | Forbidden reason |
|---|---|
| Analytics -> Content mutation | Prevents reports from rewriting production records. |
| Performance -> Publishing mutation | Performance may reference publishing package, not alter it. |
| Workflow -> direct data writes | Workflow owns run state only. |
| Administration -> direct business writes | Admin surfaces are non-authoritative. |
| Media -> Rights status mutation | Media processing cannot decide rights. |
| Publishing -> Content version mutation | Publishing references approved content versions only. |
| Review -> Content version mutation | Review records decision; content owner handles rework/versioning. |
| External Systems -> owner records | External data must enter through owner service commands/imports. |

### 6.3 Circular Dependency Guard

Dependency cycles are avoided by separating command direction from ownership:

| Potential cycle | Guard |
|---|---|
| Asset <-> Media | Asset owns asset state; Media owns job state. Results return by event/contract. |
| Content <-> Review | Content owns package/version; Review owns decision/approval. Rework creates owner-side transition. |
| Publishing <-> Performance | Publishing owns package/manual posting reference; Performance owns imports/facts. |
| Workflow <-> Target services | Workflow owns runs only; target services own state changes. |
| Governance <-> All services | Governance evaluates/checks and audits; target owner changes target state. |

---

## 7. Integration Architecture

| Integration type | Interaction style | Ownership | Responsibilities |
|---|---|---|---|
| Internal Integration | Commands, events, queries, owner-service contracts. | Authoritative owner remains unchanged. | Coordinate services, preserve state boundaries, expose errors. |
| External Integration | Manual source references, external publishing references, CSV/API metric inputs, media/runtime tools. | FTV owner service owns internal record after intake/import. | Validate external data, capture provenance, avoid hidden writes. |
| Human Integration | Forms, review actions, manual overrides, manual publishing confirmation. | Human action recorded by owner service and audited by Governance. | Keep manual-first control and traceability. |
| Manual Integration | Spreadsheet/folder/manual command fallback. | Owner service remains conceptual owner even in fallback. | Preserve operations when automation/tooling is unavailable. |
| Automation Integration | Workflow run triggers, scheduled candidates, retry coordination. | Workflow owns run; target owner owns domain mutation. | Automate coordination only where MVP allows. |

---

## 8. Communication Patterns

| Pattern | When to use | Architectural rule |
|---|---|---|
| Command | A user/service asks an owner service to change state. | Receiver must be authoritative owner of changed record. |
| Event | State has changed and other contexts need to react. | Event is emitted after owner state changes. |
| Query | A service/view needs non-mutating data. | Query must not create hidden ownership or mutation. |
| Manual Trigger | Human starts a task, import, processing job, workflow, or review. | Trigger records actor and target. |
| Scheduled Trigger | Optional repeated import/processing workflow. | Schedule triggers workflow or owner command; it does not own records. |
| Human Approval | A gated transition requires reviewer/approver decision. | Approval status is owned by Review context. |
| State Synchronization | Non-authoritative admin/report views need updated references. | Owner remains source of truth; stale views must be repairable. |
| Manual Override | Human bypasses a block with reason. | Must be authorized, reasoned, and audited. |

---

## 9. Domain Boundaries

| Entity group | Owner | Mutation rules | Reference rules | Lifecycle owner |
|---|---|---|---|---|
| Asset | FTV-SVC-01 | Mutated only by Source & Asset Registry commands. | Other domains reference by asset ID and derivative/provenance refs. | FTV-SVC-01 |
| Content | FTV-SVC-03 | Content brief/package/version mutated only by Content Production. | Publishing, Review, Analytics reference content IDs/version IDs. | FTV-SVC-03 |
| Publishing | FTV-SVC-04 | Publishing package mutated only by Publishing Preparation. | Performance and Analytics reference publishing package/manual post refs. | FTV-SVC-04 |
| Review | FTV-SVC-05 | Review assignment/decision/approval status mutated only by Human Review. | Asset, Content, Publishing, Workflow reference approval status. | FTV-SVC-05 |
| Performance | FTV-SVC-06 | Imports, facts, metric definitions mutated only by Performance Data. | Analytics queries facts/metrics; Content references learning indirectly. | FTV-SVC-06 |
| Analytics | FTV-SVC-07 | Reports and learning summaries mutated only by Analytics & Reporting. | Content references report/learning IDs; Analytics cannot mutate content. | FTV-SVC-07 |
| Workflow | FTV-SVC-08 | Workflow runs mutated only by Workflow Orchestration. | Services reference run IDs/status; target state changes remain with target owners. | FTV-SVC-08 |
| Rule | FTV-SVC-09 | Rule evaluations created by Governance & Rule. | Requesting services consume allow/deny/reason. | FTV-SVC-09 |
| Audit | FTV-SVC-09 | Audit events recorded by Governance & Rule. | All services may emit/request audit event recording. | FTV-SVC-09 |
| User | FTV-SVC-09 | User role/relation state is governed by Governance & Rule in this blueprint. | Services reference actor/user IDs for authorization/audit. | FTV-SVC-09 |
| Role | FTV-SVC-09 | Roles assigned/revoked through Governance commands. | All governed services reference roles through rule checks. | FTV-SVC-09 |
| Authorization | FTV-SVC-09 | Authorization relations updated through Governance commands. | Owner domains ask for checks; they do not own relations. | FTV-SVC-09 |
| Administration metadata | FTV-SVC-11 | Admin view/display metadata mutated by Core Data Administration. | Admin views reference owner records only. | FTV-SVC-11 |

---

## 10. Cross-Cutting Concerns

| Concern | Architectural rule |
|---|---|
| Authorization | Governed actions request authorization/rule checks from Governance & Rule before mutation where required. |
| Audit | Important state changes and overrides produce audit events after state decision. |
| Logging | Logs support diagnosis, but audit events remain the authoritative compliance trace. |
| Configuration | Configuration must not redefine ownership or bypass rule checks. |
| Versioning | Content versions are owned by Content Production; record/version visibility may be referenced by admin/review patterns. |
| Validation | Owner service validates state transitions and required fields before mutation. |
| Error Handling | Failed commands return explicit failure state; events are emitted only for accepted state changes or failure records. |
| Observability | Workflow runs, processing jobs, imports, analytics generation, and audit events expose operational status without changing ownership. |
| Manual Override | Override requires human actor, authority, reason, target, and audit event. |
| Recovery | Recovery preserves original owner and prior state; manual fallback must record reconciliation notes. |

---

## 11. Architectural Principles

| Principle | Explanation |
|---|---|
| Single Source of Truth | Each domain record has exactly one authoritative owner. |
| Single Owner | Only the owner service mutates a record's lifecycle state. |
| Manual-first MVP | Manual capture, review, publishing, import correction, and fallback are normal operating paths. |
| Human Governed | Automated support cannot bypass required human approval or rights checks. |
| Reference by ID | Cross-domain relationships use stable references, not shared ownership. |
| Immutable Audit | Audit records are append-oriented and owned by Governance & Rule. |
| Event after State | Events describe accepted state changes or recorded failures after the owner handles them. |
| No Shared Ownership | Display/admin/reporting contexts may reference data but do not co-own it. |
| Layer Isolation | Presentation, domain, integration, and infrastructure responsibilities stay separate. |
| Dependency Direction | Higher-level business rules do not depend on technical implementation details. |
| Conservative Failure | If governance or rights checks are unavailable, unsafe actions default to blocked/manual review. |
| Repository Neutrality | Candidate repositories inform patterns; architecture remains independent of any repository product shape. |

---

## 12. Architecture Constraints

| Constraint | Meaning |
|---|---|
| No circular dependency | Domain dependencies must be unidirectional or mediated by events/contracts with clear owner. |
| No repository dependency | No repository is treated as the architecture boundary or service name. |
| No service duplication | Frozen STEP-02 service catalog remains the service set. |
| No multiple owners | A domain entity cannot have more than one authoritative owner. |
| No hidden integration | External/manual inputs enter through owner services and are traceable. |
| No business logic in infrastructure | Infrastructure supports execution only. |
| No direct analytics writes | Analytics cannot mutate performance facts or production records. |
| No workflow-owned target state | Workflow owns runs, not domain records. |
| No admin-owned business records | Administration owns views/configuration, not domain records. |
| No autonomous publishing in MVP | Publishing remains manual and human-recorded. |
| No technology binding | Blueprint must not pick framework, language, database, queue, broker, storage, or auth technology. |

---

## 13. Architecture Decisions

| ADR ID | Decision | Reason | Alternatives | Consequences |
|---|---|---|---|---|
| ADR-001 | Use service-oriented logical architecture. | Frozen STEP-02 services have clear business/technical responsibilities. | Single undifferentiated application; repository-as-platform. | Clear ownership and contracts; implementation can still be technology-neutral. |
| ADR-002 | Use bounded contexts aligned to service ownership. | Prevents record duplication and ownership drift. | Shared data model across all services. | More explicit contracts; less hidden coupling. |
| ADR-003 | Keep manual publishing. | Target constraints forbid autonomous posting and prioritize human governance. | Automated publishing connectors. | Publishing package records manual completion and platform refs. |
| ADR-004 | Make human review authoritative for approval status. | MVP requires human-governed gates. | Approval embedded in content/publishing records. | Review owns decisions; content/publishing reference them. |
| ADR-005 | Use workflow orchestration only for coordination. | Avoids workflow engine becoming domain owner. | Workflow owns business state. | Run history is separate from target state. |
| ADR-006 | Use event-driven interaction for state notifications. | STEP-03 defines events as owner-produced state notifications. | Direct polling only. | Consumers react without mutating owner records. |
| ADR-007 | Use commands for mutations. | Commands make owner boundaries explicit. | Shared writes or hidden data sync. | Each mutation has receiver/owner and failure handling. |
| ADR-008 | Keep Governance & Rule as cross-cutting owner of roles, authorization, rule evaluation, audit. | Centralizes policy while leaving target records with domain owners. | Each domain owns its own policy records. | Stronger consistency; risk of over-centralization managed by manual fallback. |
| ADR-009 | Keep Analytics read-oriented. | Analytics supports learning, not production state mutation. | Analytics writes back into content automatically. | Learning summaries are referenced by humans/content production. |
| ADR-010 | Keep Core Data Administration non-authoritative. | CAP-10 needs visibility without violating owner rules. | Shared admin service owns all records. | Admin can inspect/configure views but must route mutation to owners. |

---

## 14. Extension Points

| Extension point | Where it attaches | MVP impact rule |
|---|---|---|
| AI assistance | Content Production, Analytics, Review support | Must suggest, not auto-approve or auto-publish. |
| OCR/STT | Media Processing internal module | Optional enrichment; asset can operate without it. |
| Scheduling | Workflow Orchestration | Must coordinate owner commands, not own state. |
| External connectors | Source & Asset Registry; Performance Data | Must preserve provenance/import ownership and manual fallback. |
| Automation | Workflow Orchestration | Must not bypass review/governance gates. |
| Multi-platform publishing metadata | Publishing Preparation | Adds fields/checklists; manual publishing remains. |
| Notifications | Workflow/Review | Notify humans; no implicit approval. |
| Search | Asset/Content/Admin views | Search references owner records; does not own data. |
| Recommendation | Analytics/Content | Produces suggestions/learning, not automatic content mutation. |
| Advanced governance lineage | Governance/Admin/Reference Pattern Library | Adds vocabulary/lineage references without changing MVP owners. |

---

## 15. Architecture Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Coupling between content, review, and publishing | State changes may become tangled. | Keep Content, Review, and Publishing owners separate; use commands/events. |
| Ownership drift through admin views | Admin service could become de facto owner. | Admin owns only view metadata; owner commands required for mutation. |
| Workflow complexity | Automation may obscure manual responsibility. | Workflow owns run state only and supports manual fallback. |
| Governance bottleneck | Central checks could slow operation. | Manual conservative fallback and explicit override/audit path. |
| Repository replacement | Candidate components may fail license/fit checks. | Architecture remains repository-neutral and pattern-based. |
| Licensing constraints | Direct reuse may be blocked. | Keep affected components as ADAPT/REFERENCE ONLY per STEP-01. |
| Scaling pressure | Media/import/report jobs may grow unevenly. | Logical services isolate lifecycles without deciding deployment topology. |
| Observability gaps | Failures may be hard to trace. | Workflow runs, job/import states, and audit events expose state. |
| Manual publishing data loss | Performance loop depends on humans recording post refs. | Publishing package lifecycle requires manual publishing completion reference. |
| Analytics overreach | Reports may be treated as automatic decisions. | Analytics remains read-oriented and human-reviewed. |

---

## 16. Future Evolution

This section describes direction only. It is not a roadmap, milestone plan, sprint plan, or implementation plan.

| Horizon | Evolution theme |
|---|---|
| MVP | Manual-first asset intake, content production, review, publishing prep, performance import, analytics, governance, and admin visibility. |
| Phase-2 | More reliable connectors, richer media enrichment, stronger metric mapping, notifications, and expanded dashboards while preserving owners. |
| Phase-3 | More automation around scheduled imports, richer search/recommendation, improved governance vocabulary, and broader multi-platform support. |
| Long-term | Mature content intelligence loop, deeper lineage, advanced policy automation, and stronger operational scalability without changing core ownership principles. |

---

## 17. Layer Summary

| Layer | Summary |
|---|---|
| Presentation | Human-facing views and manual action surfaces only. |
| Application | Coordinates use cases and owner-service commands. |
| Domain | Owns business rules, state transitions, entities, and events. |
| Integration | Manages contracts, command/event handoff, external/manual boundaries. |
| Infrastructure | Technical execution and persistence support without business logic. |
| External Systems | Non-authoritative sources, publishing destinations, media/runtime and metric sources. |

---

## 18. Domain Summary

| Domain | Owner service |
|---|---|
| Source Domain | FTV-SVC-01 |
| Asset Domain | FTV-SVC-01 |
| Media Domain | FTV-SVC-02 |
| Content Domain | FTV-SVC-03 |
| Publishing Domain | FTV-SVC-04 |
| Review Domain | FTV-SVC-05 |
| Performance Domain | FTV-SVC-06 |
| Analytics Domain | FTV-SVC-07 |
| Workflow Domain | FTV-SVC-08 |
| Governance Domain | FTV-SVC-09 |
| Administration Domain | FTV-SVC-11 |
| Reference Pattern Domain | FTV-SVC-10 |

---

## 19. Bounded Context Summary

| Bounded context | Primary owner | Mutation authority |
|---|---|---|
| Source & Asset Registry | FTV-SVC-01 | Source, asset, provenance, rights, duplicate records. |
| Media Processing | FTV-SVC-02 | Media processing jobs. |
| Content Production | FTV-SVC-03 | Briefs, packages, versions. |
| Publishing Preparation | FTV-SVC-04 | Publishing packages. |
| Human Review & Approval | FTV-SVC-05 | Review assignments, decisions, approval status. |
| Performance Data | FTV-SVC-06 | Imports, facts, metric definitions. |
| Analytics & Reporting | FTV-SVC-07 | Analytics reports and learning summaries. |
| Workflow Orchestration | FTV-SVC-08 | Workflow runs. |
| Governance & Rule | FTV-SVC-09 | Roles, relations, rules, audit events. |
| Core Data Administration | FTV-SVC-11 | Admin view/display metadata only. |
| Reference Pattern Library | FTV-SVC-10 | No runtime mutation authority. |

---

## 20. Dependency Rules Summary

| Rule area | Summary |
|---|---|
| Allowed | Dependencies follow owner references, commands, events, and read-only queries. |
| Forbidden | No direct mutation of another owner's records; no analytics/admin/workflow ownership bypass. |
| Cycle prevention | Bidirectional business collaboration is mediated by separate ownership and events/contracts. |

---

## 21. Integration Summary

| Integration type | Summary |
|---|---|
| Internal | Commands/events/contracts between owner services. |
| External | Manual source/publishing/metric/media integrations enter through owner services. |
| Human | Review, approval, override, publishing, import correction are explicit human actions. |
| Manual | Spreadsheet/folder/manual-command fallback preserves conceptual owners. |
| Automation | Coordinates tasks but does not replace owner state or human gates. |

---

## 22. Communication Summary

| Pattern | Summary |
|---|---|
| Command | Request owner mutation. |
| Event | Notify after state change/failure record. |
| Query | Read without ownership transfer. |
| Manual Trigger | Human starts or resumes a process. |
| Scheduled Trigger | Optional workflow/import/processing trigger. |
| Human Approval | Review-owned gate. |
| State Synchronization | Non-authoritative projections/views. |
| Manual Override | Authorized, reasoned, audited exception. |

---

## 23. Architectural Principles

See Section 11 for the canonical principle list. The highest-priority principles are:

| Principle | Summary |
|---|---|
| Single Owner | One owner per record. |
| Manual-first MVP | Manual path is always valid. |
| Human Governed | Review and override remain human-controlled. |
| Event after State | Events do not precede owner state changes. |
| Repository Neutrality | Repositories are candidates, not architecture boundaries. |

---

## 24. Architecture Constraints

See Section 12 for the canonical constraint list. The most important constraints are:

| Constraint | Summary |
|---|---|
| No circular dependency | Dependencies must not create unowned cycles. |
| No multiple owners | Shared ownership is forbidden. |
| No hidden integration | External/manual data must be traceable. |
| No direct analytics writes | Analytics is read/report oriented. |
| No autonomous publishing | MVP publishing remains manual. |
| No technology binding | Blueprint stays technology-neutral. |

---

## 25. Architecture Decisions

See Section 13 for ADR-style decisions. The key decisions are:

| Decision | Summary |
|---|---|
| Service-oriented logical architecture | Use frozen service responsibilities as logical architecture units. |
| Bounded contexts | Align mutation authority with owner contexts. |
| Manual publishing | Publishing remains human-managed. |
| Human review | Approval status belongs to Review. |
| Workflow orchestration | Workflow coordinates only. |
| Event-driven interaction | Events notify downstream consumers after state changes. |
| Governance | Governance owns roles, relations, rule evaluations, and audit. |

---

## 26. Extension Points

See Section 14 for full list. Extension points are allowed only if they preserve MVP ownership and manual governance.

---

## 27. Risk Summary

| Risk area | Summary |
|---|---|
| Coupling | Managed through owner commands/events. |
| Ownership drift | Managed through single owner and admin non-authority. |
| Workflow complexity | Managed by workflow-run-only ownership. |
| Governance | Managed by conservative/manual fallback. |
| Repository replacement | Managed by repository-neutral architecture. |
| Licensing | Managed by preserving STEP-01 decisions. |
| Scaling | Logical service boundaries isolate lifecycles without deployment decisions. |
| Observability | Managed through jobs, imports, workflow runs, and audit events. |

---

## 28. Future Evolution Summary

| Horizon | Summary |
|---|---|
| MVP | Manual-first governed vault-to-publishing-to-learning loop. |
| Phase-2 | More connectors, enrichment, notifications, metric mapping, dashboards. |
| Phase-3 | More automation, search/recommendation, governance vocabulary, multi-platform support. |
| Long-term | Mature content intelligence and governance without abandoning single-owner architecture. |

---

## 29. Self Review

| Check | Result |
|---|---|
| Used only frozen source artifacts | Pass |
| Did not edit frozen artifacts | Pass |
| Did not add repository | Pass |
| Did not change ownership | Pass |
| Did not change service catalog | Pass |
| Did not change capability mapping | Pass |
| No dependency cycle introduced | Pass |
| Every domain has owner | Pass |
| Every layer has responsibility | Pass |
| Every service is placed in a domain | Pass |
| Every major entity belongs to a bounded context | Pass |
| Interactions follow layer rules | Pass |
| Extension points do not affect MVP | Pass |
| No Build Roadmap, Sprint Plan, Task List, or Milestones created | Pass |
| No Database Schema, API Specification, OpenAPI, GraphQL, Event Schema, Sequence Diagram, C4 Diagram, Deployment Diagram, Kubernetes, Docker, Cloud Architecture, Infrastructure Design, CI/CD, or code created | Pass |
| No framework, language, database, queue, broker, auth technology, or storage engine selected | Pass |

---

## 30. Stop Point

This file is ready for review as the STEP-04 Architecture Blueprint artifact.

No Build Roadmap, Implementation Plan, code, deployment design, infrastructure design, database schema, API specification, event schema, or technology selection has been created.

