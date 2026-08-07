# FTV_SERVICE_CATALOG.md

**Project:** Football Troll Vault v2  
**Target:** FTV_MVP  
**Phase:** Repository Discovery - STEP-02 FTV Service Catalog  
**Framework:** Repository Acquisition Framework (RAF v1.1)  
**Source artifacts:** `CANDIDATE_REPOSITORY_INDEX.md`, `FTV_COMPONENT_CATALOG.md`  
**Review date:** 2026-07-30  
**Status:** Draft for confirmation  

---

## 1. Purpose

This catalog converts the selected FTV components from STEP-01 into a minimal service catalog for FTV MVP.

This document is a bridge between Component Selection and later System Assembly. It does **not** create System Assembly, does **not** create an Architecture Blueprint, does **not** decide deployment topology, does **not** create a Build Roadmap, and does **not** create an Implementation Plan.

Services in this catalog represent business or technical responsibilities. They are not repository names.

---

## 2. Service Boundary Principles

| Principle | Application in this catalog |
|---|---|
| One authoritative owner per record | Each domain entity has exactly one owning service. Other services may reference it but do not own it. |
| MVP-small and manual-first | Services are grouped by lifecycle and data ownership to avoid unnecessary fragmentation. |
| Component-level source decisions preserved | Source component decisions remain as recorded in `FTV_COMPONENT_CATALOG.md`. |
| BUILD gaps become responsibilities, not automatic services | Gaps are assigned as internal module candidates unless they have independent data ownership or lifecycle. |
| No repository-as-service shortcut | ResourceSpace, Directus, Payload, Activepieces, Kestra, Metabase, Evidence, OpenFGA, and others are source candidates only. |

---

## 3. Service Inventory

| Service ID | Service name | Service type | MVP criticality | Primary capabilities |
|---|---|---|---|---|
| FTV-SVC-01 | Source & Asset Registry Service | Core domain service | Critical | CAP-01, CAP-02 |
| FTV-SVC-02 | Media Processing Service | Supporting service | Critical | CAP-03 |
| FTV-SVC-03 | Content Production Service | Core domain service | Critical | CAP-04 |
| FTV-SVC-04 | Publishing Preparation Service | Core domain service | Critical | CAP-05 |
| FTV-SVC-05 | Human Review & Approval Service | Core domain service | Critical | CAP-12, CAP-05 |
| FTV-SVC-06 | Performance Data Service | Supporting service | Critical | CAP-06 |
| FTV-SVC-07 | Analytics & Reporting Service | Analytics/reporting service | Important | CAP-07 |
| FTV-SVC-08 | Workflow Orchestration Service | Automation/orchestration service | Important | CAP-08 |
| FTV-SVC-09 | Governance & Rule Service | Governance/security service | Critical | CAP-09, CAP-11 |
| FTV-SVC-10 | Reference Pattern Library | Reference-only design pattern | Non-runtime | CAP-04, CAP-05, CAP-07, CAP-08, CAP-11, CAP-12 |
| FTV-SVC-11 | Core Data Administration Service | Supporting service | Important | CAP-10 |

**Operational service count:** 10  
**Reference-only pattern service count:** 1  

---

## 4. Service Definitions

### FTV-SVC-01 - Source & Asset Registry Service

| Field | Definition |
|---|---|
| Service ID | FTV-SVC-01 |
| Service name | Source & Asset Registry Service |
| Service type | Core domain service |
| Service purpose | Maintain the authoritative registry of source references, assets, provenance, rights status, collections, and duplicate-review state. |
| Primary responsibilities | Approved source intake; asset registration; asset metadata; provenance capture; rights status tracking; duplicate-match ownership; asset lifecycle state. |
| In-scope capabilities | CAP-01 Asset Acquisition; CAP-02 Asset Management |
| Out-of-scope responsibilities | Media transcoding; thumbnail generation; content briefs; publishing packages; metric analysis; final authorization policy evaluation. |
| Owned domain entities or records | Source reference; Asset; Asset provenance; Rights status; Duplicate match |
| Selected FTV components | FTV-COMP-001; FTV-COMP-002; FTV-COMP-003; FTV-COMP-004; FTV-COMP-005 |
| Source repositories/components | ResourceSpace COMP-005 ADAPT; ResourceSpace COMP-006 ADAPT; LibrePhotos COMP-008 ADAPT; Nextcloud COMP-009 REJECT; Stalwart COMP-010 REJECT |
| Data owned by the service | Source URL/account; source approval status; asset ID; asset metadata; provenance evidence; rights status; collection/tag metadata; duplicate-match review status. |
| Data referenced but not owned | Media processing job status from FTV-SVC-02; review decision from FTV-SVC-05; authorization relation from FTV-SVC-09; audit events from FTV-SVC-09. |
| Inputs | Approved-key context; manually added source references; uploaded media files; duplicate-candidate outputs from FTV-SVC-02; reviewer rights notes. |
| Outputs | Registered asset records; provenance records; rights status; duplicate-match records; asset-ready signals for content production. |
| Human interaction points | Intake review; source approval; rights confirmation; duplicate-match decision; restricted-asset override request. |
| Manual fallback | Spreadsheet or simple table of source references/assets/rights status plus manually named file folders. |
| External dependencies | Asset storage location; optional ResourceSpace-derived metadata model; optional LibrePhotos-derived duplicate detection pattern. |
| License or verification constraints | ResourceSpace license/module boundary must be verified; LibrePhotos MIT is favorable but dependency verification remains. |
| MVP criticality | Critical |
| Integration risk | Medium |
| Open questions | Can ResourceSpace be used directly, or should only its DAM/rights model be adapted? What exact rights states are required for MVP? |

**Internal module candidates from STEP-01 gaps:** Approved source acquisition is an internal intake module in this service. It should support manual source entry first, then optional lawful connector behavior later. It is not separated into a standalone service because Source reference and Asset provenance are owned here.

---

### FTV-SVC-02 - Media Processing Service

| Field | Definition |
|---|---|
| Service ID | FTV-SVC-02 |
| Service name | Media Processing Service |
| Service type | Supporting service |
| Service purpose | Produce normalized media derivatives and processing results for registered assets. |
| Primary responsibilities | Media processing job lifecycle; FFmpeg/media normalization; thumbnail generation; metadata extraction; optional OCR/STT enrichment; duplicate/similarity computation. |
| In-scope capabilities | CAP-03 Media Processing; supporting CAP-02 Asset Management |
| Out-of-scope responsibilities | Asset ownership; rights decisions; content package creation; publishing checklist; analytics dashboards. |
| Owned domain entities or records | Media processing job |
| Selected FTV components | FTV-COMP-005; FTV-COMP-006; FTV-COMP-007; FTV-COMP-008; FTV-COMP-020 |
| Source repositories/components | LibrePhotos COMP-008 ADAPT; PhotoPrism COMP-003 REFERENCE ONLY; PhotoPrism COMP-004 REFERENCE ONLY; ResourceSpace COMP-007 REFERENCE ONLY; Kestra COMP-027 ADAPT |
| Data owned by the service | Processing job ID; requested operation; job state; error state; generated derivative references; extracted technical metadata; OCR/STT enrichment output before acceptance. |
| Data referenced but not owned | Asset record and asset file reference from FTV-SVC-01; workflow run from FTV-SVC-08; audit event from FTV-SVC-09; duplicate-match record owned by FTV-SVC-01. |
| Inputs | Registered asset reference; processing request; media file path/object reference; optional OCR/STT request; scheduled job trigger. |
| Outputs | Normalized media reference; thumbnail reference; extracted metadata; OCR/STT candidate enrichment; duplicate/similarity candidate result; processing status. |
| Human interaction points | Manual retry; accept/reject enrichment; inspect failed processing; confirm duplicate candidate. |
| Manual fallback | Local FFmpeg commands and manually generated thumbnails/metadata notes recorded back into the asset registry. |
| External dependencies | FFmpeg; optional OCR/STT runtime; PhotoPrism reference patterns; ResourceSpace OCR/STT plugin reference; optional Kestra scheduler. |
| License or verification constraints | PhotoPrism AGPL means reference only; ResourceSpace plugin license requires verification; Kestra Apache-2.0 favorable. |
| MVP criticality | Critical |
| Integration risk | Medium |
| Open questions | Is OCR/STT required in MVP, or deferred? Can MVP begin with manual processing triggers before scheduled processing? |

**Internal module candidates from STEP-01 gaps:** FFmpeg/media normalization, thumbnail generation, metadata extraction, and optional OCR/STT enrichment are internal modules in this service. They are not split into separate services because they share the same processing job lifecycle and asset inputs.

---

### FTV-SVC-03 - Content Production Service

| Field | Definition |
|---|---|
| Service ID | FTV-SVC-03 |
| Service name | Content Production Service |
| Service type | Core domain service |
| Service purpose | Maintain production-ready content concepts, briefs, packages, and versions before publishing preparation. |
| Primary responsibilities | Content brief creation; edit-plan records; content package structure; draft/version lifecycle; production status. |
| In-scope capabilities | CAP-04 Content Production |
| Out-of-scope responsibilities | Asset ownership; final review decision; publishing metadata checklist; external posting; analytics reporting. |
| Owned domain entities or records | Content brief; Content package; Content version |
| Selected FTV components | FTV-COMP-009; FTV-COMP-010; FTV-COMP-011 |
| Source repositories/components | Payload COMP-016 ADAPT; AppFlowy COMP-011 REFERENCE ONLY; AppFlowy COMP-012 REFERENCE ONLY; Strapi COMP-015 REFERENCE ONLY |
| Data owned by the service | Brief title; concept; script/caption draft; selected assets by reference; content package status; version history; production notes. |
| Data referenced but not owned | Asset/provenance/rights from FTV-SVC-01; review assignment/decision from FTV-SVC-05; authorization relation from FTV-SVC-09; publishing package from FTV-SVC-04. |
| Inputs | Approved asset references; topic/key context; producer notes; draft edits; reviewer feedback references. |
| Outputs | Content brief; content package; content version; review-ready content state. |
| Human interaction points | Producer creates/edits brief; editor updates version; reviewer comments are referenced but not owned here. |
| Manual fallback | Shared document or spreadsheet with content brief rows and version notes. |
| External dependencies | Payload-derived draft/version pattern; AppFlowy workspace UX reference. |
| License or verification constraints | Payload MIT favorable; AppFlowy AGPL reference only; Strapi feature boundary remains unverified. |
| MVP criticality | Critical |
| Integration risk | Medium |
| Open questions | Should content records later remain Payload-shaped, or consolidate into the core data admin boundary? |

**Ownership resolution:** Payload-derived content records own Content brief, Content package, and Content version. Directus-derived core data service may reference these records but does not own them.

---

### FTV-SVC-04 - Publishing Preparation Service

| Field | Definition |
|---|---|
| Service ID | FTV-SVC-04 |
| Service name | Publishing Preparation Service |
| Service type | Core domain service |
| Service purpose | Convert approved content packages into manual publishing packages with destination metadata, checklist state, and export-ready information. |
| Primary responsibilities | Publishing package metadata; destination checklist; intended schedule metadata; manual export package state. |
| In-scope capabilities | CAP-05 Publishing Preparation |
| Out-of-scope responsibilities | Autonomous posting; final approval decision; content version ownership; performance analytics; platform credential management. |
| Owned domain entities or records | Publishing package |
| Selected FTV components | FTV-COMP-012; FTV-COMP-013; FTV-COMP-014 |
| Source repositories/components | Ghost COMP-018 ADAPT; Payload COMP-016 ADAPT; Penpot COMP-017 REFERENCE ONLY; Strapi COMP-015 REFERENCE ONLY |
| Data owned by the service | Publishing package ID; title/caption/export metadata; tag set; destination fields; intended publish time; publish-readiness checklist; package export state. |
| Data referenced but not owned | Content package/version from FTV-SVC-03; approval status from FTV-SVC-05; rights status from FTV-SVC-01; authorization checks from FTV-SVC-09. |
| Inputs | Approved content version; destination metadata; thumbnail/template reference; publish checklist values. |
| Outputs | Manual publishing package; export checklist; ready-for-manual-posting signal. |
| Human interaction points | Publisher edits caption/title/tags; reviewer confirms checklist; manual export/download. |
| Manual fallback | Manual checklist and export folder per content package. |
| External dependencies | Ghost publishing metadata pattern; Payload publish-readiness state; Penpot design/template reference. |
| License or verification constraints | Ghost/Payload MIT favorable; Penpot reference only; no autonomous posting allowed by target constraints. |
| MVP criticality | Critical |
| Integration risk | Low-Medium |
| Open questions | Which destination-specific fields are allowed while keeping publishing manual and human-governed? |

**Ownership resolution:** Publishing Preparation owns only the Publishing package. It references Content package/version and Approval status but does not own either.

---

### FTV-SVC-05 - Human Review & Approval Service

| Field | Definition |
|---|---|
| Service ID | FTV-SVC-05 |
| Service name | Human Review & Approval Service |
| Service type | Core domain service |
| Service purpose | Own review assignments, review decisions, and approval status across assets, content, and publishing packages. |
| Primary responsibilities | Review assignment; review decision capture; approval status; reviewer comments/actions; approval transition history. |
| In-scope capabilities | CAP-12 Human Review Support; supporting CAP-05 Publishing Preparation; supporting CAP-11 Governance Support |
| Out-of-scope responsibilities | Content version ownership; publishing package metadata ownership; authorization relation ownership; business-rule evaluation ownership. |
| Owned domain entities or records | Review assignment; Review decision; Approval status |
| Selected FTV components | FTV-COMP-013; FTV-COMP-024; FTV-COMP-027; FTV-COMP-028 |
| Source repositories/components | Payload COMP-016 ADAPT; Directus COMP-014 ADAPT; AppFlowy COMP-011 REFERENCE ONLY; AppFlowy COMP-012 REFERENCE ONLY; Camunda COMP-030 REFERENCE ONLY |
| Data owned by the service | Assignment ID; assigned reviewer; target record reference; decision; rejection reason; approval state; review comments; review timestamps. |
| Data referenced but not owned | Content package/version from FTV-SVC-03; publishing package from FTV-SVC-04; asset/rights status from FTV-SVC-01; rule evaluation and authorization relation from FTV-SVC-09. |
| Inputs | Review-ready content; publish-ready package; reviewer action; rule-evaluation result; authorization check result. |
| Outputs | Approval status; review decision; assignment status; approval/rejection signal to content and publishing services. |
| Human interaction points | Reviewer accepts/rejects; publisher requests review; approver overrides with reason; reviewer sees context and rights status. |
| Manual fallback | Review spreadsheet with assignment, reviewer, status, decision, and timestamp columns. |
| External dependencies | Directus activity/review pattern; Payload status transition pattern; AppFlowy review workspace UX reference. |
| License or verification constraints | Directus source-available/commercial boundary must be verified; AppFlowy AGPL reference only. |
| MVP criticality | Critical |
| Integration risk | Medium-High |
| Open questions | Can review records use Directus-derived activity/status patterns without adopting Directus as the full core data platform? |

**Ownership resolution:** Human Review owns Approval status and Review decision. Content Production owns Content version. Publishing Preparation owns Publishing package. This prevents content/review/publishing record duplication.

---

### FTV-SVC-06 - Performance Data Service

| Field | Definition |
|---|---|
| Service ID | FTV-SVC-06 |
| Service name | Performance Data Service |
| Service type | Supporting service |
| Service purpose | Collect, stage, normalize, and own performance facts and metric definitions for analyzed content. |
| Primary responsibilities | CSV import; API import candidate handling; performance import lifecycle; metric normalization; metric mapping; performance fact storage; metric definition ownership. |
| In-scope capabilities | CAP-06 Performance Data Collection; supporting CAP-07 Performance Analysis |
| Out-of-scope responsibilities | Dashboard rendering; narrative report publication; source asset management; publishing package ownership. |
| Owned domain entities or records | Performance import; Performance fact; Metric definition |
| Selected FTV components | FTV-COMP-015; FTV-COMP-016; FTV-COMP-020 |
| Source repositories/components | Directus COMP-013 ADAPT; PostHog COMP-023 REFERENCE ONLY; Kestra COMP-027 ADAPT |
| Data owned by the service | Import batch; source platform; imported row; normalized metric value; metric definition; metric mapping; import error; performance fact. |
| Data referenced but not owned | Publishing package from FTV-SVC-04; content package from FTV-SVC-03; workflow run from FTV-SVC-08; audit event from FTV-SVC-09. |
| Inputs | CSV file; manual metric entry; future API response; platform/post identifier; metric mapping rules; scheduled import trigger. |
| Outputs | Validated import batch; normalized performance facts; metric definitions; import errors; analysis-ready dataset. |
| Human interaction points | Upload CSV; map columns; approve metric mapping; correct failed rows; trigger manual import. |
| Manual fallback | Manual spreadsheet import and hand-entered metrics. |
| External dependencies | Directus-derived staging/admin model; PostHog event schema reference; optional Kestra scheduled import trigger. |
| License or verification constraints | Directus license boundary must be verified; PostHog OSS/enterprise boundary is reference only; Kestra Apache-2.0 favorable. |
| MVP criticality | Critical |
| Integration risk | Medium |
| Open questions | Which platforms and metrics are mandatory for MVP import? |

**Internal module candidates from STEP-01 gaps:** CSV import, API import, metric normalization, and metric mapping are internal modules in this service. They share the same import/fact lifecycle, so they are not split into separate services for MVP.

---

### FTV-SVC-07 - Analytics & Reporting Service

| Field | Definition |
|---|---|
| Service ID | FTV-SVC-07 |
| Service name | Analytics & Reporting Service |
| Service type | Analytics/reporting service |
| Service purpose | Provide dashboards and narrative reports over approved performance facts. |
| Primary responsibilities | Metrics dashboards; exploratory performance views; narrative reports; repeat/avoid learning reports. |
| In-scope capabilities | CAP-07 Performance Analysis |
| Out-of-scope responsibilities | Metric import; metric definition ownership; data correction; workflow orchestration; publication of content. |
| Owned domain entities or records | Analytics report |
| Selected FTV components | FTV-COMP-016; FTV-COMP-017; FTV-COMP-018 |
| Source repositories/components | Metabase COMP-019 ADAPT; Evidence COMP-024 ADAPT; PostHog COMP-023 REFERENCE ONLY; Superset COMP-020 REFERENCE ONLY; Grafana COMP-021 REFERENCE ONLY; Lightdash COMP-022 REFERENCE ONLY |
| Data owned by the service | Report ID; report definition; narrative report text/sections; dashboard/report metadata; generated report snapshot reference. |
| Data referenced but not owned | Performance facts and metric definitions from FTV-SVC-06; content package from FTV-SVC-03; publishing package from FTV-SVC-04. |
| Inputs | Analysis-ready performance facts; metric definitions; report template/query; analyst comments. |
| Outputs | Dashboard view; narrative analytics report; repeat/avoid insight summary. |
| Human interaction points | Analyst opens dashboard; analyst reviews generated report; editor reads performance summary for future briefs. |
| Manual fallback | Spreadsheet charts and manually written weekly learning notes. |
| External dependencies | Metabase dashboard/model pattern; Evidence SQL + Markdown report pattern. |
| License or verification constraints | Metabase AGPL/commercial boundary must be verified; Evidence MIT favorable. |
| MVP criticality | Important |
| Integration risk | Medium |
| Open questions | Should MVP prioritize exploratory dashboards, narrative reports, or both? |

**Ownership resolution:** Performance Data owns Performance fact and Metric definition. Analytics & Reporting owns only Analytics report definitions/snapshots.

---

### FTV-SVC-08 - Workflow Orchestration Service

| Field | Definition |
|---|---|
| Service ID | FTV-SVC-08 |
| Service name | Workflow Orchestration Service |
| Service type | Automation/orchestration service |
| Service purpose | Coordinate human-triggered automation, scheduled technical jobs, and visible workflow run history. |
| Primary responsibilities | Workflow run ownership; human-triggered automation; approval notifications; scheduled processing/import triggers; retry/run visibility. |
| In-scope capabilities | CAP-08 Workflow Management; supporting CAP-03 and CAP-06 |
| Out-of-scope responsibilities | Business-rule truth; authorization relations; content/asset/metric ownership; durable enterprise orchestration. |
| Owned domain entities or records | Workflow run |
| Selected FTV components | FTV-COMP-019; FTV-COMP-020; FTV-COMP-022 |
| Source repositories/components | Activepieces COMP-026 ADAPT; Kestra COMP-027 ADAPT; Camunda COMP-030 REFERENCE ONLY; n8n COMP-025 REJECT; Temporal COMP-029 REJECT |
| Data owned by the service | Workflow run ID; trigger type; run status; run inputs/outputs summary; retry/error state; run timestamp. |
| Data referenced but not owned | Review assignment/approval from FTV-SVC-05; processing job from FTV-SVC-02; import batch from FTV-SVC-06; rule evaluation from FTV-SVC-09. |
| Inputs | Manual trigger; schedule trigger; service event; approval state change; import/processing request. |
| Outputs | Workflow run record; task notification; scheduled job request; retry/error signal. |
| Human interaction points | User triggers workflow; user reviews failed run; user receives approval/import/processing notification. |
| Manual fallback | Manual checklist and direct service action without automation. |
| External dependencies | Activepieces flow pattern; Kestra scheduler pattern; Camunda rule/workflow reference only. |
| License or verification constraints | Activepieces CE MIT boundary must be verified; Kestra Apache-2.0 favorable; n8n and Temporal rejected for MVP. |
| MVP criticality | Important |
| Integration risk | Medium |
| Open questions | Can MVP start with manual triggers only and defer scheduled jobs? |

**Ownership resolution:** Activepieces and Kestra are not separate services. They are candidate engines/patterns under one Workflow Orchestration Service. Activepieces covers human-facing automation; Kestra covers scheduled technical jobs if needed.

---

### FTV-SVC-09 - Governance & Rule Service

| Field | Definition |
|---|---|
| Service ID | FTV-SVC-09 |
| Service name | Governance & Rule Service |
| Service type | Governance/security service |
| Service purpose | Own authorization relations, user roles, rule evaluations, and audit events for human-governed MVP operation. |
| Primary responsibilities | Authorization relation ownership; user role ownership; object-level permission checks; lightweight business-rule validation; rule evaluation records; audit event ownership; governance vocabulary reference. |
| In-scope capabilities | CAP-09 Rule Enforcement; CAP-11 Governance Support |
| Out-of-scope responsibilities | Review decision ownership; content version ownership; asset rights status ownership; workflow run ownership. |
| Owned domain entities or records | User role; Authorization relation; Rule evaluation; Audit event |
| Selected FTV components | FTV-COMP-004; FTV-COMP-021; FTV-COMP-022; FTV-COMP-024; FTV-COMP-025; FTV-COMP-026 |
| Source repositories/components | OpenFGA COMP-028 ADAPT; Directus COMP-014 ADAPT; ResourceSpace COMP-006 ADAPT; Camunda COMP-030 REFERENCE ONLY; DataHub COMP-032 REFERENCE ONLY; OpenMetadata COMP-031 REFERENCE ONLY; Grafana COMP-021 REFERENCE ONLY |
| Data owned by the service | User role; subject/object relation; authorization check result; rule evaluation result; rule reason; audit event; governance tag/vocabulary reference. |
| Data referenced but not owned | Rights status from FTV-SVC-01; review decision and approval status from FTV-SVC-05; workflow run from FTV-SVC-08; content and publishing records from FTV-SVC-03/04. |
| Inputs | User action; target record reference; requested operation; rights status; approval status; business-rule context. |
| Outputs | Allow/deny decision; rule evaluation record; audit event; policy violation signal. |
| Human interaction points | Admin assigns role; approver sees blocked action reason; reviewer adds override reason; governance reviewer audits event trail. |
| Manual fallback | Role/status spreadsheet and manual sign-off log, with audit notes appended by humans. |
| External dependencies | OpenFGA relationship authorization pattern; Directus activity-log pattern; Camunda DMN reference; DataHub/OpenMetadata governance vocabulary reference. |
| License or verification constraints | OpenFGA Apache-2.0 favorable; Directus license boundary must be verified; Camunda reference only; ResourceSpace rights module license verification remains. |
| MVP criticality | Critical |
| Integration risk | Medium |
| Open questions | Is OpenFGA necessary in MVP, or can simple role/status checks satisfy first release governance? |

**Internal module candidates from STEP-01 gaps:** Lightweight business-rule validation is an internal module in this service. OpenFGA handles who may do something; the internal rule validator handles whether the current asset/content/review state permits the action.

**Ownership resolution:** Human Review owns Review decision and Approval status. Governance & Rule owns Rule evaluation, Audit event, User role, and Authorization relation.

---

### FTV-SVC-10 - Reference Pattern Library

| Field | Definition |
|---|---|
| Service ID | FTV-SVC-10 |
| Service name | Reference Pattern Library |
| Service type | Reference-only design pattern |
| Service purpose | Preserve useful reference-only patterns from STEP-01 without treating them as runtime services or MVP dependencies. |
| Primary responsibilities | Track reference-only UX, rule, analytics, governance, and design patterns for later architecture consideration. |
| In-scope capabilities | CAP-04, CAP-05, CAP-07, CAP-08, CAP-11, CAP-12 |
| Out-of-scope responsibilities | Runtime ownership; domain record ownership; deployment; data processing; final design decisions. |
| Owned domain entities or records | None |
| Selected FTV components | FTV-COMP-010; FTV-COMP-014; FTV-COMP-016; FTV-COMP-022; FTV-COMP-026; FTV-COMP-027 |
| Source repositories/components | AppFlowy COMP-011/COMP-012 REFERENCE ONLY; Penpot COMP-017 REFERENCE ONLY; PostHog COMP-023 REFERENCE ONLY; Camunda COMP-030 REFERENCE ONLY; DataHub COMP-032 REFERENCE ONLY; Superset COMP-020 REFERENCE ONLY; Grafana COMP-021 REFERENCE ONLY; Lightdash COMP-022 REFERENCE ONLY; OpenMetadata COMP-031 REFERENCE ONLY |
| Data owned by the service | None |
| Data referenced but not owned | All domain records remain owned by operational services. |
| Inputs | STEP-01 reference-only component notes. |
| Outputs | Reference pattern notes for later review. |
| Human interaction points | Architect/reviewer consults pattern notes in a later approved phase. |
| Manual fallback | Read STEP-01 source notes directly. |
| External dependencies | None for MVP runtime. |
| License or verification constraints | Reference-only components are not approved for direct adoption by this catalog. |
| MVP criticality | Non-runtime |
| Integration risk | Low if kept reference-only; High if accidentally promoted without verification. |
| Open questions | Which reference patterns should be revisited only after MVP scope is stable? |

---

### FTV-SVC-11 - Core Data Administration Service

| Field | Definition |
|---|---|
| Service ID | FTV-SVC-11 |
| Service name | Core Data Administration Service |
| Service type | Supporting service |
| Service purpose | Provide cross-domain admin access, schema/display configuration, and non-authoritative data management surfaces without becoming the owner of every business record. |
| Primary responsibilities | Admin UI pattern; schema/display metadata; cross-domain record browsing; non-authoritative admin views; activity visibility surfaces. |
| In-scope capabilities | CAP-10 Data Management |
| Out-of-scope responsibilities | Authoritative ownership of assets, content, reviews, publishing packages, performance facts, roles, authorization relations, or audit events. |
| Owned domain entities or records | Admin view configuration; schema/display metadata; non-authoritative indexes only |
| Selected FTV components | FTV-COMP-023; FTV-COMP-024 |
| Source repositories/components | Directus COMP-013 ADAPT; Directus COMP-014 ADAPT |
| Data owned by the service | Admin view definitions; display labels; schema/view metadata; optional non-authoritative lookup/index records. |
| Data referenced but not owned | All business records owned by FTV-SVC-01 through FTV-SVC-09. |
| Inputs | Authoritative records from domain services; admin configuration; display metadata. |
| Outputs | Admin views; record browsing surfaces; data-management visibility; non-authoritative cross-record indexes. |
| Human interaction points | Admin reviews records, adjusts display configuration, inspects data quality, and follows links to authoritative record owners. |
| Manual fallback | Direct spreadsheet/database inspection for domain records, with owner service noted per record type. |
| External dependencies | Directus visual data modeling/admin UI and activity/version patterns. |
| License or verification constraints | Directus source-available/commercial boundary is a blocking verification issue before direct adoption. |
| MVP criticality | Important |
| Integration risk | Medium-High |
| Open questions | If Directus is not usable, can admin visibility be provided by narrow owner-specific views instead? |

**Ownership resolution:** This service does not own the listed business records in Section 8. It exists to make CAP-10 explicit while preserving one authoritative owner per domain entity.

---

## 5. Ownership Resolution Notes

| Overlap area | Resolution |
|---|---|
| Payload and Directus | Payload-derived Content Production owns Content brief, Content package, and Content version. Core Data Administration may display/administer cross-domain views but does not own content production records. |
| ResourceSpace and core data service | Source & Asset Registry owns Source reference, Asset, Asset provenance, Rights status, and Duplicate match. Core/admin patterns may display or reference these records but do not own them. |
| Activepieces and Kestra | One Workflow Orchestration Service owns Workflow run. Activepieces is the human-facing automation candidate; Kestra is the scheduled technical job candidate. |
| Metabase and Evidence | Performance Data owns facts/metrics. Analytics & Reporting owns reports. Metabase is the dashboard pattern; Evidence is the narrative report pattern. |
| OpenFGA and business-rule validation | Governance & Rule owns both. OpenFGA covers authorization relations/checks; lightweight business-rule validation is an internal module for state/rule checks. |
| Human Review records and Content Production records | Human Review owns Review assignment, Review decision, and Approval status. Content Production owns Content brief/package/version. |

---

## 6. Service-to-Capability Matrix

| Service | CAP-01 | CAP-02 | CAP-03 | CAP-04 | CAP-05 | CAP-06 | CAP-07 | CAP-08 | CAP-09 | CAP-10 | CAP-11 | CAP-12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| FTV-SVC-01 Source & Asset Registry | Primary | Primary | Support |  |  |  |  |  |  | Support | Support |  |
| FTV-SVC-02 Media Processing |  | Support | Primary |  |  |  |  | Support |  |  |  |  |
| FTV-SVC-03 Content Production |  |  |  | Primary | Support |  |  |  |  | Support |  | Support |
| FTV-SVC-04 Publishing Preparation |  |  |  |  | Primary |  |  |  |  |  |  | Support |
| FTV-SVC-05 Human Review & Approval |  |  |  | Support | Support |  |  |  |  | Support | Support | Primary |
| FTV-SVC-06 Performance Data |  |  |  |  |  | Primary | Support | Support |  | Support |  |  |
| FTV-SVC-07 Analytics & Reporting |  |  |  |  |  |  | Primary |  |  |  |  |  |
| FTV-SVC-08 Workflow Orchestration |  |  | Support |  |  | Support |  | Primary |  |  |  | Support |
| FTV-SVC-09 Governance & Rule |  |  |  |  | Support |  |  |  | Primary | Support | Primary | Support |
| FTV-SVC-10 Reference Pattern Library |  |  |  | Reference | Reference |  | Reference | Reference | Reference |  | Reference | Reference |
| FTV-SVC-11 Core Data Administration |  |  |  |  |  |  |  |  |  | Primary | Support |  |

**Coverage check:** CAP-01 through CAP-12 are covered.

---

## 7. Service-to-Component Mapping

| FTV component | STEP-01 decision | Assigned service(s) | Assignment status |
|---|---|---|---|
| FTV-COMP-001 | ADAPT | FTV-SVC-01 | Operational component source |
| FTV-COMP-002 | ADAPT | FTV-SVC-01 | Operational component source |
| FTV-COMP-003 | ADAPT | FTV-SVC-01 | Operational component source |
| FTV-COMP-004 | ADAPT | FTV-SVC-01; FTV-SVC-09 | Operational component source; governance reference for rights constraints |
| FTV-COMP-005 | ADAPT | FTV-SVC-01; FTV-SVC-02 | Operational component source; processing computes, asset registry owns duplicate match |
| FTV-COMP-006 | REFERENCE ONLY | FTV-SVC-02 | Reference-only media processing pattern |
| FTV-COMP-007 | REFERENCE ONLY | FTV-SVC-02 | Reference-only indexing/thumbnail pattern |
| FTV-COMP-008 | REFERENCE ONLY | FTV-SVC-02 | Reference-only OCR/STT enrichment pattern |
| FTV-COMP-009 | ADAPT | FTV-SVC-03 | Operational component source |
| FTV-COMP-010 | REFERENCE ONLY | FTV-SVC-03; FTV-SVC-10 | Reference-only planning UX pattern |
| FTV-COMP-011 | ADAPT | FTV-SVC-03 | Operational component source |
| FTV-COMP-012 | ADAPT | FTV-SVC-04 | Operational component source |
| FTV-COMP-013 | ADAPT | FTV-SVC-04; FTV-SVC-05 | Operational component source for publish readiness and approval transition reference |
| FTV-COMP-014 | REFERENCE ONLY | FTV-SVC-04; FTV-SVC-10 | Reference-only visual/template pattern |
| FTV-COMP-015 | ADAPT | FTV-SVC-06 | Operational component source |
| FTV-COMP-016 | REFERENCE ONLY | FTV-SVC-06; FTV-SVC-07; FTV-SVC-10 | Reference-only analytics/event schema pattern |
| FTV-COMP-017 | ADAPT | FTV-SVC-07 | Operational component source |
| FTV-COMP-018 | ADAPT | FTV-SVC-07 | Operational component source |
| FTV-COMP-019 | ADAPT | FTV-SVC-08 | Operational component source |
| FTV-COMP-020 | ADAPT | FTV-SVC-02; FTV-SVC-06; FTV-SVC-08 | Operational scheduler/job source under workflow ownership |
| FTV-COMP-021 | ADAPT | FTV-SVC-09 | Operational component source |
| FTV-COMP-022 | REFERENCE ONLY | FTV-SVC-08; FTV-SVC-09; FTV-SVC-10 | Reference-only rule/workflow pattern |
| FTV-COMP-023 | ADAPT | FTV-SVC-11 | Operational admin/data model source; no business-record ownership |
| FTV-COMP-024 | ADAPT | FTV-SVC-05; FTV-SVC-09; FTV-SVC-11 | Operational activity/review/audit/admin visibility pattern source |
| FTV-COMP-025 | ADAPT | FTV-SVC-09 | Operational authorization/governance source |
| FTV-COMP-026 | REFERENCE ONLY | FTV-SVC-09; FTV-SVC-10 | Reference-only governance/lineage pattern |
| FTV-COMP-027 | REFERENCE ONLY | FTV-SVC-05; FTV-SVC-10 | Reference-only review workspace UX pattern |
| FTV-COMP-028 | ADAPT | FTV-SVC-05 | Operational component source |

---

## 8. Authoritative Data Ownership Matrix

| Domain entity / record | Authoritative owner | Referencing services |
|---|---|---|
| Source reference | FTV-SVC-01 Source & Asset Registry | FTV-SVC-03; FTV-SVC-05; FTV-SVC-09 |
| Asset | FTV-SVC-01 Source & Asset Registry | FTV-SVC-02; FTV-SVC-03; FTV-SVC-04; FTV-SVC-05; FTV-SVC-09 |
| Asset provenance | FTV-SVC-01 Source & Asset Registry | FTV-SVC-03; FTV-SVC-04; FTV-SVC-05; FTV-SVC-09 |
| Rights status | FTV-SVC-01 Source & Asset Registry | FTV-SVC-03; FTV-SVC-04; FTV-SVC-05; FTV-SVC-09 |
| Duplicate match | FTV-SVC-01 Source & Asset Registry | FTV-SVC-02; FTV-SVC-05 |
| Media processing job | FTV-SVC-02 Media Processing | FTV-SVC-01; FTV-SVC-08; FTV-SVC-09 |
| Content brief | FTV-SVC-03 Content Production | FTV-SVC-04; FTV-SVC-05; FTV-SVC-07; FTV-SVC-09 |
| Content package | FTV-SVC-03 Content Production | FTV-SVC-04; FTV-SVC-05; FTV-SVC-06; FTV-SVC-07; FTV-SVC-09 |
| Content version | FTV-SVC-03 Content Production | FTV-SVC-04; FTV-SVC-05; FTV-SVC-09 |
| Publishing package | FTV-SVC-04 Publishing Preparation | FTV-SVC-05; FTV-SVC-06; FTV-SVC-07; FTV-SVC-09 |
| Review assignment | FTV-SVC-05 Human Review & Approval | FTV-SVC-03; FTV-SVC-04; FTV-SVC-08; FTV-SVC-09 |
| Review decision | FTV-SVC-05 Human Review & Approval | FTV-SVC-03; FTV-SVC-04; FTV-SVC-09 |
| Approval status | FTV-SVC-05 Human Review & Approval | FTV-SVC-03; FTV-SVC-04; FTV-SVC-08; FTV-SVC-09 |
| Performance import | FTV-SVC-06 Performance Data | FTV-SVC-07; FTV-SVC-08; FTV-SVC-09 |
| Performance fact | FTV-SVC-06 Performance Data | FTV-SVC-07 |
| Metric definition | FTV-SVC-06 Performance Data | FTV-SVC-07; FTV-SVC-09 |
| Analytics report | FTV-SVC-07 Analytics & Reporting | FTV-SVC-03; FTV-SVC-06 |
| Workflow run | FTV-SVC-08 Workflow Orchestration | FTV-SVC-02; FTV-SVC-05; FTV-SVC-06; FTV-SVC-09 |
| Rule evaluation | FTV-SVC-09 Governance & Rule | FTV-SVC-01; FTV-SVC-03; FTV-SVC-04; FTV-SVC-05; FTV-SVC-08 |
| Audit event | FTV-SVC-09 Governance & Rule | All operational services emit/reference |
| User role | FTV-SVC-09 Governance & Rule | FTV-SVC-01; FTV-SVC-03; FTV-SVC-04; FTV-SVC-05; FTV-SVC-08 |
| Authorization relation | FTV-SVC-09 Governance & Rule | FTV-SVC-01; FTV-SVC-03; FTV-SVC-04; FTV-SVC-05; FTV-SVC-08 |

---

## 9. Cross-Service Dependency Matrix

| Service | Depends on | Dependency reason |
|---|---|---|
| FTV-SVC-01 Source & Asset Registry | FTV-SVC-02; FTV-SVC-05; FTV-SVC-09 | Processing results, duplicate computation, rights/review decisions, authorization/audit. |
| FTV-SVC-02 Media Processing | FTV-SVC-01; FTV-SVC-08; FTV-SVC-09 | Asset inputs, scheduled/manual workflow triggers, audit events. |
| FTV-SVC-03 Content Production | FTV-SVC-01; FTV-SVC-05; FTV-SVC-09 | Approved assets, review/approval state, authorization and rule checks. |
| FTV-SVC-04 Publishing Preparation | FTV-SVC-01; FTV-SVC-03; FTV-SVC-05; FTV-SVC-09 | Rights-safe assets, approved content version, approval status, rule checks. |
| FTV-SVC-05 Human Review & Approval | FTV-SVC-01; FTV-SVC-03; FTV-SVC-04; FTV-SVC-09 | Review targets, rights/provenance context, authorization and rule checks. |
| FTV-SVC-06 Performance Data | FTV-SVC-03; FTV-SVC-04; FTV-SVC-08; FTV-SVC-09 | Content/publishing references, import workflow triggers, audit events. |
| FTV-SVC-07 Analytics & Reporting | FTV-SVC-03; FTV-SVC-04; FTV-SVC-06 | Content context, publishing context, performance facts and metrics. |
| FTV-SVC-08 Workflow Orchestration | FTV-SVC-02; FTV-SVC-05; FTV-SVC-06; FTV-SVC-09 | Job targets, review triggers, import triggers, rule/authorization gate checks. |
| FTV-SVC-09 Governance & Rule | FTV-SVC-01; FTV-SVC-03; FTV-SVC-04; FTV-SVC-05 | Rule context from asset/content/publishing/review records. |
| FTV-SVC-10 Reference Pattern Library | None | Non-runtime reference only. |
| FTV-SVC-11 Core Data Administration | FTV-SVC-01; FTV-SVC-02; FTV-SVC-03; FTV-SVC-04; FTV-SVC-05; FTV-SVC-06; FTV-SVC-07; FTV-SVC-08; FTV-SVC-09 | Non-authoritative admin visibility across owner services. |

---

## 10. Manual Fallback Matrix

| Service | Manual fallback |
|---|---|
| FTV-SVC-01 Source & Asset Registry | Spreadsheet/table for source references, asset IDs, provenance, rights status, and duplicate notes. |
| FTV-SVC-02 Media Processing | Manual FFmpeg commands, manual thumbnail generation, manual metadata notes. |
| FTV-SVC-03 Content Production | Shared document/spreadsheet for briefs, drafts, and version notes. |
| FTV-SVC-04 Publishing Preparation | Manual export folder and publishing checklist. |
| FTV-SVC-05 Human Review & Approval | Review spreadsheet with assignment, reviewer, decision, approval state, timestamp. |
| FTV-SVC-06 Performance Data | Manual CSV/spreadsheet import with hand-mapped metrics. |
| FTV-SVC-07 Analytics & Reporting | Spreadsheet charts and manually written performance notes. |
| FTV-SVC-08 Workflow Orchestration | Manual checklists and direct service actions without automation. |
| FTV-SVC-09 Governance & Rule | Manual role matrix, rule checklist, and sign-off/audit log. |
| FTV-SVC-10 Reference Pattern Library | Read STEP-01 reference notes directly. |
| FTV-SVC-11 Core Data Administration | Inspect owner-service spreadsheets/tables directly using the ownership matrix. |

---

## 11. Service Criticality Summary

| Criticality | Services | Rationale |
|---|---|---|
| Critical | FTV-SVC-01; FTV-SVC-02; FTV-SVC-03; FTV-SVC-04; FTV-SVC-05; FTV-SVC-06; FTV-SVC-09 | Required to intake assets, process media, produce content, prepare publishing packages, review/approve, collect performance data, and enforce governance. |
| Important | FTV-SVC-07; FTV-SVC-08; FTV-SVC-11 | Valuable for MVP operation, but manual fallback exists for early operation. |
| Non-runtime | FTV-SVC-10 | Reference-only pattern holder; not a deployable/runtime service. |

---

## 12. Remaining Ownership Conflicts

| Conflict | Status | Resolution / remaining issue |
|---|---|---|
| Payload vs Directus for content records | Resolved | Content Production owns Content brief/package/version; Directus-derived services reference or administer related records only. |
| Directus vs Human Review for approval records | Resolved | Human Review & Approval owns Review assignment, Review decision, and Approval status. Directus component remains a source pattern. |
| ResourceSpace vs core data service for assets | Resolved | Source & Asset Registry owns asset/provenance/rights records. |
| Activepieces vs Kestra for workflow runs | Resolved | Workflow Orchestration owns Workflow run; Activepieces/Kestra are internal candidate patterns by flow type. |
| Metabase vs Evidence for analytics records | Resolved | Analytics & Reporting owns Analytics report; Metabase dashboards and Evidence narrative reports are both views/report patterns. |
| OpenFGA vs business-rule validation | Resolved | Governance & Rule owns both Authorization relation and Rule evaluation; OpenFGA handles relations, internal validator handles business/state rules. |
| Directus license fallback vs owner assignments | Open verification issue | Ownership is assigned conceptually, but Directus adoption remains license/verification dependent. |
| Core data admin vs domain owners | Resolved | Core Data Administration owns admin configuration only; business records remain owned by their domain services. |

---

## 13. Remaining Service Gaps

| Gap ID | Service | Gap description | Handling in this catalog |
|---|---|---|---|
| SVC-GAP-001 | FTV-SVC-01 | Approved source acquisition beyond manual entry is not covered by selected repos. | Internal module candidate; starts manual-first. |
| SVC-GAP-002 | FTV-SVC-02 | FFmpeg/media normalization, thumbnails, metadata extraction, optional OCR/STT need small MVP wrapper if reference-only repos cannot be reused. | Internal module candidates under Media Processing. |
| SVC-GAP-003 | FTV-SVC-06 | CSV import, API import, metric normalization, and metric mapping are not fully implemented by selected analytics repos. | Internal module candidates under Performance Data. |
| SVC-GAP-004 | FTV-SVC-09 | Lightweight business-rule validation may be needed if OpenFGA is too heavy or too narrow for state validation. | Internal module candidate under Governance & Rule. |
| SVC-GAP-005 | Cross-service | Directus/Payload boundary still requires later design confirmation. | Ownership is resolved here; implementation boundary remains future work. |
| SVC-GAP-006 | FTV-SVC-11 | Core data admin depends on Directus verification; fallback may require owner-specific admin views. | Kept as service gap, not an implementation plan. |

---

## 14. Blocking License or Verification Issues

| Issue | Affected services | Affected source components | Impact |
|---|---|---|---|
| ResourceSpace license/module boundary | FTV-SVC-01; FTV-SVC-02; FTV-SVC-09 | COMP-005; COMP-006; COMP-007 | Blocks direct use of DAM/rights/plugin implementation before verification. |
| Directus source-available/commercial boundary | FTV-SVC-05; FTV-SVC-06; FTV-SVC-09; FTV-SVC-11 | COMP-013; COMP-014 | Blocks relying on Directus-derived admin/activity/review patterns without legal/product verification. |
| Metabase AGPL/commercial boundary | FTV-SVC-07 | COMP-019 | Affects whether dashboard layer can be used as separate service/pattern or only referenced. |
| PhotoPrism AGPL | FTV-SVC-02 | COMP-003; COMP-004 | Keeps media-processing pipeline as reference only unless obligations are accepted. |
| AppFlowy AGPL | FTV-SVC-03; FTV-SVC-05; FTV-SVC-10 | COMP-011; COMP-012 | Keeps planning/review UX as reference only. |
| PostHog OSS/enterprise boundary | FTV-SVC-06; FTV-SVC-07; FTV-SVC-10 | COMP-023 | Keeps event ingestion/product analytics as reference only. |
| Strapi feature/license verification | FTV-SVC-03; FTV-SVC-04 | COMP-015 | Remains reference only; not selected for operational ownership. |
| n8n source-available/commercial boundary | FTV-SVC-08 | COMP-025 | Rejected for MVP; should not be reselected without explicit revisit. |
| Camunda license/deployment boundary | FTV-SVC-08; FTV-SVC-09; FTV-SVC-10 | COMP-030 | Reference only for rule/workflow concepts. |

---

## 15. Self Review

| Check | Result |
|---|---|
| Used only `CANDIDATE_REPOSITORY_INDEX.md` and `FTV_COMPONENT_CATALOG.md` | Pass |
| CAP-01 through CAP-12 covered | Pass |
| Every selected FTV component assigned to at least one service or reference-only service | Pass |
| No important domain record has more than one authoritative owner | Pass |
| No repository is treated directly as a service | Pass |
| Payload/Directus overlap resolved | Pass |
| ResourceSpace/core data overlap resolved | Pass |
| Activepieces/Kestra overlap resolved | Pass |
| Metabase/Evidence overlap resolved | Pass |
| OpenFGA/business-rule validation overlap resolved | Pass |
| Human Review records and Content Production records separated | Pass |
| BUILD gaps converted to service responsibilities or internal module candidates | Pass |
| No System Assembly created | Pass |
| No Architecture Blueprint created | Pass |
| No Build Roadmap or Implementation Plan created | Pass |
| No deployment topology decision made | Pass |

---

## 16. Stop Point

This file is ready for review as the STEP-02 FTV Service Catalog artifact.

No System Assembly, Architecture Blueprint, Build Roadmap, Implementation Plan, code, or deployment topology has been created.
