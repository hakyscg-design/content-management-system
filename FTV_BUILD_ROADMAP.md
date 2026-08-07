# FTV_BUILD_ROADMAP.md

**Project:** Football Troll Vault v2  
**Target:** FTV_MVP  
**Phase:** STEP-05 - Build Roadmap  
**Source artifacts:** `CANDIDATE_REPOSITORY_INDEX.md`, `FTV_COMPONENT_CATALOG.md`, `FTV_SERVICE_CATALOG.md`, `FTV_SYSTEM_ASSEMBLY.md`, `FTV_ARCHITECTURE_BLUEPRINT.md`  
**Review date:** 2026-07-30  
**Status:** Draft for confirmation  

---

## 1. Roadmap Summary

This roadmap translates the frozen logical architecture into a technology-neutral MVP build sequence.

This is **not** architecture, implementation, code, sprint backlog, database schema, API design, UI design, deployment plan, CI/CD plan, infrastructure design, Docker/Kubernetes plan, cloud architecture, or implementation detail.

The roadmap does not change frozen services, ownership, bounded contexts, domains, repositories, components, or capability mappings.

### 1.1 Build Philosophy

| Philosophy | Meaning for FTV MVP |
|---|---|
| MVP-first | Build only the smallest complete vault-to-publishing-to-learning loop. |
| Manual-first | Manual intake, review, publishing, import correction, and fallback remain valid paths. |
| Human-governed | Humans approve rights, reviews, overrides, and publishing readiness. |
| Repository-first | Use selected repository/component findings as input before creating internal modules. |
| Stable Core before Features | Owner records, lifecycle rules, and governance precede convenience features. |
| Build in Dependency Order | Build owners before consumers and state before automation. |
| Testable Increment | Each stage ends with observable deliverables and acceptance checks. |
| No premature optimization | Scaling, deployment topology, and infrastructure optimization are deferred. |

### 1.2 Build Strategy

| Strategy | Application |
|---|---|
| Build Order | Governance and ownership foundation first, then source/asset, processing, content, review, publishing, performance, analytics, workflow, administration, production readiness. |
| Dependency-first | A stage starts only when required owner records and upstream states are stable. |
| Core before Edge | Core lifecycle and manual flows come before enrichment, automation, and admin convenience. |
| Infrastructure last | Infrastructure choices are not made here; runtime hardening belongs after logical flow is stable. |
| Replaceability | Repository-derived components remain replaceable behind service/domain responsibilities. |
| Small Deliverables | Each stage produces a bounded, reviewable capability slice. |

---

## 2. Build Stages

### Stage-0 - Roadmap Baseline

| Field | Definition |
|---|---|
| Purpose | Confirm frozen artifacts, roadmap scope, and non-goals before build begins. |
| Services | All services by reference only. |
| Domains | All domains by reference only. |
| Capabilities | CAP-01 through CAP-12 by traceability only. |
| Components | All FTV components by reference only. |
| Repositories involved | All candidate repositories by inventory only. |
| Prerequisites | STEP-01 through STEP-04 frozen. |
| Dependencies | None. |
| Deliverables | Build roadmap baseline; freeze-point policy; traceability to frozen artifacts. |
| Acceptance Criteria | Frozen artifact list confirmed; no architecture/service/ownership changes introduced. |
| Exit Criteria | Roadmap approved for build planning handoff. |
| Risks | Roadmap drift into implementation detail. |
| Out of Scope | Code, schemas, APIs, deployment, task breakdown. |

### Stage-1 - Governance & Ownership Foundation

| Field | Definition |
|---|---|
| Purpose | Establish single-owner rules, authorization/rule/audit concepts, and domain lifecycle guardrails. |
| Services | FTV-SVC-09 Governance & Rule; FTV-SVC-11 Core Data Administration as reference consumer. |
| Domains | Governance Domain; Administration Domain. |
| Capabilities | CAP-09, CAP-10, CAP-11. |
| Components | FTV-COMP-021; FTV-COMP-022; FTV-COMP-024; FTV-COMP-025; FTV-COMP-026; FTV-COMP-023. |
| Repositories involved | OpenFGA; Directus; Camunda reference; DataHub reference; OpenMetadata reference; Grafana reference. |
| Prerequisites | Stage-0. |
| Dependencies | Stage-0. |
| Deliverables | Ownership rule baseline; role/relation/rule/audit lifecycle baseline; admin non-authority policy. |
| Acceptance Criteria | Each governed record has one owner; rule evaluation and audit concepts are available to later stages. |
| Exit Criteria | Later stages can request rule/authorization/audit checks without changing ownership. |
| Risks | Governance becomes too heavy for MVP. |
| Out of Scope | Auth technology, policy engine implementation, database/security schema. |

### Stage-2 - Source Intake Foundation

| Field | Definition |
|---|---|
| Purpose | Build manual approved source capture and source-to-asset traceability foundation. |
| Services | FTV-SVC-01 Source & Asset Registry; FTV-SVC-09 Governance & Rule. |
| Domains | Source Domain; Asset Domain; Governance Domain. |
| Capabilities | CAP-01, CAP-02, CAP-11. |
| Components | FTV-COMP-001; FTV-COMP-002; FTV-COMP-004. |
| Repositories involved | ResourceSpace; Directus as admin/reference pattern. |
| Prerequisites | Stage-1. |
| Dependencies | Stage-1. |
| Deliverables | Source reference flow; provenance capture; rights status baseline; manual source acquisition module candidate. |
| Acceptance Criteria | A source reference can be captured, linked to provenance, and held in a rights-known or rights-pending state. |
| Exit Criteria | Asset registration can rely on source/provenance records. |
| Risks | ResourceSpace license/module uncertainty. |
| Out of Scope | Automated source discovery/download connectors. |

### Stage-3 - Asset Registry & Duplicate Control

| Field | Definition |
|---|---|
| Purpose | Establish asset records, lifecycle, rights use checks, and duplicate-match handling. |
| Services | FTV-SVC-01; FTV-SVC-09. |
| Domains | Asset Domain; Governance Domain. |
| Capabilities | CAP-02. |
| Components | FTV-COMP-003; FTV-COMP-004; FTV-COMP-005. |
| Repositories involved | ResourceSpace; LibrePhotos; Immich reference; PhotoPrism reference; Nextcloud rejected; Stalwart rejected. |
| Prerequisites | Stage-2. |
| Dependencies | Stage-1; Stage-2. |
| Deliverables | Asset registry; rights status transitions; duplicate match records; manual duplicate resolution. |
| Acceptance Criteria | Registered assets have provenance, rights status, duplicate state, and clear ready/blocked status. |
| Exit Criteria | Media processing can accept registered asset references. |
| Risks | Duplicate logic may be too broad if copied from larger photo systems. |
| Out of Scope | Full DAM platform adoption; broad ML asset search. |

### Stage-4 - Media Processing Slice

| Field | Definition |
|---|---|
| Purpose | Add processing job lifecycle and minimal media derivative/enrichment responsibilities. |
| Services | FTV-SVC-02 Media Processing; FTV-SVC-01; FTV-SVC-08 as optional trigger; FTV-SVC-09. |
| Domains | Media Domain; Asset Domain; Workflow Domain; Governance Domain. |
| Capabilities | CAP-03; supporting CAP-02 and CAP-08. |
| Components | FTV-COMP-005; FTV-COMP-006; FTV-COMP-007; FTV-COMP-008; FTV-COMP-020. |
| Repositories involved | LibrePhotos; PhotoPrism reference; ResourceSpace OCR/STT reference; Kestra. |
| Prerequisites | Stage-3. |
| Dependencies | Stage-1; Stage-3. |
| Deliverables | Media processing job lifecycle; FFmpeg/media normalization module candidate; thumbnail generation; metadata extraction; optional OCR/STT placeholder. |
| Acceptance Criteria | Asset processing can complete/fail/retry manually; output can be recorded back to asset owner. |
| Exit Criteria | Content production can reference ready assets and media derivatives. |
| Risks | PhotoPrism AGPL limits direct reuse; media wrapper may become custom work. |
| Out of Scope | Full media library/indexing platform; mandatory OCR/STT. |

### Stage-5 - Content Production Core

| Field | Definition |
|---|---|
| Purpose | Build content brief, content package, and content version flow from approved assets. |
| Services | FTV-SVC-03 Content Production; FTV-SVC-01; FTV-SVC-09. |
| Domains | Content Domain; Asset Domain; Governance Domain. |
| Capabilities | CAP-04. |
| Components | FTV-COMP-009; FTV-COMP-010; FTV-COMP-011. |
| Repositories involved | Payload; AppFlowy reference; Strapi reference. |
| Prerequisites | Stage-4. |
| Dependencies | Stage-1; Stage-3; Stage-4. |
| Deliverables | Content brief flow; package/version lifecycle; review-ready state. |
| Acceptance Criteria | A content package can be created from ready assets and versioned before review. |
| Exit Criteria | Human review can receive content review targets. |
| Risks | Payload/Directus boundary confusion. |
| Out of Scope | Full workspace/collaboration platform; AI content generation. |

### Stage-6 - Human Review & Approval

| Field | Definition |
|---|---|
| Purpose | Add authoritative review assignment, decision, and approval status gates. |
| Services | FTV-SVC-05 Human Review & Approval; FTV-SVC-03; FTV-SVC-04; FTV-SVC-09. |
| Domains | Review Domain; Content Domain; Publishing Domain; Governance Domain. |
| Capabilities | CAP-12; supporting CAP-05 and CAP-11. |
| Components | FTV-COMP-013; FTV-COMP-024; FTV-COMP-027; FTV-COMP-028. |
| Repositories involved | Directus; Payload; AppFlowy reference; Camunda reference. |
| Prerequisites | Stage-5. |
| Dependencies | Stage-1; Stage-5. |
| Deliverables | Review assignment; approval status lifecycle; approve/reject/override concepts; review manual fallback. |
| Acceptance Criteria | Content review target can move requested -> assigned -> approved/rejected with owner/audit clarity. |
| Exit Criteria | Publishing preparation can consume approval status. |
| Risks | Directus license boundary; review workflow may overfit to platform. |
| Out of Scope | BPMN/user-task engine adoption. |

### Stage-7 - Publishing Preparation

| Field | Definition |
|---|---|
| Purpose | Prepare approved content for human-managed publishing with checklist and metadata. |
| Services | FTV-SVC-04 Publishing Preparation; FTV-SVC-05; FTV-SVC-09. |
| Domains | Publishing Domain; Review Domain; Governance Domain. |
| Capabilities | CAP-05. |
| Components | FTV-COMP-012; FTV-COMP-013; FTV-COMP-014. |
| Repositories involved | Ghost; Payload; Penpot reference; Strapi reference. |
| Prerequisites | Stage-6. |
| Dependencies | Stage-1; Stage-5; Stage-6. |
| Deliverables | Publishing package; publishing checklist; manual publishing completion reference; publishing package builder module. |
| Acceptance Criteria | Approved content can become a publishing package and be marked ready/completed manually. |
| Exit Criteria | Performance import can reference manual publishing output. |
| Risks | Scope creep into autonomous publishing. |
| Out of Scope | Automated posting, credential handling, platform posting API implementation. |

### Stage-8 - Performance Import & Metric Normalization

| Field | Definition |
|---|---|
| Purpose | Capture manually published performance data and normalize it into performance facts. |
| Services | FTV-SVC-06 Performance Data; FTV-SVC-04; FTV-SVC-08 optional trigger; FTV-SVC-09. |
| Domains | Performance Domain; Publishing Domain; Workflow Domain; Governance Domain. |
| Capabilities | CAP-06. |
| Components | FTV-COMP-015; FTV-COMP-016; FTV-COMP-020. |
| Repositories involved | Directus; PostHog reference; Kestra. |
| Prerequisites | Stage-7. |
| Dependencies | Stage-1; Stage-7. |
| Deliverables | Performance import lifecycle; CSV import module; API import candidate; metric mapping; metric normalization. |
| Acceptance Criteria | A manual/CSV import can create normalized performance facts tied to publishing/content references. |
| Exit Criteria | Analytics can consume facts and metric definitions. |
| Risks | Platform metrics are inconsistent; Directus verification may affect staging. |
| Out of Scope | Full product analytics platform; autonomous API connector implementation. |

### Stage-9 - Analytics & Learning

| Field | Definition |
|---|---|
| Purpose | Generate reports and learning summaries from performance facts. |
| Services | FTV-SVC-07 Analytics & Reporting; FTV-SVC-06; FTV-SVC-03. |
| Domains | Analytics Domain; Performance Domain; Content Domain. |
| Capabilities | CAP-07. |
| Components | FTV-COMP-016; FTV-COMP-017; FTV-COMP-018. |
| Repositories involved | Metabase; Evidence; PostHog reference; Superset reference; Grafana reference; Lightdash reference. |
| Prerequisites | Stage-8. |
| Dependencies | Stage-8. |
| Deliverables | Dashboard/report pattern; narrative performance report; learning summary link back to content. |
| Acceptance Criteria | Imported metrics can produce an analytics report and learning summary without mutating content records. |
| Exit Criteria | MVP learning loop is demonstrable. |
| Risks | Metabase AGPL/commercial boundary; analytics may overreach into production decisions. |
| Out of Scope | Automated recommendation engine; advanced BI semantic layer. |

### Stage-10 - Workflow Coordination

| Field | Definition |
|---|---|
| Purpose | Add workflow run visibility, manual triggers, optional scheduled triggers, and retry coordination. |
| Services | FTV-SVC-08 Workflow Orchestration; FTV-SVC-02; FTV-SVC-05; FTV-SVC-06; FTV-SVC-09. |
| Domains | Workflow Domain; Media Domain; Review Domain; Performance Domain; Governance Domain. |
| Capabilities | CAP-08. |
| Components | FTV-COMP-019; FTV-COMP-020; FTV-COMP-022. |
| Repositories involved | Activepieces; Kestra; Camunda reference; n8n rejected; Temporal rejected. |
| Prerequisites | Stage-4; Stage-6; Stage-8. |
| Dependencies | Stage-1; Stage-4; Stage-6; Stage-8. |
| Deliverables | Workflow run lifecycle; manual trigger flow; retry/failure visibility; optional scheduled trigger boundary. |
| Acceptance Criteria | Workflow runs can coordinate processing/review/import without owning target states. |
| Exit Criteria | Manual operations remain valid when workflow is unavailable. |
| Risks | Automation may bypass human gates if boundaries are unclear. |
| Out of Scope | Enterprise workflow engine, durable orchestration platform, automation beyond MVP gates. |

### Stage-11 - Core Data Administration & Visibility

| Field | Definition |
|---|---|
| Purpose | Provide cross-domain non-authoritative admin visibility over owner records. |
| Services | FTV-SVC-11 Core Data Administration; all owner services. |
| Domains | Administration Domain; all owner domains by reference. |
| Capabilities | CAP-10; supporting CAP-11. |
| Components | FTV-COMP-023; FTV-COMP-024. |
| Repositories involved | Directus; Grafana reference. |
| Prerequisites | Stage-3 through Stage-10 record owners are stable. |
| Dependencies | Stage-1; Stage-3; Stage-5; Stage-6; Stage-8; Stage-9; Stage-10. |
| Deliverables | Admin view configuration; non-authoritative record browsing; owner-service redirect rule. |
| Acceptance Criteria | Admin views can inspect records without becoming their authoritative owner. |
| Exit Criteria | MVP operators can see cross-domain state and ownership. |
| Risks | Admin views may drift into data ownership. |
| Out of Scope | Shared database design; direct admin mutation of business records. |

### Stage-12 - Production Ready MVP

| Field | Definition |
|---|---|
| Purpose | Validate the complete manual-first MVP loop from source to learning. |
| Services | FTV-SVC-01 through FTV-SVC-11. |
| Domains | All frozen architecture domains. |
| Capabilities | CAP-01 through CAP-12. |
| Components | All selected/adapted/reference components by their assigned service. |
| Repositories involved | All candidate repositories by their selected/reference/reject status. |
| Prerequisites | Stage-1 through Stage-11. |
| Dependencies | All prior stages. |
| Deliverables | End-to-end MVP readiness package; validation summary; remaining risk register; freeze candidate. |
| Acceptance Criteria | Source -> asset -> media -> content -> review -> publishing -> performance -> analytics -> learning flow passes with manual fallback. |
| Exit Criteria | MVP can be frozen or handed to implementation planning with known risks. |
| Risks | License blockers or unresolved service gaps could prevent direct use of some source components. |
| Out of Scope | Scaling, production deployment topology, CI/CD, infrastructure hardening. |

---

## 3. Build Dependency Graph

| Stage | Depends on | Cycle check |
|---|---|---|
| Stage-0 | None | No cycle |
| Stage-1 | Stage-0 | No cycle |
| Stage-2 | Stage-1 | No cycle |
| Stage-3 | Stage-1; Stage-2 | No cycle |
| Stage-4 | Stage-1; Stage-3 | No cycle |
| Stage-5 | Stage-1; Stage-3; Stage-4 | No cycle |
| Stage-6 | Stage-1; Stage-5 | No cycle |
| Stage-7 | Stage-1; Stage-5; Stage-6 | No cycle |
| Stage-8 | Stage-1; Stage-7 | No cycle |
| Stage-9 | Stage-8 | No cycle |
| Stage-10 | Stage-1; Stage-4; Stage-6; Stage-8 | No cycle |
| Stage-11 | Stage-1; Stage-3; Stage-5; Stage-6; Stage-8; Stage-9; Stage-10 | No cycle |
| Stage-12 | Stage-1 through Stage-11 | No cycle |

---

## 4. Build Sequence

| Order | Stage | Why this comes here |
|---:|---|---|
| 0 | Stage-0 Roadmap Baseline | Establishes scope and freeze discipline before build planning. |
| 1 | Stage-1 Governance & Ownership Foundation | Owner/rule/audit constraints protect all later records. |
| 2 | Stage-2 Source Intake Foundation | Source/provenance is required before asset trust. |
| 3 | Stage-3 Asset Registry & Duplicate Control | Assets are the foundation for media and content. |
| 4 | Stage-4 Media Processing Slice | Processing requires registered assets and creates content-ready derivatives. |
| 5 | Stage-5 Content Production Core | Content depends on ready assets/media. |
| 6 | Stage-6 Human Review & Approval | Review gates content and publishing readiness. |
| 7 | Stage-7 Publishing Preparation | Publishing packages require approved content. |
| 8 | Stage-8 Performance Import & Metric Normalization | Performance facts need publishing references. |
| 9 | Stage-9 Analytics & Learning | Analytics depends on normalized performance facts. |
| 10 | Stage-10 Workflow Coordination | Workflow coordinates known service commands after domain flows exist. |
| 11 | Stage-11 Core Data Administration & Visibility | Admin views depend on stable owner records. |
| 12 | Stage-12 Production Ready MVP | Final end-to-end validation after all slices exist. |

---

## 5. Repository Integration Plan

| Repository | Stage | Purpose | Used components | Replacement risk | Verification required | License review required | Integration difficulty |
|---|---|---|---|---|---|---|---|
| Immich | Stage-3 | Gallery/search UX reference only. | COMP-001; COMP-002 | Low if kept reference only | Verify reference relevance | AGPL caution | Low |
| PhotoPrism | Stage-4 | Media processing/indexing reference only. | COMP-003; COMP-004 | Medium if copied; Low if reference | Verify command/pipeline concepts | AGPL required | Medium |
| ResourceSpace | Stage-2; Stage-3; Stage-4 | DAM, provenance, rights, OCR/STT reference. | COMP-005; COMP-006; COMP-007 | Medium | Module and file-level verification | Required | Medium |
| LibrePhotos | Stage-3; Stage-4 | Duplicate/similarity detection pattern. | COMP-008 | Low-Medium | Dependency and algorithm verification | MIT favorable | Low-Medium |
| Nextcloud | Stage-3 | Rejected generic file governance alternative. | COMP-009 | Low | Avoid reselecting without change request | AGPL caution | N/A |
| Stalwart | Stage-3 | Rejected storage concept. | COMP-010 | Low | Avoid reselecting without change request | Required if revisited | N/A |
| AppFlowy | Stage-5; Stage-6 | Planning/review UX reference. | COMP-011; COMP-012 | Low if reference | Verify UX patterns only | AGPL caution | Low |
| Directus | Stage-1; Stage-6; Stage-8; Stage-11 | Admin/activity/review/performance staging patterns. | COMP-013; COMP-014 | High if license unsuitable | Product/license boundary verification | Required | Medium-High |
| Strapi | Stage-5; Stage-7 | Editorial workflow reference only. | COMP-015 | Low | Feature/edition verification if revisited | Required | Low |
| Payload | Stage-5; Stage-6; Stage-7 | Content and publish-readiness workflow patterns. | COMP-016 | Medium | Dependency/plugin verification | MIT favorable | Medium |
| Penpot | Stage-7 | Design/template reference. | COMP-017 | Low | Reference-only verification | MPL review if adopted | Low |
| Ghost | Stage-7 | Publishing metadata/checklist pattern. | COMP-018 | Low-Medium | Verify metadata pattern fit | MIT favorable | Low-Medium |
| Metabase | Stage-9 | Dashboard/metrics pattern. | COMP-019 | Medium | Deployment/license boundary | AGPL/commercial required | Medium |
| Apache Superset | Stage-9 | BI reference only. | COMP-020 | Low | Reference-only | Apache-2.0 favorable | Low |
| Grafana | Stage-1; Stage-9; Stage-11 | Dashboard/audit visibility reference. | COMP-021 | Low | Reference-only | AGPL caution | Low |
| Lightdash | Stage-9 | Governed metrics reference. | COMP-022 | Low | License/detail verification if revisited | Required | Low |
| PostHog | Stage-8; Stage-9 | Event/analytics schema reference. | COMP-023 | Low-Medium | OSS/EE feature boundary | Required | Low-Medium |
| Evidence | Stage-9 | Narrative analytics report pattern. | COMP-024 | Low | Dependency verification | MIT favorable | Low |
| n8n | Stage-10 | Rejected automation alternative. | COMP-025 | Low | Avoid reselecting without change request | Required if revisited | N/A |
| Activepieces | Stage-10 | Human-facing workflow automation pattern. | COMP-026 | Medium | CE/enterprise boundary | MIT CE favorable with verification | Medium |
| Kestra | Stage-4; Stage-8; Stage-10 | Scheduled technical workflow pattern. | COMP-027 | Medium | Plugin/runtime verification | Apache-2.0 favorable | Medium |
| OpenFGA | Stage-1 | Authorization relation/rule enforcement pattern. | COMP-028 | Medium if deferred | Model fit verification | Apache-2.0 favorable | Medium |
| Temporal | Stage-10 | Rejected durable workflow alternative. | COMP-029 | Low | Avoid reselecting without change request | MIT favorable if revisited | N/A |
| Camunda | Stage-1; Stage-6; Stage-10 | Rule/workflow reference only. | COMP-030 | Low if reference | License/deployment if revisited | Required | Low |
| OpenMetadata | Stage-1 | Governance vocabulary/catalog reference. | COMP-031 | Low | Reference-only | Apache-2.0 favorable | Low |
| DataHub | Stage-1 | Governance lineage/reference model. | COMP-032 | Low | Reference-only | Apache-2.0 favorable | Low |

---

## 6. Internal Module Plan

| Internal module | Stage | Owning service | Reason |
|---|---|---|---|
| Approved Source Acquisition | Stage-2 | FTV-SVC-01 | Candidate repos model intake but do not provide FTV-specific lawful source acquisition behavior. |
| Provenance Capture | Stage-2 | FTV-SVC-01 | Required for traceability from source to asset. |
| Rights Manager | Stage-2; Stage-3 | FTV-SVC-01 | Rights status is an FTV core rule even if ResourceSpace patterns are adapted. |
| Duplicate Decision Handler | Stage-3 | FTV-SVC-01 | Human duplicate resolution must remain owner-controlled. |
| FFmpeg/Media Normalization | Stage-4 | FTV-SVC-02 | PhotoPrism is reference only; MVP needs small internal processing boundary. |
| Thumbnail Generation | Stage-4 | FTV-SVC-02 | Required derivative flow under media job lifecycle. |
| Metadata Extraction | Stage-4 | FTV-SVC-02 | Needed for asset/media usability. |
| Optional OCR/STT Enrichment | Stage-4 | FTV-SVC-02 | Optional enrichment point without making OCR/STT mandatory. |
| Content Package Manager | Stage-5 | FTV-SVC-03 | Maintains content package lifecycle. |
| Version Tracker | Stage-5 | FTV-SVC-03 | Ensures content versions remain owner-controlled. |
| Review Assignment Queue | Stage-6 | FTV-SVC-05 | Human review requires assignment and state tracking. |
| Approval Status Tracker | Stage-6 | FTV-SVC-05 | Approval status is authoritative for gates. |
| Publishing Package Builder | Stage-7 | FTV-SVC-04 | Converts approved content into manual publishing package. |
| Publishing Checklist | Stage-7 | FTV-SVC-04 | Keeps manual publishing readiness explicit. |
| CSV Import | Stage-8 | FTV-SVC-06 | Performance CSV import is not fully covered by candidates. |
| API Import Candidate | Stage-8 | FTV-SVC-06 | Future/import candidate, not required for manual-first MVP. |
| Metric Mapping | Stage-8 | FTV-SVC-06 | External platform metrics need FTV definitions. |
| Metric Normalization | Stage-8 | FTV-SVC-06 | Analytics requires normalized facts. |
| Narrative Report Builder | Stage-9 | FTV-SVC-07 | Evidence pattern supports reports but FTV owns report semantics. |
| Learning Summary Tracker | Stage-9 | FTV-SVC-07 | Closes performance-to-content learning loop. |
| Workflow Run Tracker | Stage-10 | FTV-SVC-08 | Workflow owns runs and retry visibility only. |
| Lightweight Business Rule Validation | Stage-1; Stage-10 | FTV-SVC-09 | Complements OpenFGA-style authorization with state/rule checks. |
| Audit Event Recorder | Stage-1 | FTV-SVC-09 | Required for governed MVP traceability. |
| Admin View Configuration | Stage-11 | FTV-SVC-11 | Supports CAP-10 without owning business records. |

---

## 7. Validation Plan

| Stage | Validation | Smoke Test | Manual Test | Integration Test | Acceptance Test |
|---|---|---|---|---|---|
| Stage-0 | Artifact/freeze traceability | Roadmap references frozen artifacts | Reviewer checks non-goals | N/A | Scope accepted |
| Stage-1 | Owner/rule/audit consistency | Rule/audit concept visible | Manual role/check review | Governed command path traced | No multi-owner record |
| Stage-2 | Source/provenance/rights flow | Source reference captured | Manual rights update | Rule/audit check with source | Source traceable to provenance |
| Stage-3 | Asset lifecycle/duplicate state | Asset registered | Duplicate decision recorded | Asset uses governance checks | Asset ready/blocked state valid |
| Stage-4 | Processing job lifecycle | Job completes/fails | Manual retry/fallback | Result returns to asset owner | Derivative/metadata recorded |
| Stage-5 | Content package/version flow | Content package created | Version edited manually | Asset refs validated | Review-ready content exists |
| Stage-6 | Review/approval lifecycle | Review requested/assigned | Approve/reject manually | Approval consumed by content/publishing | Approval status authoritative |
| Stage-7 | Publishing package flow | Package created | Manual checklist completed | Approval and rights checks consumed | Manual publishing reference recorded |
| Stage-8 | Import/fact/metric flow | Import record created | CSV corrected manually | Publishing refs tied to facts | Normalized facts available |
| Stage-9 | Report/learning flow | Report generated | Analyst reviews learning | Report consumes facts only | Learning summary created |
| Stage-10 | Workflow run flow | Workflow run starts/fails | Manual continuation works | Target state remains with owner | Workflow coordinates without owning target |
| Stage-11 | Admin visibility | Admin view opens | Owner record inspected manually | Owner links/responsibility clear | Admin does not own business record |
| Stage-12 | End-to-end MVP | Full happy path starts | Manual fallback exercised | Cross-service flow completes | MVP flow passes source-to-learning |

---

## 8. Risk Control Plan

| Stage | Risk | Mitigation | Rollback Strategy | Manual Fallback |
|---|---|---|---|---|
| Stage-0 | Scope drift | Freeze scope and non-goals | Return to frozen artifacts | Review artifacts manually |
| Stage-1 | Governance too heavy | Keep lightweight validation path | Defer OpenFGA-style adoption | Manual role/rule checklist |
| Stage-2 | ResourceSpace uncertainty | Treat as pattern until verified | Use internal source/provenance module | Source spreadsheet |
| Stage-3 | Duplicate false positives | Human decision required | Mark duplicate unresolved | Manual duplicate notes |
| Stage-4 | Media processing failure | Preserve original asset | Disable enrichment/derivative dependency | Manual FFmpeg/output notes |
| Stage-5 | Content/review boundary drift | Content owns versions; Review owns approval | Revert state to draft/review pending | Shared content doc |
| Stage-6 | Review workflow complexity | Use simple assignment/decision states | Manual reviewer assignment | Review spreadsheet |
| Stage-7 | Autonomous publishing creep | Manual publishing only | Remove automated posting behavior | Export folder/checklist |
| Stage-8 | Import mapping errors | Keep raw import and errors | Revert to prior facts | Manual metric entry |
| Stage-9 | Analytics writes back to content | Reports remain read/reference | Disable writeback path | Manual learning note |
| Stage-10 | Workflow owns target state | Enforce owner commands | Disable workflow automation | Manual checklist |
| Stage-11 | Admin becomes data owner | Owner-service mutation only | Use owner views directly | Owner-service tables |
| Stage-12 | License blockers remain | Document unresolved verification | Use manual/reference fallback | Manual-first MVP operation |

---

## 9. Freeze Points

| Freeze point | Stage | Frozen artifact/output | Change rule |
|---|---|---|---|
| FP-0 | Stage-0 | Roadmap baseline | Changes require roadmap change request. |
| FP-1 | Stage-1 | Ownership/governance baseline | Owner/rule/audit changes require architecture/service change request. |
| FP-2 | Stage-3 | Source/asset/rights/duplicate baseline | Asset owner/lifecycle changes require change request. |
| FP-3 | Stage-6 | Content/review approval gate baseline | Review/content ownership changes require change request. |
| FP-4 | Stage-8 | Publishing/performance data baseline | Metric ownership or publishing completion changes require change request. |
| FP-5 | Stage-10 | Workflow coordination boundary | Any workflow target-state ownership change requires change request. |
| FP-6 | Stage-12 | MVP readiness package | Further changes move to post-MVP/change-controlled phase. |

---

## 10. Milestones

| Milestone | Name | Stage coverage | Deliverables | Acceptance |
|---|---|---|---|---|
| M0 | Roadmap Ready | Stage-0 | Approved roadmap baseline | Scope and freeze discipline confirmed. |
| M1 | Core Ready | Stage-1 | Governance/ownership/rule/audit baseline | No multi-owner records; rule/audit path defined. |
| M2 | Source & Asset Ready | Stage-2 to Stage-3 | Source, asset, provenance, rights, duplicate flows | Assets can be ready/blocked with traceability. |
| M3 | Media Ready | Stage-4 | Processing job and derivative flow | Media result returns to asset owner. |
| M4 | Content Ready | Stage-5 | Content brief/package/version flow | Content can become review-ready. |
| M5 | Review Ready | Stage-6 | Review/approval flow | Approval status gates publishing. |
| M6 | Publishing Ready | Stage-7 | Publishing package/manual completion flow | Manual publishing reference is captured. |
| M7 | Performance Ready | Stage-8 | Import/fact/metric flow | Normalized performance facts exist. |
| M8 | Learning Ready | Stage-9 | Analytics report/learning flow | Learning summary is produced without mutating content. |
| M9 | Operations Ready | Stage-10 to Stage-11 | Workflow coordination and admin visibility | Workflow/admin support does not own target records. |
| M10 | MVP Ready | Stage-12 | End-to-end MVP validation package | Source-to-learning flow passes with manual fallback. |

---

## 11. Build Principles

| Principle | Rule |
|---|---|
| Build once | Avoid duplicate implementations for the same owned record. |
| No rewrite | Prefer small corrections over reworking frozen boundaries. |
| No duplicated implementation | A record owner builds its lifecycle once; others reference it. |
| Manual before automation | Manual path must work before workflow or scheduling support. |
| Owner before integration | Build authoritative owner before downstream consumers. |
| Test before next stage | Each stage must pass validation before dependent stages start. |
| Stable before optimization | Do not optimize infrastructure or scale before MVP flow is stable. |
| Repository replaceability | Repository-derived components remain replaceable behind service responsibilities. |
| Reference by ID | Cross-service relations use IDs/references, not shared writes. |
| Event after state | Notify only after owner state changes or failure record is created. |

---

## 12. Non-goals

| Non-goal | Reason |
|---|---|
| Autonomous publishing | Violates manual-first/human-governed MVP boundary. |
| Full DAM/photo platform adoption | Too broad for MVP. |
| Full workflow/BPM/durable orchestration suite | Too heavy for MVP. |
| Full enterprise governance/catalog platform | Reference only; not MVP-sized. |
| Advanced AI/recommendation automation | Future extension, not MVP build. |
| Platform credential management/posting API | Not required for manual publishing MVP. |
| Infrastructure/deployment design | Explicitly out of scope for roadmap. |
| Database/API/event schema | Implementation detail, not roadmap. |
| Sprint tasks/story points/estimates | Roadmap is not sprint backlog. |

---

## 13. Future Build

| Horizon | Description |
|---|---|
| Phase-2 | Expand source/performance connectors, notifications, richer media enrichment, improved metric mapping, and smoother review UX while preserving manual governance. |
| Phase-3 | Add stronger automation, search, recommendation, multi-platform support, and governance vocabulary once MVP ownership remains stable. |
| Enterprise | Consider enterprise DAM/catalog/workflow/BI scale only after MVP value and operational boundaries are proven. |

---

## 14. Stage Summary

| Stage range | Summary |
|---|---|
| Stage-0 to Stage-1 | Establish roadmap, ownership, governance, audit, and rule foundation. |
| Stage-2 to Stage-4 | Build source, asset, rights, duplicate, and media processing foundation. |
| Stage-5 to Stage-7 | Build content, review, and manual publishing preparation. |
| Stage-8 to Stage-9 | Build performance import, metrics, analytics, and learning loop. |
| Stage-10 to Stage-11 | Add workflow coordination and admin visibility without changing owners. |
| Stage-12 | Validate complete MVP readiness. |

---

## 15. Milestone Summary

| Milestone group | Milestones |
|---|---|
| Foundation | M0 Roadmap Ready; M1 Core Ready |
| Asset/media | M2 Source & Asset Ready; M3 Media Ready |
| Production/publishing | M4 Content Ready; M5 Review Ready; M6 Publishing Ready |
| Learning/operations | M7 Performance Ready; M8 Learning Ready; M9 Operations Ready |
| Final | M10 MVP Ready |

---

## 16. Dependency Summary

| Dependency chain | Summary |
|---|---|
| Foundation chain | Stage-0 -> Stage-1 |
| Asset chain | Stage-1 -> Stage-2 -> Stage-3 -> Stage-4 |
| Production chain | Stage-4 -> Stage-5 -> Stage-6 -> Stage-7 |
| Learning chain | Stage-7 -> Stage-8 -> Stage-9 |
| Operations chain | Stage-4/6/8 -> Stage-10 -> Stage-11 |
| Final chain | Stage-1 through Stage-11 -> Stage-12 |

---

## 17. Repository Summary

| Category | Repositories |
|---|---|
| Adapted operational candidates | ResourceSpace; LibrePhotos; Directus; Payload; Ghost; Metabase; Evidence; Activepieces; Kestra; OpenFGA |
| Reference-only candidates | Immich; PhotoPrism; AppFlowy; Strapi; Penpot; Apache Superset; Grafana; Lightdash; PostHog; Camunda; OpenMetadata; DataHub |
| Rejected for MVP | Nextcloud; Stalwart; n8n; Temporal |
| Highest verification pressure | ResourceSpace; Directus; Metabase; PhotoPrism; AppFlowy; PostHog; Strapi; n8n; Camunda |

---

## 18. Internal Module Summary

| Module area | Modules |
|---|---|
| Source/asset | Approved Source Acquisition; Provenance Capture; Rights Manager; Duplicate Decision Handler |
| Media | FFmpeg/Media Normalization; Thumbnail Generation; Metadata Extraction; Optional OCR/STT Enrichment |
| Content/review/publishing | Content Package Manager; Version Tracker; Review Assignment Queue; Approval Status Tracker; Publishing Package Builder; Publishing Checklist |
| Performance/analytics | CSV Import; API Import Candidate; Metric Mapping; Metric Normalization; Narrative Report Builder; Learning Summary Tracker |
| Operations/governance/admin | Workflow Run Tracker; Lightweight Business Rule Validation; Audit Event Recorder; Admin View Configuration |

---

## 19. Validation Summary

| Validation level | Roadmap usage |
|---|---|
| Validation | Confirms stage deliverable respects frozen architecture and ownership. |
| Smoke Test | Confirms the minimum stage path can execute conceptually. |
| Manual Test | Confirms manual-first fallback and human actions remain possible. |
| Integration Test | Confirms owner-service handoff works without shared ownership. |
| Acceptance Test | Confirms stage exit criteria and readiness for dependent stage. |

---

## 20. Risk Summary

| Risk group | Main controls |
|---|---|
| License/verification | Keep risky components replaceable and verify before direct adoption. |
| Ownership drift | Freeze owner baselines and route mutations to owner services. |
| Automation creep | Manual before automation; workflow owns runs only. |
| Media/import custom work | Treat as internal modules under existing services. |
| Analytics overreach | Analytics reports do not mutate content/performance owners. |
| Admin overreach | Admin owns views only, not business records. |

---

## 21. Freeze Summary

| Freeze point | Protects |
|---|---|
| FP-0 | Roadmap baseline |
| FP-1 | Governance/ownership foundation |
| FP-2 | Source/asset foundation |
| FP-3 | Content/review approval gate |
| FP-4 | Publishing/performance baseline |
| FP-5 | Workflow coordination boundary |
| FP-6 | MVP readiness package |

---

## 22. Future Build Summary

| Horizon | Summary |
|---|---|
| Phase-2 | Improve connectors, enrichment, notifications, metrics, and UX after MVP. |
| Phase-3 | Add stronger automation, search, recommendation, and multi-platform capabilities. |
| Enterprise | Consider enterprise DAM/catalog/workflow/BI only after MVP is validated. |

---

## 23. Self Review

| Check | Result |
|---|---|
| Used only frozen source artifacts | Pass |
| Did not edit frozen artifacts | Pass |
| Did not change architecture, services, ownership, bounded contexts, domains, repositories, or capabilities | Pass |
| Each stage has valid dependencies | Pass |
| No dependency cycle introduced | Pass |
| Each deliverable is based on frozen artifacts | Pass |
| Each repository has an integration stage | Pass |
| Each internal module has a build stage | Pass |
| Roadmap remains technology-neutral | Pass |
| No code, database schema, API, UI design, sprint tasks, story points, estimates, deployment plan, CI/CD, infrastructure design, Docker, Kubernetes, cloud architecture, or implementation details created | Pass |
| No framework, language, database, queue, storage, or auth solution selected | Pass |

---

## 24. Stop Point

This file is ready for review as the STEP-05 Build Roadmap artifact.

No implementation plan, sprint backlog, code, schema, API, deployment plan, infrastructure design, or technology selection has been created.

