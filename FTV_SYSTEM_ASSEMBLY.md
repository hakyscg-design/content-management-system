# FTV_SYSTEM_ASSEMBLY.md

**Project:** Football Troll Vault v2  
**Target:** FTV_MVP  
**Phase:** STEP-03 - System Assembly  
**Framework:** Repository Acquisition Framework (RAF v1.1)  
**Source artifacts:** `CANDIDATE_REPOSITORY_INDEX.md`, `FTV_COMPONENT_CATALOG.md`, `FTV_SERVICE_CATALOG.md`  
**Review date:** 2026-07-30  
**Status:** Draft for confirmation  

---

## 1. System Overview

This System Assembly describes how the frozen STEP-02 services fit together to form a complete FTV MVP operating model.

This is **not** an Architecture Blueprint. It does not define deployment topology, database schema, API specification, event schema, queue technology, authentication implementation, cloud/container choice, C4 diagram, build roadmap, implementation plan, or code.

The assembly keeps the service boundaries, ownership, component decisions, and capability mapping from `FTV_SERVICE_CATALOG.md`.

### 1.1 Frozen Services Used

| Service ID | Service name | Role in assembly |
|---|---|---|
| FTV-SVC-01 | Source & Asset Registry Service | Owns source, asset, provenance, rights, and duplicate records. |
| FTV-SVC-02 | Media Processing Service | Owns media processing job lifecycle and derivative/enrichment outputs. |
| FTV-SVC-03 | Content Production Service | Owns content briefs, packages, and versions. |
| FTV-SVC-04 | Publishing Preparation Service | Owns manual publishing packages and readiness checklist state. |
| FTV-SVC-05 | Human Review & Approval Service | Owns review assignments, review decisions, and approval status. |
| FTV-SVC-06 | Performance Data Service | Owns performance imports, facts, metric definitions, metric mapping. |
| FTV-SVC-07 | Analytics & Reporting Service | Owns analytics reports and generated insight summaries. |
| FTV-SVC-08 | Workflow Orchestration Service | Owns workflow runs and coordinates manual/semi-manual automation. |
| FTV-SVC-09 | Governance & Rule Service | Owns roles, authorization relations, rule evaluations, and audit events. |
| FTV-SVC-10 | Reference Pattern Library | Non-runtime holder for reference-only patterns. |
| FTV-SVC-11 | Core Data Administration Service | Owns admin view configuration and non-authoritative cross-domain visibility. |

### 1.2 Assembly Intent

| Assembly goal | Resolution |
|---|---|
| Keep MVP manual-first | Human review, manual publishing, manual fallbacks, and manual overrides remain explicit. |
| Preserve ownership | Each domain record keeps exactly one authoritative owner from STEP-02. |
| Avoid service fragmentation | BUILD gaps become internal modules in existing services, not new services. |
| Keep repositories as sources only | Services are named by responsibility, not repository. |
| Connect all capabilities | CAP-01 through CAP-12 are represented in system, data, event, command, and service interaction flows. |

---

## 2. Service Assembly Details

### FTV-SVC-01 - Source & Asset Registry Service

| Field | Assembly detail |
|---|---|
| Purpose in system | Establish the trusted asset base for all downstream production and review work. |
| Upstream services | FTV-SVC-02 for duplicate/metadata results; FTV-SVC-05 for review decisions; FTV-SVC-09 for rule/authorization results. |
| Downstream services | FTV-SVC-02; FTV-SVC-03; FTV-SVC-04; FTV-SVC-05; FTV-SVC-09; FTV-SVC-11. |
| Data consumed | Approved-key context; manual source reference; media file reference; duplicate candidate result; rights review input; rule evaluation output. |
| Data produced | Source reference; Asset; Asset provenance; Rights status; Duplicate match; asset-ready status. |
| Events received | MediaProcessingCompleted; DuplicateCandidateDetected; ReviewApproved; ReviewRejected; RuleViolationDetected. |
| Events emitted | SourceReferenceCaptured; AssetRegistered; AssetProvenanceUpdated; RightsStatusUpdated; DuplicateMatchRecorded; AssetReadyForProduction. |
| Commands accepted | Capture Source Reference; Register Asset; Update Rights Status; Record Duplicate Decision; Mark Asset Ready. |
| Commands issued | Start Media Processing; Request Rights Review; Evaluate Asset Rules; Record Audit Event. |
| Human interactions | Intake operator captures source; reviewer confirms rights; user resolves duplicate; approver handles restricted asset. |
| Manual fallback | Spreadsheet/table for sources, assets, provenance, rights, and duplicates. |
| External systems | Manual source locations; asset storage location; ResourceSpace/LibrePhotos-derived component patterns only. |
| Internal modules | Approved source acquisition; asset registry; provenance capture; rights status tracking; duplicate decision handling. |
| Failure impact | Downstream content production cannot safely use unregistered or rights-unknown assets. |
| Recovery strategy | Keep asset in intake/blocked state, request manual rights/duplicate review, rerun processing if needed, record audit event. |

### FTV-SVC-02 - Media Processing Service

| Field | Assembly detail |
|---|---|
| Purpose in system | Normalize media and create technical derivatives/enrichment for asset use. |
| Upstream services | FTV-SVC-01 for asset inputs; FTV-SVC-08 for scheduled/manual triggers; FTV-SVC-09 for audit/rule context. |
| Downstream services | FTV-SVC-01; FTV-SVC-03; FTV-SVC-08; FTV-SVC-09; FTV-SVC-11. |
| Data consumed | Asset ID; media reference; requested operation; processing trigger; optional OCR/STT request. |
| Data produced | Media processing job; normalized media reference; thumbnail reference; extracted metadata; OCR/STT candidate enrichment; duplicate/similarity candidate result. |
| Events received | AssetRegistered; StartMediaProcessingRequested; WorkflowStarted; RetryRequested. |
| Events emitted | MediaProcessingStarted; MediaProcessingCompleted; MediaProcessingFailed; ThumbnailGenerated; MetadataExtracted; DuplicateCandidateDetected; EnrichmentCandidateGenerated. |
| Commands accepted | Start Media Processing; Retry Media Processing; Generate Thumbnail; Extract Metadata; Run Optional OCR/STT. |
| Commands issued | Update Asset Processing Result; Record Duplicate Candidate; Record Audit Event; Mark Workflow Step Complete. |
| Human interactions | Operator retries failed job; reviewer accepts enrichment; user inspects duplicate candidates. |
| Manual fallback | Manual FFmpeg commands, manual thumbnail creation, manual metadata notes. |
| External systems | FFmpeg; optional OCR/STT runtime; PhotoPrism and ResourceSpace patterns as reference only; Kestra scheduling pattern if needed. |
| Internal modules | FFmpeg/media normalization; thumbnail generation; metadata extraction; optional OCR/STT enrichment; duplicate/similarity computation. |
| Failure impact | Asset may remain usable manually, but derivatives, thumbnails, and metadata may be incomplete. |
| Recovery strategy | Mark job failed, expose error, allow manual retry or manual derivative upload, preserve original asset and audit trail. |

### FTV-SVC-03 - Content Production Service

| Field | Assembly detail |
|---|---|
| Purpose in system | Turn approved assets into structured content briefs, packages, and versions. |
| Upstream services | FTV-SVC-01 for approved assets; FTV-SVC-05 for review feedback; FTV-SVC-09 for rule/authorization checks; FTV-SVC-11 for admin visibility. |
| Downstream services | FTV-SVC-04; FTV-SVC-05; FTV-SVC-06; FTV-SVC-07; FTV-SVC-09; FTV-SVC-11. |
| Data consumed | Asset references; rights status; provenance summary; production notes; review feedback; rule evaluation result. |
| Data produced | Content brief; Content package; Content version; review-ready state. |
| Events received | AssetReadyForProduction; ReviewRejected; ReviewApproved; RuleViolationDetected. |
| Events emitted | ContentBriefCreated; ContentPackageCreated; ContentVersionCreated; ContentPackageUpdated; ContentReadyForReview. |
| Commands accepted | Create Content Brief; Create Content Package; Add Asset To Package; Create Content Version; Mark Content Ready For Review. |
| Commands issued | Request Review; Evaluate Content Rules; Record Audit Event; Create Publishing Package after approval. |
| Human interactions | Producer creates brief; editor creates version; user applies review feedback. |
| Manual fallback | Shared document or spreadsheet for briefs, packages, and version notes. |
| External systems | Payload-derived content/draft patterns; AppFlowy planning UX reference only. |
| Internal modules | Content brief editor; content package manager; version tracking; production state tracking. |
| Failure impact | Publishing preparation cannot proceed without an approved content package/version. |
| Recovery strategy | Keep content in draft/rework state, preserve prior version, request review again when corrected. |

### FTV-SVC-04 - Publishing Preparation Service

| Field | Assembly detail |
|---|---|
| Purpose in system | Prepare approved content for human-managed publishing without autonomous posting. |
| Upstream services | FTV-SVC-03 for content package/version; FTV-SVC-05 for approval status; FTV-SVC-01 for rights status; FTV-SVC-09 for rule checks. |
| Downstream services | FTV-SVC-05; FTV-SVC-06; FTV-SVC-07; FTV-SVC-09; FTV-SVC-11. |
| Data consumed | Approved content version; asset rights status; caption/title/tag inputs; intended publish timing; checklist values. |
| Data produced | Publishing package; readiness checklist; export-ready signal; manual publishing reference. |
| Events received | ReviewApproved; ContentPackageUpdated; RuleViolationDetected. |
| Events emitted | PublishingPackageCreated; PublishingPackageReady; PublishingPackageBlocked; ManualPublishingCompleted. |
| Commands accepted | Create Publishing Package; Update Publishing Metadata; Mark Publishing Package Ready; Mark Manual Publishing Complete. |
| Commands issued | Request Publishing Review; Evaluate Publishing Rules; Record Audit Event; Prepare Performance Import Reference. |
| Human interactions | Publisher edits metadata; reviewer checks readiness; human manually posts/exports. |
| Manual fallback | Manual export folder and publishing checklist. |
| External systems | Manual publishing destinations; Ghost/Payload metadata patterns; Penpot template reference only. |
| Internal modules | Publishing metadata checklist; manual export package builder; publish-readiness state. |
| Failure impact | Content may be approved but not publishable/export-ready. |
| Recovery strategy | Keep package in draft/blocked state, request missing metadata or rights correction, repeat review if needed. |

### FTV-SVC-05 - Human Review & Approval Service

| Field | Assembly detail |
|---|---|
| Purpose in system | Keep humans in control of approval decisions across assets, content, and publishing packages. |
| Upstream services | FTV-SVC-01; FTV-SVC-03; FTV-SVC-04; FTV-SVC-08; FTV-SVC-09; FTV-SVC-11. |
| Downstream services | FTV-SVC-01; FTV-SVC-03; FTV-SVC-04; FTV-SVC-08; FTV-SVC-09; FTV-SVC-11. |
| Data consumed | Review target reference; rights/provenance context; content version; publishing package; rule evaluation; reviewer action. |
| Data produced | Review assignment; Review decision; Approval status; rejection reason; approval history. |
| Events received | ContentReadyForReview; PublishingPackageReady; RuleViolationDetected; WorkflowFailed; ReviewRequested. |
| Events emitted | ReviewRequested; ReviewAssigned; ReviewApproved; ReviewRejected; ApprovalStatusChanged; ManualOverrideRecorded. |
| Commands accepted | Request Review; Assign Reviewer; Approve Package; Reject Package; Record Override; Update Approval Status. |
| Commands issued | Evaluate Review Rules; Notify Workflow; Record Audit Event; Release Approved Package. |
| Human interactions | Reviewer approves/rejects; approver records override; publisher requests review. |
| Manual fallback | Review spreadsheet with assignment, status, decision, comments, timestamps. |
| External systems | Directus review/activity pattern; Payload status pattern; AppFlowy UX reference only. |
| Internal modules | Assignment queue; decision capture; approval status tracker; override reason capture. |
| Failure impact | Content/publishing cannot advance through human-governed gates. |
| Recovery strategy | Keep target pending/rework/blocked, reassign reviewer, preserve decision trail, allow manual sign-off. |

### FTV-SVC-06 - Performance Data Service

| Field | Assembly detail |
|---|---|
| Purpose in system | Own imported and normalized performance data for later analysis and learning. |
| Upstream services | FTV-SVC-04 for publishing references; FTV-SVC-08 for import triggers; FTV-SVC-09 for audit/rule context; FTV-SVC-11 for admin visibility. |
| Downstream services | FTV-SVC-07; FTV-SVC-08; FTV-SVC-09; FTV-SVC-11. |
| Data consumed | CSV file; manual metrics; future API response; publishing package reference; content package reference; metric mapping. |
| Data produced | Performance import; Performance fact; Metric definition; import errors; metric mapping results. |
| Events received | ManualPublishingCompleted; ImportMetricsRequested; WorkflowStarted; RetryRequested. |
| Events emitted | PerformanceImportStarted; PerformanceImported; PerformanceImportFailed; MetricsNormalized; MetricMappingUpdated. |
| Commands accepted | Import Metrics; Import CSV; Import API Metrics; Map Metric; Normalize Metrics; Retry Import. |
| Commands issued | Generate Report; Record Audit Event; Mark Workflow Step Complete. |
| Human interactions | User uploads CSV; maps columns; corrects failed rows; confirms metric mapping. |
| Manual fallback | Manual spreadsheet import and hand-entered metrics. |
| External systems | CSV files; future platform API responses; Directus staging pattern; PostHog ingestion reference only; Kestra schedule pattern if needed. |
| Internal modules | CSV import; API import candidate; metric normalization; metric mapping; import validation. |
| Failure impact | Analytics may be stale or incomplete; learning loop cannot close for affected content. |
| Recovery strategy | Keep import failed/pending, expose row errors, allow remap/retry/manual entry, preserve previous facts. |

### FTV-SVC-07 - Analytics & Reporting Service

| Field | Assembly detail |
|---|---|
| Purpose in system | Turn performance facts into dashboards, narrative reports, and repeat/avoid learning outputs. |
| Upstream services | FTV-SVC-06 for facts/metrics; FTV-SVC-03 and FTV-SVC-04 for content/publishing context. |
| Downstream services | FTV-SVC-03; FTV-SVC-06; FTV-SVC-11. |
| Data consumed | Performance facts; metric definitions; content package reference; publishing package reference; report query/template. |
| Data produced | Analytics report; dashboard/report metadata; learning summary; report snapshot reference. |
| Events received | PerformanceImported; MetricsNormalized; GenerateReportRequested. |
| Events emitted | AnalyticsGenerated; AnalyticsGenerationFailed; LearningSummaryCreated. |
| Commands accepted | Generate Report; Refresh Dashboard; Create Narrative Report; Record Learning Summary. |
| Commands issued | Record Report Snapshot; Notify Content Production of Learning; Record Audit Event if governed action is involved. |
| Human interactions | Analyst reviews dashboard; editor reads learning report; human confirms insight relevance. |
| Manual fallback | Spreadsheet charts and manually written learning notes. |
| External systems | Metabase dashboard pattern; Evidence SQL+Markdown report pattern. |
| Internal modules | Dashboard/report view; narrative report builder; learning summary tracker. |
| Failure impact | Data remains available, but learning loop is delayed or manual. |
| Recovery strategy | Fall back to manual spreadsheet/report, rerun generation, keep previous report available. |

### FTV-SVC-08 - Workflow Orchestration Service

| Field | Assembly detail |
|---|---|
| Purpose in system | Coordinate visible workflow runs for manual/semi-manual operations and optional scheduled jobs. |
| Upstream services | FTV-SVC-02; FTV-SVC-05; FTV-SVC-06; FTV-SVC-09. |
| Downstream services | FTV-SVC-02; FTV-SVC-05; FTV-SVC-06; FTV-SVC-09; FTV-SVC-11. |
| Data consumed | Trigger request; target record reference; approval state change; import/processing request; rule gate result. |
| Data produced | Workflow run; run status; run error; retry status; workflow completion signal. |
| Events received | AssetRegistered; ReviewRequested; ReviewApproved; ImportMetricsRequested; RuleViolationDetected. |
| Events emitted | WorkflowStarted; WorkflowStepCompleted; WorkflowFailed; WorkflowCompleted; RetryRequested. |
| Commands accepted | Start Workflow; Trigger Processing; Trigger Import; Retry Workflow; Cancel Workflow. |
| Commands issued | Start Media Processing; Request Review; Import Metrics; Evaluate Workflow Rules; Record Audit Event. |
| Human interactions | User starts workflow; user retries failed run; user reviews workflow status. |
| Manual fallback | Manual checklist and direct service action without automation. |
| External systems | Activepieces flow pattern; Kestra scheduler pattern; Camunda reference only; n8n and Temporal rejected. |
| Internal modules | Human-triggered flow runner; scheduled job trigger; run history; retry/error handling. |
| Failure impact | Automation stops, but manual operation can continue using service fallbacks. |
| Recovery strategy | Mark run failed, preserve run history, allow manual continuation or retry from last safe step. |

### FTV-SVC-09 - Governance & Rule Service

| Field | Assembly detail |
|---|---|
| Purpose in system | Enforce human-governed permissions, lightweight state rules, and auditability. |
| Upstream services | FTV-SVC-01; FTV-SVC-03; FTV-SVC-04; FTV-SVC-05; FTV-SVC-08; FTV-SVC-11. |
| Downstream services | All operational services. |
| Data consumed | User role; authorization relation; target record reference; requested operation; rights status; approval status; business-rule context. |
| Data produced | Rule evaluation; Authorization relation; User role; Audit event; allow/deny outcome. |
| Events received | Any governed command request; ApprovalStatusChanged; RightsStatusUpdated; WorkflowFailed. |
| Events emitted | RuleEvaluationCompleted; RuleViolationDetected; AuthorizationRelationUpdated; AuditEventRecorded. |
| Commands accepted | Evaluate Rule; Check Authorization; Update User Role; Update Authorization Relation; Record Audit Event. |
| Commands issued | Block Action; Request Manual Override; Notify Review; Record Audit Event. |
| Human interactions | Admin assigns role; reviewer sees blocked reason; approver records override; governance reviewer inspects audit trail. |
| Manual fallback | Manual role matrix, rule checklist, and sign-off/audit log. |
| External systems | OpenFGA authorization pattern; Directus activity pattern; Camunda rule reference; DataHub/OpenMetadata vocabulary reference. |
| Internal modules | Authorization relation checker; lightweight business-rule validator; audit event recorder; role manager. |
| Failure impact | Unsafe actions must be blocked or routed to manual approval; audit trail may be incomplete if not recovered. |
| Recovery strategy | Default to conservative deny/manual review, record delayed audit event, reconcile role/relation state manually if needed. |

### FTV-SVC-10 - Reference Pattern Library

| Field | Assembly detail |
|---|---|
| Purpose in system | Preserve reference-only patterns without promoting them to runtime dependencies. |
| Upstream services | None at runtime. |
| Downstream services | Human readers in later approved phases only. |
| Data consumed | STEP-01/STEP-02 reference-only component notes. |
| Data produced | Reference pattern notes. |
| Events received | None. |
| Events emitted | None. |
| Commands accepted | None for MVP runtime. |
| Commands issued | None for MVP runtime. |
| Human interactions | Architect/reviewer consults reference notes later. |
| Manual fallback | Read frozen artifacts directly. |
| External systems | None for MVP runtime. |
| Internal modules | Reference index only. |
| Failure impact | No runtime impact. |
| Recovery strategy | Use the frozen STEP-01/STEP-02 artifacts as source of truth. |

### FTV-SVC-11 - Core Data Administration Service

| Field | Assembly detail |
|---|---|
| Purpose in system | Provide non-authoritative cross-domain visibility and admin views without owning business records. |
| Upstream services | FTV-SVC-01 through FTV-SVC-09. |
| Downstream services | Human admins; owner services by reference only. |
| Data consumed | Authoritative records from owner services; admin configuration; display metadata. |
| Data produced | Admin view configuration; schema/display metadata; non-authoritative lookup/index records. |
| Events received | AssetRegistered; ContentPackageCreated; PublishingPackageReady; ReviewApproved; PerformanceImported; AuditEventRecorded. |
| Events emitted | AdminViewUpdated; AdminRecordInspectionRequested. |
| Commands accepted | Configure Admin View; Inspect Record; Update Display Metadata. |
| Commands issued | Redirect To Owner Service; Request Owner Record Update; Record Audit Event if governed action is involved. |
| Human interactions | Admin browses records; admin inspects data quality; admin follows owner-service links. |
| Manual fallback | Inspect owner-service spreadsheets/tables using the ownership matrix. |
| External systems | Directus admin/data modeling pattern. |
| Internal modules | Admin view configuration; non-authoritative cross-record index; display metadata manager. |
| Failure impact | Domain services can continue, but cross-domain visibility is reduced. |
| Recovery strategy | Use owner-service interfaces/fallbacks directly, rebuild non-authoritative views from owner records. |

---

## 3. End-to-End Data Flow

| Step | Flow stage | Producer | Consumer | Authoritative owner | State transition |
|---:|---|---|---|---|---|
| 1 | Source | Human operator / approved-key context | FTV-SVC-01 | FTV-SVC-01 | Source reference: captured -> registered or rejected |
| 2 | Asset Intake | FTV-SVC-01 | FTV-SVC-02; FTV-SVC-05; FTV-SVC-09 | FTV-SVC-01 | Asset: intake -> registered -> rights pending |
| 3 | Media Processing | FTV-SVC-02 | FTV-SVC-01; FTV-SVC-03 | FTV-SVC-02 for job; FTV-SVC-01 for asset update | Media processing job: queued -> running -> completed/failed |
| 4 | Content Production | FTV-SVC-03 | FTV-SVC-05; FTV-SVC-04 | FTV-SVC-03 | Content package: draft -> review ready |
| 5 | Publishing Preparation | FTV-SVC-04 | FTV-SVC-05 | FTV-SVC-04 | Publishing package: draft -> checklist ready -> review requested |
| 6 | Human Review | FTV-SVC-05 | FTV-SVC-03; FTV-SVC-04; FTV-SVC-09 | FTV-SVC-05 | Review: requested -> assigned -> approved/rejected |
| 7 | Workflow | FTV-SVC-08 | FTV-SVC-02; FTV-SVC-05; FTV-SVC-06 | FTV-SVC-08 | Workflow run: started -> step completed -> completed/failed |
| 8 | Manual Publishing | Human publisher / FTV-SVC-04 | FTV-SVC-06 | FTV-SVC-04 for publishing package | Publishing package: approved -> manually published |
| 9 | Performance Import | FTV-SVC-06 | FTV-SVC-07 | FTV-SVC-06 | Performance import: pending -> importing -> imported/failed |
| 10 | Analytics | FTV-SVC-07 | FTV-SVC-03; humans | FTV-SVC-07 | Analytics report: requested -> generated/failed |
| 11 | Learning | FTV-SVC-07 / human analyst | FTV-SVC-03 | FTV-SVC-07 for report; FTV-SVC-03 references learning in future briefs | Learning summary: generated -> reviewed -> referenced |

### 3.1 Capability Flow Coverage

| Capability | Primary flow coverage |
|---|---|
| CAP-01 | Source -> Asset Intake |
| CAP-02 | Asset Intake -> Rights/Duplicate handling -> Asset ready |
| CAP-03 | Asset Intake -> Media Processing -> Asset update |
| CAP-04 | Asset ready -> Content Production -> Review ready |
| CAP-05 | Content approved -> Publishing Preparation -> Manual publishing |
| CAP-06 | Manual publishing -> Performance Import -> Normalized facts |
| CAP-07 | Performance facts -> Analytics -> Learning |
| CAP-08 | Workflow coordinates processing, review, import, retry where useful |
| CAP-09 | Governance/rules evaluate actions and block invalid transitions |
| CAP-10 | Core Data Administration provides non-authoritative visibility |
| CAP-11 | Governance/rules, audit, rights context, and authorization relations |
| CAP-12 | Human Review owns assignment, decision, approval status |

---

## 4. Event Flow

| Event | Producer | Consumers | Payload summary | Trigger condition |
|---|---|---|---|---|
| SourceReferenceCaptured | FTV-SVC-01 | FTV-SVC-09; FTV-SVC-11 | Source reference ID, source URL/account, capture user, status. | Human captures source reference. |
| AssetRegistered | FTV-SVC-01 | FTV-SVC-02; FTV-SVC-08; FTV-SVC-09; FTV-SVC-11 | Asset ID, media reference, provenance reference, rights status. | Asset record is accepted into registry. |
| AssetProvenanceUpdated | FTV-SVC-01 | FTV-SVC-03; FTV-SVC-05; FTV-SVC-09 | Asset ID, provenance reference, change reason. | Provenance fields are added or corrected. |
| RightsStatusUpdated | FTV-SVC-01 | FTV-SVC-03; FTV-SVC-04; FTV-SVC-05; FTV-SVC-09 | Asset ID, rights status, restriction summary. | Rights review changes asset usability. |
| MediaProcessingStarted | FTV-SVC-02 | FTV-SVC-08; FTV-SVC-11 | Processing job ID, asset ID, operation. | Processing command accepted. |
| MediaProcessingCompleted | FTV-SVC-02 | FTV-SVC-01; FTV-SVC-03; FTV-SVC-08; FTV-SVC-11 | Job ID, asset ID, derivative refs, metadata refs. | Processing job completes successfully. |
| MediaProcessingFailed | FTV-SVC-02 | FTV-SVC-01; FTV-SVC-08; FTV-SVC-09; FTV-SVC-11 | Job ID, asset ID, error summary, retryable flag. | Processing job fails. |
| DuplicateCandidateDetected | FTV-SVC-02 | FTV-SVC-01; FTV-SVC-05 | Asset IDs, similarity score, method. | Duplicate/similarity computation finds candidate. |
| DuplicateMatchRecorded | FTV-SVC-01 | FTV-SVC-05; FTV-SVC-09 | Duplicate match ID, asset IDs, decision status. | Human or service records duplicate decision. |
| AssetReadyForProduction | FTV-SVC-01 | FTV-SVC-03; FTV-SVC-09 | Asset ID, rights status, media readiness. | Asset passes minimum intake/rights/processing checks. |
| ContentBriefCreated | FTV-SVC-03 | FTV-SVC-11 | Brief ID, producer, source context. | Producer creates a brief. |
| ContentPackageCreated | FTV-SVC-03 | FTV-SVC-04; FTV-SVC-05; FTV-SVC-11 | Content package ID, brief ID, asset refs. | Package is created from brief/assets. |
| ContentVersionCreated | FTV-SVC-03 | FTV-SVC-05; FTV-SVC-11 | Content package ID, version ID, draft status. | New draft/version is saved. |
| ContentReadyForReview | FTV-SVC-03 | FTV-SVC-05; FTV-SVC-08; FTV-SVC-09 | Content package ID, version ID, review target. | Producer marks content ready. |
| ReviewRequested | FTV-SVC-05 or FTV-SVC-08 | FTV-SVC-05; FTV-SVC-09; FTV-SVC-11 | Review assignment target, requested by, priority. | Content/publishing package needs human review. |
| ReviewAssigned | FTV-SVC-05 | FTV-SVC-08; FTV-SVC-11 | Assignment ID, reviewer, target reference. | Reviewer is assigned. |
| ReviewApproved | FTV-SVC-05 | FTV-SVC-03; FTV-SVC-04; FTV-SVC-08; FTV-SVC-09; FTV-SVC-11 | Decision ID, target reference, approval status. | Reviewer approves target. |
| ReviewRejected | FTV-SVC-05 | FTV-SVC-01; FTV-SVC-03; FTV-SVC-04; FTV-SVC-08; FTV-SVC-09 | Decision ID, target reference, rejection reason. | Reviewer rejects target. |
| ApprovalStatusChanged | FTV-SVC-05 | FTV-SVC-03; FTV-SVC-04; FTV-SVC-09; FTV-SVC-11 | Target reference, prior status, new status. | Approval status changes. |
| PublishingPackageCreated | FTV-SVC-04 | FTV-SVC-05; FTV-SVC-11 | Publishing package ID, content version ref. | Approved content enters publishing prep. |
| PublishingPackageReady | FTV-SVC-04 | FTV-SVC-05; FTV-SVC-08; FTV-SVC-09; FTV-SVC-11 | Publishing package ID, checklist summary. | Checklist reaches ready state. |
| PublishingPackageBlocked | FTV-SVC-04 or FTV-SVC-09 | FTV-SVC-05; FTV-SVC-11 | Package ID, blocking reason. | Missing metadata, rights issue, or rule violation. |
| ManualPublishingCompleted | FTV-SVC-04 / human publisher | FTV-SVC-06; FTV-SVC-07; FTV-SVC-11 | Publishing package ID, platform/post reference. | Human records manual publishing completion. |
| ImportMetricsRequested | FTV-SVC-08 or human user | FTV-SVC-06 | Import target, source platform, method. | User or schedule requests performance import. |
| PerformanceImportStarted | FTV-SVC-06 | FTV-SVC-08; FTV-SVC-11 | Import ID, source, method. | Import begins. |
| PerformanceImported | FTV-SVC-06 | FTV-SVC-07; FTV-SVC-08; FTV-SVC-11 | Import ID, fact count, metric summary. | Import and normalization complete. |
| PerformanceImportFailed | FTV-SVC-06 | FTV-SVC-08; FTV-SVC-09; FTV-SVC-11 | Import ID, error summary, failed rows. | Import fails validation or processing. |
| MetricsNormalized | FTV-SVC-06 | FTV-SVC-07 | Metric definitions, mapping summary, fact references. | Imported metrics are normalized. |
| AnalyticsGenerated | FTV-SVC-07 | FTV-SVC-03; FTV-SVC-06; FTV-SVC-11 | Report ID, report type, content/package refs. | Report generation succeeds. |
| AnalyticsGenerationFailed | FTV-SVC-07 | FTV-SVC-06; FTV-SVC-11 | Report ID/request, error summary. | Report generation fails. |
| LearningSummaryCreated | FTV-SVC-07 | FTV-SVC-03 | Learning summary ID, repeat/avoid notes. | Analyst/report records learning. |
| WorkflowStarted | FTV-SVC-08 | Target service; FTV-SVC-11 | Workflow run ID, target, trigger. | Workflow command accepted. |
| WorkflowStepCompleted | FTV-SVC-08 | Target service; FTV-SVC-11 | Run ID, step ID, result. | A workflow step completes. |
| WorkflowCompleted | FTV-SVC-08 | Target services; FTV-SVC-11 | Run ID, status, completion summary. | All workflow steps complete. |
| WorkflowFailed | FTV-SVC-08 | Target services; FTV-SVC-05; FTV-SVC-09 | Run ID, failed step, error, retryable flag. | Workflow step fails. |
| RuleEvaluationCompleted | FTV-SVC-09 | Requesting service | Rule evaluation ID, allow/deny, reason. | Rule check completes. |
| RuleViolationDetected | FTV-SVC-09 | FTV-SVC-01; FTV-SVC-03; FTV-SVC-04; FTV-SVC-05; FTV-SVC-08 | Target reference, violated rule, recommended action. | Action fails rule or rights/status gate. |
| AuthorizationRelationUpdated | FTV-SVC-09 | Affected services; FTV-SVC-11 | Subject/object relation, change reason. | Admin updates role/relation. |
| AuditEventRecorded | FTV-SVC-09 | FTV-SVC-11 | Audit event ID, actor, action, target. | Governed action is recorded. |
| AdminViewUpdated | FTV-SVC-11 | Human admin | Admin view ID, affected record type. | Admin view configuration changes. |

---

## 5. Command Flow

| Command | Sender | Receiver | Expected result | Failure handling |
|---|---|---|---|---|
| Capture Source Reference | Human operator | FTV-SVC-01 | Source reference captured. | Keep source in manual notes; record validation issue. |
| Register Asset | Human operator / FTV-SVC-01 | FTV-SVC-01 | AssetRegistered emitted. | Reject or keep in intake pending with reason. |
| Start Media Processing | FTV-SVC-01 / FTV-SVC-08 / human | FTV-SVC-02 | Media processing job queued/started. | Mark failed/pending; allow manual FFmpeg fallback. |
| Retry Media Processing | Human / FTV-SVC-08 | FTV-SVC-02 | Failed job retries. | Preserve failed state and manual fallback. |
| Update Rights Status | Human reviewer | FTV-SVC-01 | Rights status updated. | Keep rights unknown/restricted; block downstream use. |
| Record Duplicate Decision | Human reviewer | FTV-SVC-01 | Duplicate match resolved. | Keep asset blocked/pending. |
| Create Content Brief | Producer | FTV-SVC-03 | Content brief created. | Keep notes externally and retry creation. |
| Create Content Package | Producer | FTV-SVC-03 | Content package created. | Keep package draft incomplete. |
| Create Content Version | Editor | FTV-SVC-03 | Version created and tracked. | Preserve prior version and manual notes. |
| Mark Content Ready For Review | Producer | FTV-SVC-03 | Review request can be issued. | Rule violation blocks transition; return to draft. |
| Request Review | FTV-SVC-03 / FTV-SVC-04 / human | FTV-SVC-05 | Review assignment created or queued. | Manual reviewer assignment. |
| Assign Reviewer | Coordinator | FTV-SVC-05 | Reviewer assigned. | Keep review unassigned/pending. |
| Approve Package | Reviewer | FTV-SVC-05 | Approval status approved. | If rule check fails, require override or reject. |
| Reject Package | Reviewer | FTV-SVC-05 | Target returns to rework/blocked state. | If save fails, record manual rejection note. |
| Create Publishing Package | FTV-SVC-03 / publisher | FTV-SVC-04 | Publishing package created. | Keep content approved but unpublished. |
| Update Publishing Metadata | Publisher | FTV-SVC-04 | Checklist/metadata updated. | Keep package draft/blocked. |
| Mark Publishing Package Ready | Publisher | FTV-SVC-04 | Ready event emitted and review can occur. | Rule violation or missing field blocks readiness. |
| Mark Manual Publishing Complete | Publisher | FTV-SVC-04 | Publishing completion reference recorded. | Keep package ready but not completed. |
| Import Metrics | Human / FTV-SVC-08 | FTV-SVC-06 | Import started and normalized. | Import failed with row errors and retry option. |
| Map Metric | Analyst | FTV-SVC-06 | Metric definition/mapping updated. | Keep metric unmapped and excluded from analytics. |
| Normalize Metrics | FTV-SVC-06 | FTV-SVC-06 | Performance facts produced. | Preserve raw import and error rows. |
| Generate Report | Analyst / FTV-SVC-06 | FTV-SVC-07 | Analytics report generated. | Fall back to manual spreadsheet report. |
| Start Workflow | Human / service | FTV-SVC-08 | Workflow run started. | Manual checklist fallback. |
| Retry Workflow | Human | FTV-SVC-08 | Failed run retries. | Keep failed run and continue manually. |
| Evaluate Rule | Any operational service | FTV-SVC-09 | Rule evaluation allow/deny. | Default to deny/manual review if unavailable. |
| Check Authorization | Any operational service | FTV-SVC-09 | Authorization result returned. | Default to deny/manual approval. |
| Record Audit Event | Any operational service | FTV-SVC-09 | Audit event recorded. | Queue/manual log and reconcile later. |
| Configure Admin View | Admin | FTV-SVC-11 | Admin view updated. | Use owner-service views directly. |

---

## 6. State Transition Models

### 6.1 Asset

| Item | Definition |
|---|---|
| Authoritative owner | FTV-SVC-01 |
| Lifecycle | Captured -> Registered -> Rights Pending -> Processing Pending -> Ready -> Restricted / Rejected / Archived |
| Allowed transitions | Captured to Registered; Registered to Rights Pending; Rights Pending to Processing Pending or Restricted; Processing Pending to Ready or Processing Failed; Ready to Restricted if rights change; any active state to Archived with audit. |
| Invalid transitions | Captured directly to Ready; Restricted to Ready without rights update; Rejected to Ready without new review; Archived to active without explicit restore/audit. |

### 6.2 Content Package

| Item | Definition |
|---|---|
| Authoritative owner | FTV-SVC-03 |
| Lifecycle | Draft -> Review Ready -> In Review -> Approved -> Rework / Archived |
| Allowed transitions | Draft to Review Ready; Review Ready to In Review; In Review to Approved or Rework; Rework to Draft; Approved to Publishing Preparation; any active state to Archived with audit. |
| Invalid transitions | Draft directly to Approved; Rework directly to Approved; Approved edited without creating/recording a new version. |

### 6.3 Publishing Package

| Item | Definition |
|---|---|
| Authoritative owner | FTV-SVC-04 |
| Lifecycle | Draft -> Checklist Ready -> Review Requested -> Approved -> Manually Published -> Performance Pending / Blocked / Archived |
| Allowed transitions | Draft to Checklist Ready; Checklist Ready to Review Requested; Review Requested to Approved or Blocked; Approved to Manually Published; Manually Published to Performance Pending; any active state to Archived with audit. |
| Invalid transitions | Draft directly to Manually Published; Blocked to Approved without resolving block; Manually Published without approval. |

### 6.4 Review

| Item | Definition |
|---|---|
| Authoritative owner | FTV-SVC-05 |
| Lifecycle | Requested -> Assigned -> In Review -> Approved / Rejected / Override Approved / Cancelled |
| Allowed transitions | Requested to Assigned; Assigned to In Review; In Review to Approved or Rejected; Rejected to Requested after rework; blocked action to Override Approved with reason; Requested/Assigned to Cancelled. |
| Invalid transitions | Requested directly to Approved without reviewer/decision; Rejected to Approved without new/reopened review; Override Approved without reason. |

### 6.5 Workflow Run

| Item | Definition |
|---|---|
| Authoritative owner | FTV-SVC-08 |
| Lifecycle | Created -> Running -> Step Completed -> Completed / Failed / Cancelled |
| Allowed transitions | Created to Running; Running to Step Completed; Step Completed to Running for next step; Running/Step Completed to Completed or Failed; Failed to Running via retry; Running to Cancelled by human. |
| Invalid transitions | Created directly to Completed; Failed to Completed without retry/manual resolution; Cancelled to Running without new run. |

### 6.6 Performance Import

| Item | Definition |
|---|---|
| Authoritative owner | FTV-SVC-06 |
| Lifecycle | Pending -> Importing -> Mapping Required -> Normalized -> Imported / Failed / Cancelled |
| Allowed transitions | Pending to Importing; Importing to Mapping Required, Normalized, or Failed; Mapping Required to Normalized after mapping; Normalized to Imported; Failed to Importing via retry; Pending/Mapping Required to Cancelled. |
| Invalid transitions | Pending directly to Imported; Failed to Imported without retry/normalization; Mapping Required to Imported without mapping. |

### 6.7 Media Processing Job

| Item | Definition |
|---|---|
| Authoritative owner | FTV-SVC-02 |
| Lifecycle | Queued -> Running -> Completed / Failed / Cancelled |
| Allowed transitions | Queued to Running; Running to Completed or Failed; Failed to Queued via retry; Queued/Running to Cancelled by human. |
| Invalid transitions | Queued directly to Completed without processing result; Failed to Completed without retry/manual result; Cancelled to Running without new job. |

### 6.8 Domain Record Lifecycle Coverage

| Domain record | Authoritative owner | Lifecycle coverage |
|---|---|---|
| Source reference | FTV-SVC-01 | Captured -> registered/rejected -> archived. |
| Asset | FTV-SVC-01 | Covered in Asset lifecycle. |
| Asset provenance | FTV-SVC-01 | Draft/captured -> verified -> corrected/archived. |
| Rights status | FTV-SVC-01 | Unknown -> pending -> approved/restricted/rejected/expired. |
| Duplicate match | FTV-SVC-01 | Candidate -> pending review -> confirmed duplicate/not duplicate/ignored. |
| Media processing job | FTV-SVC-02 | Covered in Media Processing Job lifecycle. |
| Content brief | FTV-SVC-03 | Draft -> active -> converted to package/archived. |
| Content package | FTV-SVC-03 | Covered in Content Package lifecycle. |
| Content version | FTV-SVC-03 | Draft -> review version -> approved/reworked/archived. |
| Publishing package | FTV-SVC-04 | Covered in Publishing Package lifecycle. |
| Review assignment | FTV-SVC-05 | Requested -> assigned -> completed/cancelled. |
| Review decision | FTV-SVC-05 | Draft decision -> recorded -> superseded by new review if reopened. |
| Approval status | FTV-SVC-05 | Pending -> approved/rejected/override approved/cancelled. |
| Performance import | FTV-SVC-06 | Covered in Performance Import lifecycle. |
| Performance fact | FTV-SVC-06 | Imported -> validated -> corrected/superseded. |
| Metric definition | FTV-SVC-06 | Draft -> active -> deprecated. |
| Analytics report | FTV-SVC-07 | Requested -> generated -> reviewed/archived. |
| Workflow run | FTV-SVC-08 | Covered in Workflow Run lifecycle. |
| Rule evaluation | FTV-SVC-09 | Requested -> evaluated -> recorded. |
| Audit event | FTV-SVC-09 | Recorded -> retained/exported if needed. |
| User role | FTV-SVC-09 | Draft/assigned -> active -> revoked. |
| Authorization relation | FTV-SVC-09 | Created -> active -> revoked/expired. |

---

## 7. Cross-Service Contracts

| Contract | Communication pair | Contract summary | Ownership | Validation | Error conditions |
|---|---|---|---|---|---|
| C-01 Asset to Processing | FTV-SVC-01 -> FTV-SVC-02 | Asset ID, media reference, provenance reference, requested operation. | Asset owned by SVC-01; job owned by SVC-02. | Asset exists, media reference present, rights not rejected. | Missing media, blocked rights, unsupported operation. |
| C-02 Processing Result to Asset | FTV-SVC-02 -> FTV-SVC-01 | Job ID, asset ID, derivative refs, metadata, duplicate candidate. | Job owned by SVC-02; asset/duplicate owned by SVC-01. | Job completed/failed state valid, asset ID known. | Unknown asset, failed job, unusable derivative. |
| C-03 Asset to Content | FTV-SVC-01 -> FTV-SVC-03 | Asset ID, rights status, provenance summary, derivative reference. | Asset owned by SVC-01; content package owned by SVC-03. | Asset ready or explicitly restricted with approval path. | Rights unknown/rejected, missing provenance, processing incomplete. |
| C-04 Content to Review | FTV-SVC-03 -> FTV-SVC-05 | Content package/version reference, review reason, producer. | Content owned by SVC-03; review owned by SVC-05. | Content version exists, status review ready. | Draft not ready, missing asset rights, rule violation. |
| C-05 Review to Content | FTV-SVC-05 -> FTV-SVC-03 | Review decision, approval status, rejection reason. | Review/approval owned by SVC-05; content owned by SVC-03. | Review target matches content version. | Unknown target, stale version, missing decision reason. |
| C-06 Content to Publishing | FTV-SVC-03 -> FTV-SVC-04 | Approved content version, content package ref, asset refs. | Content owned by SVC-03; publishing package owned by SVC-04. | Approval status approved, version not stale. | Unapproved version, rights issue, missing content fields. |
| C-07 Publishing to Review | FTV-SVC-04 -> FTV-SVC-05 | Publishing package ref, checklist summary, requested approval. | Publishing package owned by SVC-04; review owned by SVC-05. | Checklist ready, content approved. | Missing metadata, blocked rights, duplicate unresolved. |
| C-08 Manual Publishing to Performance | FTV-SVC-04 -> FTV-SVC-06 | Publishing package ID, platform/post reference, publish date. | Publishing owned by SVC-04; performance import/facts owned by SVC-06. | Manual publishing recorded, platform reference present. | Missing post reference, invalid platform, duplicate import. |
| C-09 Performance to Analytics | FTV-SVC-06 -> FTV-SVC-07 | Performance facts, metric definitions, content/publishing refs. | Facts/metrics owned by SVC-06; report owned by SVC-07. | Metrics normalized and mapped. | Missing metric definition, stale data, incomplete import. |
| C-10 Workflow to Target Service | FTV-SVC-08 -> any operational service | Workflow run ID, command target, step context. | Workflow run owned by SVC-08; target record owned by target service. | Target exists, command valid, rule check passed if needed. | Target missing, invalid state, rule violation, command failure. |
| C-11 Rule Check | Any operational service -> FTV-SVC-09 | Actor, action, target record, context. | Rule evaluation owned by SVC-09; target record owner unchanged. | Actor role/relation known, context sufficient. | Unknown actor, denied relation, missing context, rule violation. |
| C-12 Audit Event | Any operational service -> FTV-SVC-09 | Actor, action, target, outcome, timestamp summary. | Audit event owned by SVC-09. | Action and target reference present. | Missing actor/target, delayed audit, duplicate event. |
| C-13 Admin Visibility | Owner service -> FTV-SVC-11 | Non-authoritative record reference and display metadata. | Business record remains with owner; admin view config owned by SVC-11. | Owner service and record type known. | Stale reference, missing owner, Directus verification issue. |

---

## 8. Failure Scenarios

| Scenario | Detection | Impact | Recovery | Manual fallback |
|---|---|---|---|---|
| Media Processing fail | MediaProcessingFailed event; job failed state. | Asset derivatives/metadata incomplete; downstream use may be blocked or degraded. | Retry job, inspect error, accept manual derivative, keep original asset. | Run FFmpeg manually and record output in asset registry. |
| Review rejected | ReviewRejected event; approval status rejected/rework. | Content or publishing package cannot advance. | Return to draft/rework, preserve rejection reason, create new version or update package. | Record rejection in review spreadsheet and notify producer manually. |
| Duplicate asset | DuplicateCandidateDetected or DuplicateMatchRecorded. | Asset may be blocked from use until resolved. | Human confirms duplicate/not duplicate; merge/reference decision recorded by SVC-01. | Manual duplicate note in asset spreadsheet. |
| Rights violation | RuleViolationDetected or RightsStatusUpdated to restricted/rejected. | Asset/content/publishing action blocked. | Correct rights status, choose alternate asset, request override with reason if allowed. | Manual sign-off log and remove/replace asset. |
| Workflow fail | WorkflowFailed event; workflow run failed state. | Automation stops; target step may remain pending. | Retry workflow or continue manually from last safe step. | Manual checklist and direct service action. |
| Import fail | PerformanceImportFailed event; failed row/error summary. | Analytics stale or incomplete. | Correct mapping/file/API input, retry import, preserve raw import. | Hand-enter metrics into spreadsheet or staging table. |
| Analytics fail | AnalyticsGenerationFailed event. | Learning report/dashboard unavailable. | Rerun report, simplify query/report, use previous report if valid. | Spreadsheet charts and manual learning notes. |
| Rule service unavailable | Rule check timeout or missing RuleEvaluationCompleted. | Governed commands cannot be safely allowed. | Default to deny/manual review; reconcile rule evaluation later. | Manual role/rule checklist and sign-off. |
| Admin visibility fail | Admin view unavailable/stale. | Cross-domain browsing degraded; owner services still operate. | Rebuild non-authoritative view from owner services. | Inspect owner-service records directly. |

---

## 9. Manual-First Operation

| Service | MVP operation mode | Automation boundary |
|---|---|---|
| FTV-SVC-01 Source & Asset Registry | Manual / semi-manual | Source capture, rights confirmation, duplicate decisions remain human-governed. |
| FTV-SVC-02 Media Processing | Semi-manual | Processing can be triggered manually; automated retry/schedule optional. |
| FTV-SVC-03 Content Production | Manual | Humans create briefs, packages, and versions. |
| FTV-SVC-04 Publishing Preparation | Manual | Humans prepare metadata and manually publish/export; no autonomous posting. |
| FTV-SVC-05 Human Review & Approval | Manual | Human approval is mandatory for gated transitions. |
| FTV-SVC-06 Performance Data | Manual / semi-manual | CSV/manual import first; API import is internal candidate only. |
| FTV-SVC-07 Analytics & Reporting | Semi-manual | Reports can be generated on demand; human reviews learning. |
| FTV-SVC-08 Workflow Orchestration | Semi-manual | Supports manual triggers and optional scheduled jobs; does not replace human gates. |
| FTV-SVC-09 Governance & Rule | Semi-manual | Rule checks can assist/block, but override/review remains human-governed. |
| FTV-SVC-10 Reference Pattern Library | Manual reference | No runtime automation. |
| FTV-SVC-11 Core Data Administration | Manual | Admin views support humans; owner services remain source of truth. |

---

## 10. Integration Dependency Sequence

This is a dependency sequence only. It is not a build roadmap, schedule, implementation plan, or deployment topology.

| Order | Service / dependency anchor | Dependency reason |
|---:|---|---|
| 1 | FTV-SVC-09 Governance & Rule Service | Role, authorization, audit, and rule checks are cross-cutting gates for governed actions. |
| 2 | FTV-SVC-01 Source & Asset Registry Service | Assets, provenance, rights, and duplicates are the base domain records. |
| 3 | FTV-SVC-02 Media Processing Service | Processing depends on registered asset/media references. |
| 4 | FTV-SVC-03 Content Production Service | Content production depends on ready assets and rights context. |
| 5 | FTV-SVC-05 Human Review & Approval Service | Review connects production and publishing gates; can start with manual fallback. |
| 6 | FTV-SVC-04 Publishing Preparation Service | Publishing packages depend on content package/version and approval state. |
| 7 | FTV-SVC-06 Performance Data Service | Performance import depends on manually published package references. |
| 8 | FTV-SVC-07 Analytics & Reporting Service | Analytics depends on normalized performance facts and metrics. |
| 9 | FTV-SVC-08 Workflow Orchestration Service | Workflow can coordinate already-defined service commands and fallback paths. |
| 10 | FTV-SVC-11 Core Data Administration Service | Admin visibility can layer over stable owner records. |
| 11 | FTV-SVC-10 Reference Pattern Library | Non-runtime reference remains available throughout. |

---

## 11. Service Interaction Matrix

| From / To | SVC-01 | SVC-02 | SVC-03 | SVC-04 | SVC-05 | SVC-06 | SVC-07 | SVC-08 | SVC-09 | SVC-10 | SVC-11 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| SVC-01 | - | Asset media input | Asset refs | Asset/rights refs | Rights/duplicate context |  |  | Processing trigger | Rule/audit context |  | Admin refs |
| SVC-02 | Processing result | - | Derivative refs |  | Duplicate context |  |  | Job status | Audit context |  | Admin refs |
| SVC-03 | Asset refs consumed |  | - | Approved content input | Review target | Content refs | Learning consumer | Review trigger | Rule/audit context | Reference UX | Admin refs |
| SVC-04 | Rights refs |  | Content refs | - | Review target | Publishing refs | Publishing context | Optional trigger | Rule/audit context | Reference design | Admin refs |
| SVC-05 | Rights/duplicate feedback |  | Approval feedback | Approval feedback | - |  |  | Review workflow | Rule/audit context | Reference UX | Admin refs |
| SVC-06 |  |  | Content refs | Publishing refs |  | - | Facts/metrics | Import status | Audit context |  | Admin refs |
| SVC-07 |  |  | Learning summary | Publishing context |  | Fact inputs | - |  | Optional audit | Reference analytics | Admin refs |
| SVC-08 |  | Commands |  |  | Commands | Commands |  | - | Rule/audit context | Reference workflow | Admin refs |
| SVC-09 | Rule results | Rule results | Rule results | Rule results | Rule results | Rule results |  | Rule results | - | Reference governance | Audit/admin refs |
| SVC-10 | Reference only | Reference only | Reference only | Reference only | Reference only | Reference only | Reference only | Reference only | Reference only | - | Reference only |
| SVC-11 | Non-authoritative view | Non-authoritative view | Non-authoritative view | Non-authoritative view | Non-authoritative view | Non-authoritative view | Non-authoritative view | Non-authoritative view | Non-authoritative view |  | - |

---

## 12. Data Flow Summary

| Flow | Authoritative records involved | Owner(s) | Notes |
|---|---|---|---|
| Source to Asset | Source reference, Asset, Provenance, Rights status | FTV-SVC-01 | Manual-first intake. |
| Asset to Processing | Asset, Media processing job | FTV-SVC-01; FTV-SVC-02 | Asset owner remains SVC-01; job owner is SVC-02. |
| Asset to Content | Asset, Content brief/package/version | FTV-SVC-01; FTV-SVC-03 | Content references assets; does not own them. |
| Content to Publishing | Content package/version, Publishing package | FTV-SVC-03; FTV-SVC-04 | Publishing package references approved content. |
| Publishing to Review | Publishing package, Review assignment/decision, Approval status | FTV-SVC-04; FTV-SVC-05 | Human review is authoritative for approval. |
| Publishing to Performance | Publishing package, Performance import/fact | FTV-SVC-04; FTV-SVC-06 | Import starts after manual publishing reference exists. |
| Performance to Analytics | Performance fact, Metric definition, Analytics report | FTV-SVC-06; FTV-SVC-07 | Reports reference facts; facts remain owned by SVC-06. |
| Governance across all | User role, Authorization relation, Rule evaluation, Audit event | FTV-SVC-09 | Rule/audit records are cross-cutting but not owners of target records. |
| Admin visibility | Admin view configuration, source record references | FTV-SVC-11 plus owner services | SVC-11 owns view metadata only. |

---

## 13. Event Summary

| Event group | Key events | Purpose |
|---|---|---|
| Asset events | SourceReferenceCaptured; AssetRegistered; RightsStatusUpdated; DuplicateMatchRecorded; AssetReadyForProduction | Move assets from intake to usable state. |
| Processing events | MediaProcessingStarted; MediaProcessingCompleted; MediaProcessingFailed; DuplicateCandidateDetected | Track derivative/enrichment processing. |
| Content events | ContentBriefCreated; ContentPackageCreated; ContentVersionCreated; ContentReadyForReview | Track production lifecycle. |
| Review events | ReviewRequested; ReviewAssigned; ReviewApproved; ReviewRejected; ApprovalStatusChanged | Preserve human approval gate. |
| Publishing events | PublishingPackageCreated; PublishingPackageReady; PublishingPackageBlocked; ManualPublishingCompleted | Prepare and record manual publishing. |
| Performance events | PerformanceImportStarted; PerformanceImported; PerformanceImportFailed; MetricsNormalized | Support import and normalization loop. |
| Analytics events | AnalyticsGenerated; AnalyticsGenerationFailed; LearningSummaryCreated | Close learning loop. |
| Workflow events | WorkflowStarted; WorkflowStepCompleted; WorkflowCompleted; WorkflowFailed | Coordinate optional automation. |
| Governance events | RuleEvaluationCompleted; RuleViolationDetected; AuthorizationRelationUpdated; AuditEventRecorded | Enforce policy and auditability. |
| Admin events | AdminViewUpdated; AdminRecordInspectionRequested | Support non-authoritative admin visibility. |

---

## 14. Command Summary

| Command group | Commands | Primary receiver |
|---|---|---|
| Asset commands | Capture Source Reference; Register Asset; Update Rights Status; Record Duplicate Decision | FTV-SVC-01 |
| Processing commands | Start Media Processing; Retry Media Processing; Generate Thumbnail; Extract Metadata | FTV-SVC-02 |
| Content commands | Create Content Brief; Create Content Package; Create Content Version; Mark Content Ready For Review | FTV-SVC-03 |
| Publishing commands | Create Publishing Package; Update Publishing Metadata; Mark Publishing Package Ready; Mark Manual Publishing Complete | FTV-SVC-04 |
| Review commands | Request Review; Assign Reviewer; Approve Package; Reject Package; Record Override | FTV-SVC-05 |
| Performance commands | Import Metrics; Import CSV; Import API Metrics; Map Metric; Normalize Metrics | FTV-SVC-06 |
| Analytics commands | Generate Report; Refresh Dashboard; Create Narrative Report; Record Learning Summary | FTV-SVC-07 |
| Workflow commands | Start Workflow; Trigger Processing; Trigger Import; Retry Workflow; Cancel Workflow | FTV-SVC-08 |
| Governance commands | Evaluate Rule; Check Authorization; Update User Role; Update Authorization Relation; Record Audit Event | FTV-SVC-09 |
| Admin commands | Configure Admin View; Inspect Record; Update Display Metadata | FTV-SVC-11 |

---

## 15. State Machine Summary

| Object | Owner | Terminal or pause states | Manual recovery point |
|---|---|---|---|
| Asset | FTV-SVC-01 | Ready; Restricted; Rejected; Archived | Rights update, duplicate decision, manual asset correction. |
| Content Package | FTV-SVC-03 | Approved; Rework; Archived | Create new version after feedback. |
| Publishing Package | FTV-SVC-04 | Manually Published; Blocked; Archived | Complete checklist or record manual publishing. |
| Review | FTV-SVC-05 | Approved; Rejected; Override Approved; Cancelled | Reopen review after rework or manual override. |
| Workflow Run | FTV-SVC-08 | Completed; Failed; Cancelled | Retry or continue manually. |
| Performance Import | FTV-SVC-06 | Imported; Failed; Cancelled | Correct mapping/file and retry. |
| Media Processing Job | FTV-SVC-02 | Completed; Failed; Cancelled | Retry or manually process media. |

---

## 16. Cross-Service Contract Summary

| Contract group | Contracts |
|---|---|
| Asset/Media | C-01 Asset to Processing; C-02 Processing Result to Asset |
| Asset/Content | C-03 Asset to Content |
| Content/Review/Publishing | C-04 Content to Review; C-05 Review to Content; C-06 Content to Publishing; C-07 Publishing to Review |
| Publishing/Performance/Analytics | C-08 Manual Publishing to Performance; C-09 Performance to Analytics |
| Workflow/Governance/Admin | C-10 Workflow to Target Service; C-11 Rule Check; C-12 Audit Event; C-13 Admin Visibility |

---

## 17. Failure Recovery Summary

| Failure area | Default stance | Recovery pattern |
|---|---|---|
| Media processing | Preserve original asset; block only derivative-dependent operations. | Retry/manual derivative. |
| Review rejection | Do not advance target. | Rework/new version/new review. |
| Duplicate asset | Do not auto-merge. | Human duplicate decision. |
| Rights violation | Block unsafe action. | Correct rights/replace asset/manual override if allowed. |
| Workflow failure | Automation failure does not stop manual operation. | Retry or manual checklist. |
| Import failure | Preserve raw import; do not pollute facts. | Correct mapping/file and retry/manual entry. |
| Analytics failure | Keep facts; analysis can be manual. | Regenerate or manual report. |
| Governance failure | Default conservative. | Deny/manual review/reconcile audit. |

---

## 18. Manual Operation Summary

| Operation type | Services | MVP posture |
|---|---|---|
| Manual | FTV-SVC-03; FTV-SVC-04; FTV-SVC-05; FTV-SVC-10; FTV-SVC-11 | Humans create content, prepare publishing, approve/reject, consult references, inspect admin views. |
| Semi-manual | FTV-SVC-01; FTV-SVC-02; FTV-SVC-06; FTV-SVC-07; FTV-SVC-08; FTV-SVC-09 | Services assist with processing/import/report/rule/workflow, but manual fallback is explicit. |
| Automated | None as mandatory MVP posture | No service is required to operate fully autonomously in MVP. |

---

## 19. Integration Dependency Summary

| Dependency | Reason |
|---|---|
| Governance before governed transitions | Authorization, rules, and audit protect unsafe operations. |
| Asset registry before media/content | Asset IDs, provenance, and rights are prerequisites. |
| Media processing after asset registration | Jobs require registered asset/media reference. |
| Content production after ready assets | Content packages must reference usable assets. |
| Review before publishing readiness | Human approval gates publishing. |
| Publishing completion before performance import | Metrics need platform/post references. |
| Performance facts before analytics | Reports need normalized facts and metric definitions. |
| Workflow after core commands are known | Workflow coordinates service commands; it does not define the domain. |
| Admin visibility after owner records | Admin views depend on authoritative owner services. |

---

## 20. Outstanding Risks

| Risk | Affected area | Impact |
|---|---|---|
| ResourceSpace license/module verification unresolved | FTV-SVC-01; FTV-SVC-02; FTV-SVC-09 | May force DAM/rights/plugin usage to remain pattern-only. |
| Directus license/commercial boundary unresolved | FTV-SVC-05; FTV-SVC-06; FTV-SVC-09; FTV-SVC-11 | May require owner-specific admin/review/performance staging fallback. |
| Metabase AGPL/commercial boundary unresolved | FTV-SVC-07 | May limit dashboard adoption path. |
| Media processing candidates are reference-only | FTV-SVC-02 | FFmpeg wrapper may require custom internal module. |
| Performance import not fully covered by candidates | FTV-SVC-06 | CSV/API import and metric mapping likely need internal module work. |
| OpenFGA may be too much for earliest MVP | FTV-SVC-09 | Lightweight role/status checks may be needed first. |
| Manual publishing remains external to system | FTV-SVC-04; FTV-SVC-06 | Human must reliably record post/platform references for analytics loop. |

---

## 21. Open Questions

| Question | Related service(s) |
|---|---|
| Can ResourceSpace components be used directly, or only as adapted patterns? | FTV-SVC-01; FTV-SVC-02 |
| Is Directus acceptable under its license/commercial boundary for admin/activity/review/staging use? | FTV-SVC-05; FTV-SVC-06; FTV-SVC-09; FTV-SVC-11 |
| Is Metabase acceptable as a separate dashboard tool/pattern under AGPL/commercial constraints? | FTV-SVC-07 |
| Is OCR/STT required in MVP or deferred? | FTV-SVC-02 |
| Which publishing destination metadata fields are allowed while preserving manual publishing? | FTV-SVC-04 |
| Which platforms and metrics are mandatory for MVP performance import? | FTV-SVC-06 |
| Can MVP start with simple role/status checks before introducing OpenFGA? | FTV-SVC-09 |
| Should workflow scheduling be enabled in MVP, or only manual triggers? | FTV-SVC-08 |
| If Directus is not usable, should CAP-10 rely on owner-specific views instead of a shared admin service? | FTV-SVC-11 |

---

## 22. Self Review

| Check | Result |
|---|---|
| Used only `CANDIDATE_REPOSITORY_INDEX.md`, `FTV_COMPONENT_CATALOG.md`, and `FTV_SERVICE_CATALOG.md` | Pass |
| No new service created beyond frozen STEP-02 service catalog | Pass |
| Service boundary unchanged | Pass |
| Ownership unchanged | Pass |
| Component decisions unchanged | Pass |
| Capability mapping unchanged | Pass |
| Every service connected | Pass |
| Every capability has flow coverage | Pass |
| Required domain records have lifecycle coverage | Pass |
| Every interaction has owner context | Pass |
| BUILD gaps assigned as internal modules, not automatic standalone services | Pass |
| No Architecture Blueprint created | Pass |
| No C4/deployment/database/API/event schema created | Pass |
| No build roadmap or implementation plan created | Pass |
| No code written | Pass |

---

## 23. Stop Point

This file is ready for review as the STEP-03 System Assembly artifact.

No Architecture Blueprint, C4 Diagram, Deployment Diagram, Database Schema, API Specification, Event Schema, Build Roadmap, Implementation Plan, code, or deployment decision has been created.

