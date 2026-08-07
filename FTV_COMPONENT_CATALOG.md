# FTV_COMPONENT_CATALOG.md

**Project:** Football Troll Vault v2  
**Target:** FTV_MVP  
**Phase:** Repository Discovery - STEP-01 Candidate Component Selection  
**Framework:** Repository Acquisition Framework (RAF v1.1)  
**Source index:** `CANDIDATE_REPOSITORY_INDEX.md`  
**Review date:** 2026-07-30  
**Status:** Draft for confirmation  

---

## 1. Purpose

This catalog converts the current Candidate Repository Pool and Candidate Component Pool into a component-level selection catalog for later System Assembly and Architecture Blueprint work.

This document does **not** create an Architecture Blueprint, does **not** design System Assembly, does **not** decide Build / Reuse / Adapt at architecture level, and does **not** create an Implementation Plan.

All repository/component references are limited to the repositories and candidate components already listed in `CANDIDATE_REPOSITORY_INDEX.md`.

---

## 2. Decision Vocabulary

| Decision | Meaning in this catalog |
|---|---|
| REUSE | Component appears suitable for direct use with minimal change in the MVP boundary. |
| ADAPT | Component/pattern is useful, but must be narrowed, wrapped, configured, or selectively adapted for FTV MVP. |
| REFERENCE ONLY | Component is useful as architecture, UX, schema, workflow, or processing reference, but should not be directly adopted for MVP without further design/legal verification. |
| REJECT | Component is not suitable for FTV MVP selection because of scope, license, verification, complexity, or poor capability fit. |

**Selection principle:** decisions are made per component, not per repository. A repository can provide multiple components with different decisions.

---

## 3. Capability Component Catalog

### CAP-01 - Asset Acquisition

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-001 |
| FTV component needed | Approved asset intake queue |
| Selected repository/component | ResourceSpace - COMP-005 DAM resources, collections, metadata, annotations |
| Decision | ADAPT |
| Scope used | Manual or semi-manual intake records, collection grouping, source metadata, intake review states. |
| Source subsystem | SUBSYSTEM-01 - Asset Intake & Media Management |
| Related capability | CAP-01 Asset Acquisition |
| Reason for selection | ResourceSpace is closer to a rights-aware media intake workflow than personal photo libraries. It can represent assets as managed resources instead of only gallery items. |
| Alternative | Immich COMP-001; PhotoPrism COMP-004; LibrePhotos COMP-008 |
| Why alternative not selected | Immich and PhotoPrism are optimized for personal/photo-library ingestion; LibrePhotos is useful for duplicate detection, not intake workflow. |
| License or verification constraint | ResourceSpace license and plugin boundaries require verification before direct code reuse. |
| MVP suitability | Medium-High if adapted as a pattern or narrow DAM component; too broad if adopted wholesale. |
| Integration risk | Medium |
| Open question | Which ResourceSpace modules are usable under the verified license boundary for FTV MVP? |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-002 |
| FTV component needed | Source provenance capture |
| Selected repository/component | ResourceSpace - COMP-006 License Manager / Consent Manager |
| Decision | ADAPT |
| Scope used | Source URL, origin account, license/rights status, consent/usage notes, reviewer confirmation. |
| Source subsystem | SUBSYSTEM-01 - Asset Intake & Media Management |
| Related capability | CAP-01 Asset Acquisition; CAP-02 Asset Management |
| Reason for selection | FTV needs traceability from approved key/package to source asset. ResourceSpace has the closest candidate pattern for rights/provenance metadata. |
| Alternative | Directus COMP-013; Nextcloud COMP-009 |
| Why alternative not selected | Directus can model generic records but does not provide media-rights semantics; Nextcloud is generic file management. |
| License or verification constraint | ResourceSpace licensing and exact module availability must be verified. |
| MVP suitability | Medium-High as a narrowed metadata pattern. |
| Integration risk | Medium |
| Open question | What minimum provenance fields are mandatory for FTV acceptance gates? |

### CAP-02 - Asset Management

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-003 |
| FTV component needed | Asset library and metadata model |
| Selected repository/component | ResourceSpace - COMP-005 DAM resources, collections, metadata, annotations |
| Decision | ADAPT |
| Scope used | Asset records, collections, tags, metadata fields, annotations, lifecycle states. |
| Source subsystem | SUBSYSTEM-01 - Asset Intake & Media Management |
| Related capability | CAP-02 Asset Management |
| Reason for selection | Best match for a media asset vault with explicit metadata and collection organization. |
| Alternative | Immich COMP-001; Nextcloud COMP-009 |
| Why alternative not selected | Immich is photo-gallery shaped; Nextcloud is file-centric and weaker for media-specific rights/provenance. |
| License or verification constraint | ResourceSpace license verification required before direct reuse. |
| MVP suitability | High as a model/pattern; Medium as a full dependency. |
| Integration risk | Medium |
| Open question | Should FTV MVP use ResourceSpace directly or only adapt the resource/metadata model? |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-004 |
| FTV component needed | Rights and usage-status tracking |
| Selected repository/component | ResourceSpace - COMP-006 License Manager / Consent Manager |
| Decision | ADAPT |
| Scope used | Rights status, license notes, consent evidence, expiration/restriction flags, reviewer fields. |
| Source subsystem | SUBSYSTEM-01 - Asset Intake & Media Management |
| Related capability | CAP-02 Asset Management; CAP-11 Governance Support |
| Reason for selection | Rights metadata is mandatory for safe asset reuse and is closer to DAM behavior than generic CMS permissions. |
| Alternative | Directus COMP-014; OpenFGA COMP-028 |
| Why alternative not selected | Directus and OpenFGA support access/governance, but not media-rights workflow by themselves. |
| License or verification constraint | ResourceSpace module license and compatibility require verification. |
| MVP suitability | High as a minimal rights status model. |
| Integration risk | Medium |
| Open question | Which rights states are enough for MVP: approved, restricted, expired, unknown, rejected? |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-005 |
| FTV component needed | Duplicate and similarity detection |
| Selected repository/component | LibrePhotos - COMP-008 exact duplicate and perceptual hash detection |
| Decision | ADAPT |
| Scope used | Exact duplicate detection and perceptual-hash similarity checks for imported media. |
| Source subsystem | SUBSYSTEM-01 - Asset Intake & Media Management |
| Related capability | CAP-02 Asset Management; CAP-03 Media Processing |
| Reason for selection | Narrow, useful capability with permissive MIT license and clear MVP value. |
| Alternative | Immich COMP-001 duplicate review; PhotoPrism COMP-004 indexing |
| Why alternative not selected | Immich/PhotoPrism duplicate behavior is embedded in larger AGPL photo systems. |
| License or verification constraint | MIT license is favorable; implementation details still need dependency verification. |
| MVP suitability | High |
| Integration risk | Low-Medium |
| Open question | What similarity threshold should trigger human review instead of auto-merge? |

### CAP-03 - Media Processing

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-006 |
| FTV component needed | FFmpeg media normalization pattern |
| Selected repository/component | PhotoPrism - COMP-003 internal/ffmpeg media processing |
| Decision | REFERENCE ONLY |
| Scope used | Command patterns, processing stages, thumbnail/video derivative concepts. |
| Source subsystem | SUBSYSTEM-01 - Asset Intake & Media Management |
| Related capability | CAP-03 Media Processing |
| Reason for selection | PhotoPrism is a strong reference for media pipeline behavior, but direct adoption is too broad for MVP. |
| Alternative | Immich media pipeline; ResourceSpace COMP-007 plugins |
| Why alternative not selected | Immich is also a large AGPL application; ResourceSpace plugins are more OCR/STT oriented. |
| License or verification constraint | PhotoPrism is AGPL; direct code reuse would require careful license handling. |
| MVP suitability | Medium as reference; Low as direct dependency. |
| Integration risk | Medium-High if copied or embedded directly. |
| Open question | FTV likely needs a small local FFmpeg wrapper; this remains a potential BUILD gap. |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-007 |
| FTV component needed | Metadata extraction and thumbnail indexing pattern |
| Selected repository/component | PhotoPrism - COMP-004 indexing/import, metadata extraction, thumbnails |
| Decision | REFERENCE ONLY |
| Scope used | Import scan stages, EXIF/media metadata extraction pattern, thumbnail generation pattern. |
| Source subsystem | SUBSYSTEM-01 - Asset Intake & Media Management |
| Related capability | CAP-03 Media Processing; CAP-02 Asset Management |
| Reason for selection | Good reference for how a media library derives searchable metadata, but too large and license-constrained for direct MVP use. |
| Alternative | Immich COMP-002; ResourceSpace COMP-005 |
| Why alternative not selected | Immich search/indexing is also broad; ResourceSpace is stronger on metadata management than automated processing. |
| License or verification constraint | AGPL direct reuse constraint. |
| MVP suitability | Medium as reference only. |
| Integration risk | Medium |
| Open question | Which metadata fields are mandatory for FTV MVP search and review? |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-008 |
| FTV component needed | OCR/STT enrichment reference |
| Selected repository/component | ResourceSpace - COMP-007 Whisper/Tesseract OCR plugins |
| Decision | REFERENCE ONLY |
| Scope used | OCR/transcription enrichment concept for searchable media evidence. |
| Source subsystem | SUBSYSTEM-01 - Asset Intake & Media Management |
| Related capability | CAP-03 Media Processing |
| Reason for selection | Useful for future media enrichment, but optional for manual-first MVP. |
| Alternative | PhotoPrism metadata processing; Immich ML search |
| Why alternative not selected | Alternatives are embedded in larger media platforms and are not focused on reviewable OCR/STT enrichment. |
| License or verification constraint | ResourceSpace plugin license and model/runtime dependencies require verification. |
| MVP suitability | Low-Medium for MVP; stronger as later enhancement. |
| Integration risk | Medium |
| Open question | Is OCR/STT required in MVP acceptance, or can it be deferred? |

### CAP-04 - Content Production

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-009 |
| FTV component needed | Content brief and edit-plan records |
| Selected repository/component | Payload - COMP-016 versions, drafts, autosave, scheduled publish, access control |
| Decision | ADAPT |
| Scope used | Structured content item, edit brief, caption draft, production status, draft history. |
| Source subsystem | SUBSYSTEM-02 - Content Production & Publishing Preparation |
| Related capability | CAP-04 Content Production |
| Reason for selection | Payload provides a focused, code-first content model with MIT license and useful draft/version behavior. |
| Alternative | Directus COMP-013; Strapi COMP-015; AppFlowy COMP-011 |
| Why alternative not selected | Directus is stronger for data admin; Strapi has verification/premium-boundary questions; AppFlowy is workspace-first rather than structured publishing data. |
| License or verification constraint | MIT license favorable; plugin/dependency verification still required. |
| MVP suitability | High if narrowed to content records and versions. |
| Integration risk | Medium |
| Open question | Should FTV content records live in Payload or the same core-data admin selected for CAP-10? |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-010 |
| FTV component needed | Collaborative planning workspace pattern |
| Selected repository/component | AppFlowy - COMP-011 documents/rich editor/workspace pages and COMP-012 databases/grid/board/calendar/gallery/person assignment |
| Decision | REFERENCE ONLY |
| Scope used | Planning UX, board/list views, assignment concepts, page/database interaction model. |
| Source subsystem | SUBSYSTEM-02 and SUBSYSTEM-05 |
| Related capability | CAP-04 Content Production; CAP-12 Human Review Support |
| Reason for selection | Good reference for manual-first production planning, but full workspace adoption is too broad for MVP. |
| Alternative | Directus COMP-013; Payload COMP-016 |
| Why alternative not selected | Directus/Payload are better as structured systems of record; AppFlowy is better as UX reference. |
| License or verification constraint | AppFlowy is AGPL; direct embedding requires license review. |
| MVP suitability | Medium as UX reference; Low as direct platform dependency. |
| Integration risk | Medium-High if adopted as a full app. |
| Open question | Which planning views are essential for MVP: table, kanban, or document brief? |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-011 |
| FTV component needed | Draft/version workflow for production artifacts |
| Selected repository/component | Payload - COMP-016 versions, drafts, autosave, scheduled publish, access control |
| Decision | ADAPT |
| Scope used | Draft status, version history, autosave behavior, review-ready transition. |
| Source subsystem | SUBSYSTEM-02 - Content Production & Publishing Preparation |
| Related capability | CAP-04 Content Production; CAP-05 Publishing Preparation |
| Reason for selection | Draft/version behavior is central to production review without introducing a full workflow suite. |
| Alternative | Strapi COMP-015; Directus COMP-014 |
| Why alternative not selected | Strapi review/release capabilities need deeper edition verification; Directus activity/version features are broader data-admin tools. |
| License or verification constraint | MIT license favorable. |
| MVP suitability | High |
| Integration risk | Medium |
| Open question | How many retained versions are required for MVP auditability? |

### CAP-05 - Publishing Preparation

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-012 |
| FTV component needed | Publishing package metadata checklist |
| Selected repository/component | Ghost - COMP-018 post settings, tags, authors, excerpts, metadata, scheduling |
| Decision | ADAPT |
| Scope used | Title/caption fields, tags, excerpt/description, author/reviewer attribution, publish-ready checklist. |
| Source subsystem | SUBSYSTEM-02 - Content Production & Publishing Preparation |
| Related capability | CAP-05 Publishing Preparation |
| Reason for selection | Ghost offers a clean editorial metadata pattern with permissive MIT license, even though FTV is not a blog. |
| Alternative | Payload COMP-016; Strapi COMP-015 |
| Why alternative not selected | Payload remains selected for structured drafts; Ghost is specifically useful as publishing metadata UX reference/adaptation. Strapi has verification uncertainty. |
| License or verification constraint | MIT license favorable. |
| MVP suitability | High as metadata/checklist pattern. |
| Integration risk | Low-Medium |
| Open question | Which destination-specific metadata fields are allowed without creating autonomous posting? |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-013 |
| FTV component needed | Publish-readiness state and scheduling reference |
| Selected repository/component | Payload - COMP-016 versions, drafts, autosave, scheduled publish, access control |
| Decision | ADAPT |
| Scope used | Ready-for-publish state, scheduled/intended publish time, approval transition. |
| Source subsystem | SUBSYSTEM-02 - Content Production & Publishing Preparation |
| Related capability | CAP-05 Publishing Preparation; CAP-12 Human Review Support |
| Reason for selection | Provides controllable draft-to-ready states without adopting an external publishing platform. |
| Alternative | Ghost COMP-018; Strapi COMP-015 |
| Why alternative not selected | Ghost is publishing-product shaped; Strapi's advanced review/release features need edition verification. |
| License or verification constraint | MIT license favorable. |
| MVP suitability | High |
| Integration risk | Medium |
| Open question | Does MVP require scheduled posting data only, or export bundles for manual posting? |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-014 |
| FTV component needed | Visual template and thumbnail design reference |
| Selected repository/component | Penpot - COMP-017 design tokens, components, variants, inspect mode |
| Decision | REFERENCE ONLY |
| Scope used | Design system/reference patterns for thumbnail/template variants and inspectable visual specs. |
| Source subsystem | SUBSYSTEM-02 - Content Production & Publishing Preparation |
| Related capability | CAP-04 Content Production; CAP-05 Publishing Preparation |
| Reason for selection | Helpful for design artifact management, but FTV MVP does not need a full design platform dependency. |
| Alternative | Payload/Ghost metadata fields |
| Why alternative not selected | Metadata systems do not cover visual variant/design-token concepts. |
| License or verification constraint | Penpot license/deployment implications require verification before direct adoption. |
| MVP suitability | Medium as reference only. |
| Integration risk | Medium |
| Open question | Are thumbnail/template variants part of MVP or post-MVP production maturity? |

### CAP-06 - Performance Data Collection

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-015 |
| FTV component needed | Performance data staging model |
| Selected repository/component | Directus - COMP-013 visual data modeling and SQL-backed admin UI |
| Decision | ADAPT |
| Scope used | Tables/collections for imported metrics, platform, post ID, date, metric values, import status. |
| Source subsystem | SUBSYSTEM-02 and SUBSYSTEM-05 |
| Related capability | CAP-06 Performance Data Collection; CAP-10 Data Management |
| Reason for selection | Directus is suitable as an admin-facing structured data model for manually imported performance metrics. |
| Alternative | PostHog COMP-023; Metabase COMP-019; Evidence COMP-024 |
| Why alternative not selected | PostHog is first-party event analytics; Metabase/Evidence analyze/report data but do not solve import staging. |
| License or verification constraint | Directus source-available/commercial boundary must be verified for intended use. |
| MVP suitability | Medium-High if used only for simple staging/admin records. |
| Integration risk | Medium |
| Open question | If Directus license is unsuitable, this capability needs a small custom staging model. |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-016 |
| FTV component needed | Event ingestion reference |
| Selected repository/component | PostHog - COMP-023 event ingestion, product analytics, funnels, experiments, warehouse |
| Decision | REFERENCE ONLY |
| Scope used | Event schema concepts, metric naming, ingestion pipeline reference. |
| Source subsystem | SUBSYSTEM-03 - Performance Data & Analytics |
| Related capability | CAP-06 Performance Data Collection; CAP-07 Performance Analysis |
| Reason for selection | Useful analytics reference, but FTV MVP needs imported platform performance rather than product telemetry. |
| Alternative | Directus COMP-013 staging model |
| Why alternative not selected | Directus is better for manual import staging in MVP. |
| License or verification constraint | PostHog has OSS and enterprise boundaries; must verify selected parts. |
| MVP suitability | Low-Medium as reference. |
| Integration risk | Medium |
| Open question | Are any first-party events in MVP, or only external publishing performance metrics? |

### CAP-07 - Performance Analysis

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-017 |
| FTV component needed | Metrics explorer and dashboard |
| Selected repository/component | Metabase - COMP-019 models, metrics, query builder, dashboards |
| Decision | ADAPT |
| Scope used | Simple dashboards, metric questions, saved models, comparison views for content performance. |
| Source subsystem | SUBSYSTEM-03 - Performance Data & Analytics |
| Related capability | CAP-07 Performance Analysis |
| Reason for selection | Metabase best matches MVP-friendly analysis by non-engineers with lower setup burden than Superset/Lightdash. |
| Alternative | Apache Superset COMP-020; Grafana COMP-021; Lightdash COMP-022 |
| Why alternative not selected | Superset is heavier BI; Grafana is ops/time-series oriented; Lightdash assumes stronger dbt/semantic-layer discipline. |
| License or verification constraint | Metabase OSS AGPL/commercial boundary must be verified for deployment/reuse. |
| MVP suitability | High as external analysis tool or pattern; Medium if embedded deeply. |
| Integration risk | Medium |
| Open question | Is AGPL acceptable if Metabase is run as a separate service rather than copied/adapted? |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-018 |
| FTV component needed | Narrative performance report |
| Selected repository/component | Evidence - COMP-024 SQL + Markdown reports/static publishing |
| Decision | ADAPT |
| Scope used | SQL-backed static reports for repeat/avoid learnings, weekly summaries, candidate lessons. |
| Source subsystem | SUBSYSTEM-03 - Performance Data & Analytics |
| Related capability | CAP-07 Performance Analysis |
| Reason for selection | Evidence is lightweight and fits repeatable narrative analysis without large BI platform overhead. |
| Alternative | Metabase COMP-019; Grafana COMP-021 |
| Why alternative not selected | Metabase is better for exploratory dashboards; Grafana is less suited to editorial narrative reports. |
| License or verification constraint | MIT license favorable. |
| MVP suitability | High |
| Integration risk | Low-Medium |
| Open question | What report cadence is needed for MVP: per package, weekly, or campaign-based? |

### CAP-08 - Workflow Management

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-019 |
| FTV component needed | Approval and task automation flow |
| Selected repository/component | Activepieces - COMP-026 flow builder, triggers/actions, run details, alerts, encrypted secrets |
| Decision | ADAPT |
| Scope used | Human-triggered flows, approval notifications, run history, simple integration actions. |
| Source subsystem | SUBSYSTEM-04 - Workflow & Rule Control |
| Related capability | CAP-08 Workflow Management |
| Reason for selection | Activepieces CE has a smaller MVP footprint and more favorable candidate license posture than n8n for automation flows. |
| Alternative | n8n COMP-025; Kestra COMP-027 |
| Why alternative not selected | n8n has source-available/commercial verification concerns; Kestra is better for scheduled technical jobs than human approval flows. |
| License or verification constraint | Activepieces CE MIT boundary must be verified against any cloud/enterprise features. |
| MVP suitability | High for narrow workflow automation. |
| Integration risk | Medium |
| Open question | Which approvals must trigger external notifications in MVP? |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-020 |
| FTV component needed | Scheduled processing/import jobs |
| Selected repository/component | Kestra - COMP-027 YAML workflows, triggers, scheduler, UI editor, plugins |
| Decision | ADAPT |
| Scope used | Scheduled imports, processing jobs, retryable background tasks, run visibility. |
| Source subsystem | SUBSYSTEM-04 - Workflow & Rule Control |
| Related capability | CAP-08 Workflow Management; CAP-06 Performance Data Collection; CAP-03 Media Processing |
| Reason for selection | Kestra is a strong narrow candidate for scheduled technical workflows without adopting durable-code orchestration. |
| Alternative | Temporal COMP-029; Camunda COMP-030; Activepieces COMP-026 |
| Why alternative not selected | Temporal and Camunda are too heavy for MVP; Activepieces is better for user-facing automation than scheduled pipeline orchestration. |
| License or verification constraint | Apache-2.0 favorable; plugin/runtime dependencies need verification. |
| MVP suitability | Medium-High if only a small scheduler is needed. |
| Integration risk | Medium |
| Open question | Can MVP avoid a separate scheduler and use manual triggers first? |

### CAP-09 - Rule Enforcement

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-021 |
| FTV component needed | Object-level approval/permission checks |
| Selected repository/component | OpenFGA - COMP-028 relationship tuples, authorization models, conditional checks |
| Decision | ADAPT |
| Scope used | Relationship-based checks for reviewer, owner, approver, asset/content access, publish gate. |
| Source subsystem | SUBSYSTEM-04 and SUBSYSTEM-05 |
| Related capability | CAP-09 Rule Enforcement; CAP-11 Governance Support |
| Reason for selection | OpenFGA is focused, Apache-licensed, and reusable across workflow and governance without adopting a full BPM suite. |
| Alternative | Directus COMP-014 granular permissions; Camunda COMP-030 DMN |
| Why alternative not selected | Directus permissions are useful but tied to Directus data/admin model; Camunda DMN/BPMN is oversized for MVP. |
| License or verification constraint | Apache-2.0 favorable. Authorization model must be verified against FTV approval rules. |
| MVP suitability | Medium-High if object-level policy is required; potentially too much if simple role checks are enough. |
| Integration risk | Medium |
| Open question | Can MVP start with simpler role/status checks before introducing OpenFGA? |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-022 |
| FTV component needed | Business rule modeling reference |
| Selected repository/component | Camunda - COMP-030 BPMN, DMN, FEEL, user tasks, business rule tasks |
| Decision | REFERENCE ONLY |
| Scope used | DMN/rule-table concepts for approval gates and reject reasons. |
| Source subsystem | SUBSYSTEM-04 - Workflow & Rule Control |
| Related capability | CAP-09 Rule Enforcement; CAP-08 Workflow Management |
| Reason for selection | Helpful rule-model reference, but the full Camunda stack is far beyond MVP needs. |
| Alternative | OpenFGA COMP-028; Directus/Payload status fields |
| Why alternative not selected | OpenFGA is selected for object authorization; simple status fields may be enough for MVP rule enforcement. |
| License or verification constraint | Camunda licensing/deployment boundaries require verification; direct adoption not recommended for MVP. |
| MVP suitability | Low as dependency; Medium as reference. |
| Integration risk | High if adopted directly. |
| Open question | Which approval rules require explicit rule-table modeling rather than normal validation/status checks? |

### CAP-10 - Data Management

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-023 |
| FTV component needed | Core data admin and domain records |
| Selected repository/component | Directus - COMP-013 visual data modeling and SQL-backed admin UI |
| Decision | ADAPT |
| Scope used | Admin-managed records for assets, content packages, approvals, metric imports, lookup tables. |
| Source subsystem | SUBSYSTEM-02 and SUBSYSTEM-05 |
| Related capability | CAP-10 Data Management |
| Reason for selection | Directus provides a pragmatic SQL-backed admin surface for structured records without building a custom admin UI first. |
| Alternative | Payload COMP-016; AppFlowy COMP-012 |
| Why alternative not selected | Payload is selected for content workflow; AppFlowy is workspace-oriented and not ideal as system of record. |
| License or verification constraint | Directus source-available/commercial boundary is a blocking verification item before direct adoption. |
| MVP suitability | Medium-High if license is acceptable and scope is narrow. |
| Integration risk | Medium-High due license and platform coupling. |
| Open question | If Directus is not usable, should Payload or a small custom admin model cover this MVP role? |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-024 |
| FTV component needed | Activity log and record version visibility |
| Selected repository/component | Directus - COMP-014 content versions, global drafts, activity log, granular permissions |
| Decision | ADAPT |
| Scope used | Activity history, draft/status transitions, reviewer actions, audit-friendly record changes. |
| Source subsystem | SUBSYSTEM-02 and SUBSYSTEM-05 |
| Related capability | CAP-10 Data Management; CAP-11 Governance Support; CAP-12 Human Review Support |
| Reason for selection | Activity and version visibility are needed for traceability across asset, content, review, and performance records. |
| Alternative | Payload COMP-016 |
| Why alternative not selected | Payload remains useful for content drafts; Directus activity log better matches cross-domain admin data if Directus is accepted. |
| License or verification constraint | Directus license boundary remains a blocking verification item. |
| MVP suitability | Medium |
| Integration risk | Medium-High |
| Open question | Can the MVP meet audit needs with simpler append-only logs instead of Directus activity features? |

### CAP-11 - Governance Support

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-025 |
| FTV component needed | Authorization policy service |
| Selected repository/component | OpenFGA - COMP-028 relationship tuples, authorization models, conditional checks |
| Decision | ADAPT |
| Scope used | Governance checks for who may approve, publish, override, or view restricted assets. |
| Source subsystem | SUBSYSTEM-04 and SUBSYSTEM-05 |
| Related capability | CAP-11 Governance Support; CAP-09 Rule Enforcement |
| Reason for selection | Same focused authorization component can serve both workflow rule enforcement and governance. |
| Alternative | Directus COMP-014 permissions; DataHub COMP-032 policies |
| Why alternative not selected | Directus permissions are platform-tied; DataHub governance is enterprise metadata oriented. |
| License or verification constraint | Apache-2.0 favorable. |
| MVP suitability | Medium-High if object-level policy is required. |
| Integration risk | Medium |
| Open question | Is OpenFGA necessary in MVP, or can it be deferred until reviewer roles become more complex? |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-026 |
| FTV component needed | Governance metadata and lineage reference |
| Selected repository/component | DataHub - COMP-032 metadata graph, ownership, tags, domains, policies, lineage |
| Decision | REFERENCE ONLY |
| Scope used | Ownership, lineage, domain/tag vocabulary, governance concepts for later maturity. |
| Source subsystem | SUBSYSTEM-05 - Core Data, Governance & Human Review |
| Related capability | CAP-11 Governance Support |
| Reason for selection | DataHub is useful for governance concepts, but enterprise metadata-graph adoption is not MVP-sized. |
| Alternative | OpenMetadata COMP-031; Directus COMP-014 |
| Why alternative not selected | OpenMetadata is similarly enterprise-scale; Directus is selected for practical audit/activity records. |
| License or verification constraint | Apache-2.0 favorable, but operational scope is too large for MVP. |
| MVP suitability | Low as dependency; Medium as reference. |
| Integration risk | High if adopted directly. |
| Open question | Which governance vocabulary should be preserved now so future lineage/catalog work is possible? |

### CAP-12 - Human Review Support

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-027 |
| FTV component needed | Review workspace UX pattern |
| Selected repository/component | AppFlowy - COMP-011 documents/rich editor/workspace pages and COMP-012 databases/grid/board/calendar/gallery/person assignment |
| Decision | REFERENCE ONLY |
| Scope used | Reviewer workspace, assignment views, board/grid UX, collaborative notes. |
| Source subsystem | SUBSYSTEM-02 and SUBSYSTEM-05 |
| Related capability | CAP-12 Human Review Support; CAP-04 Content Production |
| Reason for selection | AppFlowy is useful for human-centered review UX, but full workspace reuse is oversized and AGPL-constrained. |
| Alternative | Directus COMP-014; Payload COMP-016 |
| Why alternative not selected | Directus/Payload are better for structured review records; AppFlowy is better as UX reference. |
| License or verification constraint | AGPL direct adoption requires license review. |
| MVP suitability | Medium as reference; Low as direct platform. |
| Integration risk | Medium-High if adopted directly. |
| Open question | Should reviewer experience be board-first, table-first, or record-detail-first in MVP? |

| Field | Selection |
|---|---|
| FTV component ID | FTV-COMP-028 |
| FTV component needed | Review status and approval records |
| Selected repository/component | Directus - COMP-014 content versions, global drafts, activity log, granular permissions |
| Decision | ADAPT |
| Scope used | Review status, reviewer assignment, comment/action history, approval/rejection transitions. |
| Source subsystem | SUBSYSTEM-02 and SUBSYSTEM-05 |
| Related capability | CAP-12 Human Review Support; CAP-10 Data Management |
| Reason for selection | Directus activity/status features match structured human review records if its license boundary is acceptable. |
| Alternative | Payload COMP-016; AppFlowy COMP-012; Camunda COMP-030 |
| Why alternative not selected | Payload is selected for content drafts; AppFlowy is not a system of record; Camunda user-task workflow is too heavy. |
| License or verification constraint | Directus source-available/commercial boundary must be verified. |
| MVP suitability | Medium-High if scoped narrowly. |
| Integration risk | Medium-High |
| Open question | Can review history be represented as append-only records independent of Directus? |

---

## 4. Candidate Component Classification

This table classifies the full Candidate Component Pool from `CANDIDATE_REPOSITORY_INDEX.md`. It avoids applying a single decision to an entire repository when a repository has multiple components.

| Candidate component | Repository | Component summary | Selection decision | Used by FTV component(s) | Notes |
|---|---|---|---|---|---|
| COMP-001 | Immich | Upload, metadata view, tags, folder view, duplicate review | REFERENCE ONLY | None | Useful photo-library UX reference; too product-shaped for MVP DAM. |
| COMP-002 | Immich | Search by metadata/objects/faces/CLIP | REFERENCE ONLY | None | Useful search reference; ML/photo platform scope is too broad. |
| COMP-003 | PhotoPrism | FFmpeg/internal media processing | REFERENCE ONLY | FTV-COMP-006 | AGPL and broad media app scope limit direct reuse. |
| COMP-004 | PhotoPrism | Indexing/import, metadata extraction, thumbnails | REFERENCE ONLY | FTV-COMP-007 | Good processing reference; direct dependency too large. |
| COMP-005 | ResourceSpace | DAM resources, collections, metadata, annotations | ADAPT | FTV-COMP-001; FTV-COMP-003 | Strongest DAM pattern; license verification required. |
| COMP-006 | ResourceSpace | License Manager / Consent Manager | ADAPT | FTV-COMP-002; FTV-COMP-004 | Strong rights/provenance pattern; license verification required. |
| COMP-007 | ResourceSpace | Whisper/Tesseract OCR plugins | REFERENCE ONLY | FTV-COMP-008 | Optional enrichment; not essential for manual-first MVP. |
| COMP-008 | LibrePhotos | Exact duplicate and perceptual hash detection | ADAPT | FTV-COMP-005 | Focused MIT candidate for duplicate detection. |
| COMP-009 | Nextcloud | File tags, automated tagging, access control | REJECT | None | Generic file platform; overlaps DAM needs without strong FTV-specific advantage. |
| COMP-010 | Stalwart | Content-addressed blob storage and WebDAV file storage | REJECT | None | Mail/server storage pattern is not a close MVP fit for media vault intake. |
| COMP-011 | AppFlowy | Documents/rich editor/workspace pages | REFERENCE ONLY | FTV-COMP-010; FTV-COMP-027 | Good UX reference; AGPL/full workspace adoption too broad. |
| COMP-012 | AppFlowy | Databases/grid/board/calendar/gallery/person assignment | REFERENCE ONLY | FTV-COMP-010; FTV-COMP-027 | Useful planning/review UX reference. |
| COMP-013 | Directus | Visual data modeling and SQL-backed admin UI | ADAPT | FTV-COMP-015; FTV-COMP-023 | Strong data-admin candidate; license boundary is blocking verification. |
| COMP-014 | Directus | Versions, drafts, activity log, granular permissions | ADAPT | FTV-COMP-024; FTV-COMP-028 | Useful for audit/review if Directus is accepted. |
| COMP-015 | Strapi | Draft & Publish, review workflow, releases | REFERENCE ONLY | None | Useful editorial reference, but edition/license/feature boundary needs verification. |
| COMP-016 | Payload | Versions, drafts, autosave, scheduled publish, access control | ADAPT | FTV-COMP-009; FTV-COMP-011; FTV-COMP-013 | Strong MIT content workflow candidate. |
| COMP-017 | Penpot | Design tokens, components, variants, inspect mode | REFERENCE ONLY | FTV-COMP-014 | Useful design reference; full design platform not MVP dependency. |
| COMP-018 | Ghost | Post settings, tags, authors, excerpts, metadata, scheduling | ADAPT | FTV-COMP-012 | Good publishing metadata/checklist pattern. |
| COMP-019 | Metabase | Models, metrics, query builder, dashboards | ADAPT | FTV-COMP-017 | Good MVP analysis tool/pattern; AGPL/commercial boundary requires care. |
| COMP-020 | Apache Superset | SQL Lab, datasets, dashboards, semantic layer, chart builder | REFERENCE ONLY | None | Strong BI reference, but heavier than MVP needs. |
| COMP-021 | Grafana | Dashboards, mixed data sources, alerting | REFERENCE ONLY | None | Useful dashboard reference; ops/time-series bias. |
| COMP-022 | Lightdash | Governed metrics, semantic layer, dashboards as code | REFERENCE ONLY | None | Useful semantic-metrics reference; dbt-heavy for MVP. |
| COMP-023 | PostHog | Event ingestion, product analytics, funnels, experiments, warehouse | REFERENCE ONLY | FTV-COMP-016 | Useful analytics schema reference; not primary platform-metric import. |
| COMP-024 | Evidence | SQL + Markdown reports/static publishing | ADAPT | FTV-COMP-018 | Lightweight narrative analytics candidate. |
| COMP-025 | n8n | Visual workflow automation/integrations | REJECT | None | Source-available/commercial verification concern; overlaps Activepieces. |
| COMP-026 | Activepieces | Flow builder, triggers/actions, run details, alerts, encrypted secrets | ADAPT | FTV-COMP-019 | Best narrow automation candidate. |
| COMP-027 | Kestra | YAML workflows, triggers, scheduler, UI editor, plugins | ADAPT | FTV-COMP-020 | Good technical scheduler candidate if MVP needs scheduled jobs. |
| COMP-028 | OpenFGA | Relationship tuples, authorization models, conditional checks | ADAPT | FTV-COMP-021; FTV-COMP-025 | Focused authorization candidate; may be deferred if MVP policy stays simple. |
| COMP-029 | Temporal | Durable workflows, activities, retries, event history | REJECT | None | Technically strong but too code/orchestration-heavy for MVP. |
| COMP-030 | Camunda | BPMN, DMN, FEEL, user tasks, business rule tasks | REFERENCE ONLY | FTV-COMP-022 | Useful rule/workflow reference; full platform too large. |
| COMP-031 | OpenMetadata | Data catalog, glossary, tags, lineage, quality, contracts | REFERENCE ONLY | None | Governance reference only; enterprise-scale for MVP. |
| COMP-032 | DataHub | Metadata graph, ownership, tags, domains, policies, lineage | REFERENCE ONLY | FTV-COMP-026 | Governance/lineage reference only; enterprise-scale for MVP. |

---

## 5. Cross-Cutting Findings

### 5.1 Functional Duplicate Components

| Functional area | Duplicate candidates | Selection outcome |
|---|---|---|
| DAM/media library | Immich COMP-001; PhotoPrism COMP-004; ResourceSpace COMP-005; Nextcloud COMP-009 | ResourceSpace COMP-005 selected as ADAPT; Immich/PhotoPrism reference only; Nextcloud rejected. |
| Rights/provenance | ResourceSpace COMP-006; Directus COMP-014; OpenFGA COMP-028 | ResourceSpace selected for media rights metadata; OpenFGA selected for authorization; Directus selected for activity/audit records. |
| Draft/content workflow | Payload COMP-016; Strapi COMP-015; Ghost COMP-018; Directus COMP-014 | Payload selected for draft/version workflow; Ghost selected for publishing metadata; Strapi reference only. |
| Dashboards/analytics | Metabase COMP-019; Superset COMP-020; Grafana COMP-021; Lightdash COMP-022; Evidence COMP-024; PostHog COMP-023 | Metabase selected for dashboards; Evidence selected for narrative reports; others reference only. |
| Workflow automation | n8n COMP-025; Activepieces COMP-026; Kestra COMP-027; Temporal COMP-029; Camunda COMP-030 | Activepieces selected for user-facing automation; Kestra selected for scheduled jobs; Temporal/n8n rejected; Camunda reference only. |
| Governance/catalog | OpenFGA COMP-028; OpenMetadata COMP-031; DataHub COMP-032; Directus COMP-014 | OpenFGA selected for policy checks; Directus for activity logs; DataHub/OpenMetadata reference only. |

### 5.2 Components Too Large for MVP

| Component | Reason |
|---|---|
| Immich COMP-001/COMP-002 | Full personal photo platform; useful UX/search reference but too large for FTV MVP asset intake. |
| PhotoPrism COMP-003/COMP-004 | Full media library/indexing platform; good media-processing reference but too broad and AGPL-constrained. |
| Nextcloud COMP-009 | General collaboration/file platform; too broad for FTV-specific DAM/provenance needs. |
| Apache Superset COMP-020 | Heavy BI platform for MVP analytics. |
| Grafana COMP-021 | Strong but ops/time-series oriented and more than MVP needs. |
| Lightdash COMP-022 | Assumes governed metrics/dbt-style analytics maturity beyond MVP. |
| Temporal COMP-029 | Durable workflow engine is too engineering-heavy for manual-first MVP. |
| Camunda COMP-030 | BPMN/DMN suite is too enterprise-scale for MVP. |
| OpenMetadata COMP-031 | Enterprise metadata catalog exceeds MVP governance scope. |
| DataHub COMP-032 | Enterprise metadata graph/lineage exceeds MVP governance scope; retained only as reference. |

### 5.3 Components Suitable Only as Architecture or UX Reference

| Component | Reference value |
|---|---|
| Immich COMP-001/COMP-002 | Gallery UX, duplicate review UX, ML/search behavior. |
| PhotoPrism COMP-003/COMP-004 | Media processing/indexing pipeline stages. |
| AppFlowy COMP-011/COMP-012 | Planning/review workspace UX. |
| Penpot COMP-017 | Template/design variant concepts. |
| Superset COMP-020 | BI semantic/dashboard reference. |
| Grafana COMP-021 | Dashboard and alerting reference. |
| Lightdash COMP-022 | Governed metrics reference. |
| PostHog COMP-023 | Event schema and ingestion reference. |
| Camunda COMP-030 | Rule-table and business process reference. |
| OpenMetadata COMP-031/DataHub COMP-032 | Governance vocabulary, ownership, lineage reference. |

### 5.4 Capability Areas With Potential BUILD Gap

These are not architecture decisions and not implementation decisions. They are remaining component gaps after candidate selection.

| Capability | Gap |
|---|---|
| CAP-01 | Lawful approved-key source discovery/download connector is not sufficiently covered by candidates; intake can be modeled, but source acquisition behavior may need custom MVP work. |
| CAP-03 | Minimal local FFmpeg/OCR/STT wrapper may need custom implementation because media-processing candidates are too broad or license-constrained. |
| CAP-06 | Platform performance CSV/API import parser and normalization logic is not fully provided by analytics candidates; Directus can stage records but not collect platform metrics by itself. |
| CAP-09 | Simple business-rule validation may need custom MVP logic if OpenFGA is too heavy for early rule enforcement. |

---

## 6. Selected Component Summary

| FTV component | Capability | Selected source | Decision | MVP role |
|---|---|---|---|---|
| FTV-COMP-001 | CAP-01 | ResourceSpace COMP-005 | ADAPT | Asset intake queue |
| FTV-COMP-002 | CAP-01/CAP-02 | ResourceSpace COMP-006 | ADAPT | Provenance capture |
| FTV-COMP-003 | CAP-02 | ResourceSpace COMP-005 | ADAPT | Asset library model |
| FTV-COMP-004 | CAP-02/CAP-11 | ResourceSpace COMP-006 | ADAPT | Rights tracking |
| FTV-COMP-005 | CAP-02/CAP-03 | LibrePhotos COMP-008 | ADAPT | Duplicate detection |
| FTV-COMP-006 | CAP-03 | PhotoPrism COMP-003 | REFERENCE ONLY | FFmpeg processing reference |
| FTV-COMP-007 | CAP-03/CAP-02 | PhotoPrism COMP-004 | REFERENCE ONLY | Metadata/thumb indexing reference |
| FTV-COMP-008 | CAP-03 | ResourceSpace COMP-007 | REFERENCE ONLY | OCR/STT enrichment reference |
| FTV-COMP-009 | CAP-04 | Payload COMP-016 | ADAPT | Content brief/edit plan records |
| FTV-COMP-010 | CAP-04/CAP-12 | AppFlowy COMP-011/COMP-012 | REFERENCE ONLY | Planning workspace UX |
| FTV-COMP-011 | CAP-04/CAP-05 | Payload COMP-016 | ADAPT | Draft/version workflow |
| FTV-COMP-012 | CAP-05 | Ghost COMP-018 | ADAPT | Publishing metadata checklist |
| FTV-COMP-013 | CAP-05/CAP-12 | Payload COMP-016 | ADAPT | Publish-readiness state |
| FTV-COMP-014 | CAP-04/CAP-05 | Penpot COMP-017 | REFERENCE ONLY | Visual template reference |
| FTV-COMP-015 | CAP-06/CAP-10 | Directus COMP-013 | ADAPT | Performance staging model |
| FTV-COMP-016 | CAP-06/CAP-07 | PostHog COMP-023 | REFERENCE ONLY | Event ingestion reference |
| FTV-COMP-017 | CAP-07 | Metabase COMP-019 | ADAPT | Metrics dashboards |
| FTV-COMP-018 | CAP-07 | Evidence COMP-024 | ADAPT | Narrative performance report |
| FTV-COMP-019 | CAP-08 | Activepieces COMP-026 | ADAPT | Approval/task automation |
| FTV-COMP-020 | CAP-08/CAP-06/CAP-03 | Kestra COMP-027 | ADAPT | Scheduled processing/import jobs |
| FTV-COMP-021 | CAP-09/CAP-11 | OpenFGA COMP-028 | ADAPT | Object-level permission checks |
| FTV-COMP-022 | CAP-09/CAP-08 | Camunda COMP-030 | REFERENCE ONLY | Rule-model reference |
| FTV-COMP-023 | CAP-10 | Directus COMP-013 | ADAPT | Core data admin |
| FTV-COMP-024 | CAP-10/CAP-11/CAP-12 | Directus COMP-014 | ADAPT | Activity/version visibility |
| FTV-COMP-025 | CAP-11/CAP-09 | OpenFGA COMP-028 | ADAPT | Governance policy service |
| FTV-COMP-026 | CAP-11 | DataHub COMP-032 | REFERENCE ONLY | Governance/lineage reference |
| FTV-COMP-027 | CAP-12/CAP-04 | AppFlowy COMP-011/COMP-012 | REFERENCE ONLY | Review workspace UX |
| FTV-COMP-028 | CAP-12/CAP-10 | Directus COMP-014 | ADAPT | Review status/approval records |

---

## 7. Reuse / Adapt / Reference Only / Reject Summary

| Decision | Candidate components | Count | Summary |
|---|---|---:|---|
| REUSE | None | 0 | No component is selected for direct reuse without adaptation or verification. |
| ADAPT | COMP-005, COMP-006, COMP-008, COMP-013, COMP-014, COMP-016, COMP-018, COMP-019, COMP-024, COMP-026, COMP-027, COMP-028 | 12 | Best current pool for MVP component adaptation. |
| REFERENCE ONLY | COMP-001, COMP-002, COMP-003, COMP-004, COMP-007, COMP-011, COMP-012, COMP-015, COMP-017, COMP-020, COMP-021, COMP-022, COMP-023, COMP-030, COMP-031, COMP-032 | 16 | Useful for architecture, UX, analytics, processing, workflow, or governance concepts, but not selected as direct MVP dependencies. |
| REJECT | COMP-009, COMP-010, COMP-025, COMP-029 | 4 | Not selected for MVP due poor fit, license/verification concern, duplication, or excessive scope. |

---

## 8. Capability Coverage after Selection

| Capability | Coverage status | Selected/adapted components | Reference-only support | Remaining gap |
|---|---|---|---|---|
| CAP-01 Asset Acquisition | Partial | FTV-COMP-001; FTV-COMP-002 | None | Source acquisition connector/search behavior remains uncovered. |
| CAP-02 Asset Management | Covered with verification | FTV-COMP-003; FTV-COMP-004; FTV-COMP-005 | FTV-COMP-007 | ResourceSpace license/module verification. |
| CAP-03 Media Processing | Partial | FTV-COMP-005; FTV-COMP-020 | FTV-COMP-006; FTV-COMP-007; FTV-COMP-008 | Minimal media-processing wrapper may need custom MVP work. |
| CAP-04 Content Production | Covered with verification | FTV-COMP-009; FTV-COMP-011 | FTV-COMP-010; FTV-COMP-014 | Need decide system of record boundary between Payload and Directus later. |
| CAP-05 Publishing Preparation | Covered | FTV-COMP-012; FTV-COMP-013 | FTV-COMP-014 | Destination-specific export/package fields need definition later. |
| CAP-06 Performance Data Collection | Partial | FTV-COMP-015; FTV-COMP-020 | FTV-COMP-016 | CSV/API import normalization remains uncovered. |
| CAP-07 Performance Analysis | Covered with verification | FTV-COMP-017; FTV-COMP-018 | FTV-COMP-016 | Metabase license/deployment boundary. |
| CAP-08 Workflow Management | Covered with verification | FTV-COMP-019; FTV-COMP-020 | FTV-COMP-022 | Need confirm if scheduler is necessary for MVP. |
| CAP-09 Rule Enforcement | Partial | FTV-COMP-021 | FTV-COMP-022 | Simple business-rule validation may need custom MVP logic. |
| CAP-10 Data Management | Covered with verification | FTV-COMP-023; FTV-COMP-024 | None | Directus license boundary is blocking verification. |
| CAP-11 Governance Support | Covered with verification | FTV-COMP-004; FTV-COMP-025; FTV-COMP-024 | FTV-COMP-026 | Need decide if OpenFGA is MVP or deferred. |
| CAP-12 Human Review Support | Covered with verification | FTV-COMP-028; FTV-COMP-013 | FTV-COMP-027 | Review UI/system-of-record boundary remains open. |

---

## 9. Repository Utilization Summary

| Repository | Subsystem support | Candidate components used | Component-level decisions | Utilization note |
|---|---|---|---|---|
| Immich | SUBSYSTEM-01 | COMP-001; COMP-002 | REFERENCE ONLY | Useful gallery/search reference; not selected for MVP dependency. |
| PhotoPrism | SUBSYSTEM-01 | COMP-003; COMP-004 | REFERENCE ONLY | Media pipeline reference only due scope/license. |
| ResourceSpace | SUBSYSTEM-01 | COMP-005; COMP-006; COMP-007 | ADAPT; REFERENCE ONLY | Main DAM/rights pattern; OCR/STT reference. License verification required. |
| LibrePhotos | SUBSYSTEM-01 | COMP-008 | ADAPT | Focused duplicate-detection candidate. |
| Nextcloud | SUBSYSTEM-01 | COMP-009 | REJECT | Generic file platform overlaps DAM with weaker MVP fit. |
| Stalwart | SUBSYSTEM-01 | COMP-010 | REJECT | Storage pattern not close enough to FTV asset vault MVP. |
| AppFlowy | SUBSYSTEM-02; SUBSYSTEM-05 | COMP-011; COMP-012 | REFERENCE ONLY | Multi-subsystem UX reference for planning/review; not duplicated as dependency decision. |
| Directus | SUBSYSTEM-02; SUBSYSTEM-05 | COMP-013; COMP-014 | ADAPT | Multi-subsystem data/admin/activity candidate; license boundary is blocking verification. |
| Strapi | SUBSYSTEM-02 | COMP-015 | REFERENCE ONLY | Editorial workflow reference; verification uncertainty prevents selection. |
| Payload | SUBSYSTEM-02 | COMP-016 | ADAPT | Content workflow/draft candidate. |
| Penpot | SUBSYSTEM-02 | COMP-017 | REFERENCE ONLY | Design/template reference only. |
| Ghost | SUBSYSTEM-02 | COMP-018 | ADAPT | Publishing metadata/checklist candidate. |
| Metabase | SUBSYSTEM-03 | COMP-019 | ADAPT | Dashboard/metrics candidate; AGPL/commercial boundary needs verification. |
| Apache Superset | SUBSYSTEM-03 | COMP-020 | REFERENCE ONLY | BI reference only; too heavy for MVP. |
| Grafana | SUBSYSTEM-03; SUBSYSTEM-05 | COMP-021 | REFERENCE ONLY | Multi-subsystem dashboard/reference value; no duplicated decision. |
| Lightdash | SUBSYSTEM-03 | COMP-022 | REFERENCE ONLY | Governed metrics reference only. |
| PostHog | SUBSYSTEM-03 | COMP-023 | REFERENCE ONLY | Event analytics reference only. |
| Evidence | SUBSYSTEM-03 | COMP-024 | ADAPT | Narrative reporting candidate. |
| n8n | SUBSYSTEM-04 | COMP-025 | REJECT | License/verification concern and duplicate with Activepieces. |
| Activepieces | SUBSYSTEM-04 | COMP-026 | ADAPT | Approval/task automation candidate. |
| Kestra | SUBSYSTEM-04 | COMP-027 | ADAPT | Scheduler/background workflow candidate. |
| OpenFGA | SUBSYSTEM-04; SUBSYSTEM-05 | COMP-028 | ADAPT | Multi-subsystem policy component; one shared decision record. |
| Temporal | SUBSYSTEM-04 | COMP-029 | REJECT | Too heavy for MVP workflow needs. |
| Camunda | SUBSYSTEM-04 | COMP-030 | REFERENCE ONLY | DMN/BPMN rule reference only. |
| OpenMetadata | SUBSYSTEM-05 | COMP-031 | REFERENCE ONLY | Governance/catalog reference only; too enterprise-scale. |
| DataHub | SUBSYSTEM-05 | COMP-032 | REFERENCE ONLY | Governance/lineage reference only; too enterprise-scale. |

---

## 10. Remaining Component Gaps

| Gap ID | Capability | Gap description | Candidate coverage status | Potential next-phase note |
|---|---|---|---|---|
| GAP-COMP-001 | CAP-01 | Lawful source acquisition connector/search/download behavior for approved keys. | Not sufficiently covered by current pool. | May require custom MVP component or manual-only process. |
| GAP-COMP-002 | CAP-03 | Small local media-processing wrapper for FFmpeg, thumbnails, normalization, and optional OCR/STT. | Only reference candidates selected. | May require custom wrapper if direct PhotoPrism/ResourceSpace reuse is unsuitable. |
| GAP-COMP-003 | CAP-06 | Performance CSV/API import parser and platform-specific metric normalization. | Directus can stage data; analytics repos do not collect platform metrics. | May require custom import scripts/connectors. |
| GAP-COMP-004 | CAP-09 | Simple configurable rule validation for MVP approval gates. | OpenFGA covers authorization; Camunda only reference. | May require lightweight custom rules if OpenFGA is deferred. |
| GAP-COMP-005 | CAP-10/CAP-12 | Unified boundary between Directus, Payload, and review records. | Multiple adapted candidates overlap. | Must be resolved in later System Assembly, not here. |

---

## 11. Blocking License or Verification Issues

| Issue | Affected repository/component | Impact | Required verification before later phase |
|---|---|---|---|
| ResourceSpace license/module boundary | COMP-005; COMP-006; COMP-007 | Blocks direct reuse of DAM/rights/plugin code. | Confirm license terms, module availability, and allowed reuse/deployment model. |
| Directus source-available/commercial boundary | COMP-013; COMP-014 | Blocks relying on Directus as core data/admin/review system without legal/product verification. | Confirm license version, commercial restrictions, and acceptable deployment mode. |
| Metabase AGPL/commercial boundary | COMP-019 | Affects dashboard dependency or embedded analytics approach. | Confirm whether separate-service use is acceptable and whether code adaptation is avoided. |
| PhotoPrism AGPL | COMP-003; COMP-004 | Prevents casual direct code reuse for media processing/indexing. | Treat as reference unless license obligations are explicitly accepted. |
| AppFlowy AGPL | COMP-011; COMP-012 | Prevents casual direct reuse of workspace components. | Treat as UX reference unless license obligations are accepted. |
| PostHog OSS/enterprise boundary | COMP-023 | Limits use of analytics/event features. | Confirm selected feature set is OSS-compatible before any later adoption. |
| Strapi feature/license verification | COMP-015 | Prevents selecting review/release features for MVP. | Confirm whether required workflow features are available in usable open-source edition. |
| n8n source-available/commercial boundary | COMP-025 | Contributes to rejection for MVP automation. | No further action unless revisited explicitly. |
| Camunda license/deployment boundary | COMP-030 | Prevents direct workflow/rule platform adoption. | Treat as reference only unless enterprise workflow becomes approved later. |

---

## 12. Self Review

| Check | Result |
|---|---|
| Used only repositories/components from `CANDIDATE_REPOSITORY_INDEX.md` | Pass |
| CAP-01 through CAP-12 processed | Pass |
| Component-level decisions used instead of repository-wide decisions | Pass |
| Decision vocabulary limited to REUSE / ADAPT / REFERENCE ONLY / REJECT | Pass |
| Multi-subsystem repositories recognized without duplicating whole-repo decisions | Pass |
| Duplicate functionality recorded | Pass |
| Oversized MVP components recorded | Pass |
| Reference-only components recorded | Pass |
| Potential BUILD gaps recorded only as gaps, not as decisions or plan | Pass |
| Architecture Blueprint avoided | Pass |
| System Assembly design avoided | Pass |
| Implementation Plan avoided | Pass |

---

## 13. Stop Point

This file is ready for review as the STEP-01 Candidate Component Selection artifact.

No Architecture Blueprint, System Assembly design, or Implementation Plan has been created.

