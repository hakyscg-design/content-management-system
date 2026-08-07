# FTV v2 Implementation Stage-9 - Analytics & Learning

## Implementation Plan

Stage-9 builds the MVP Analytics & Learning layer for FTV-SVC-07. It consumes normalized performance facts from Stage-8, builds command-driven analytics datasets, creates narrative reports, and records learning summaries linked to content references.

This stage does not implement rule engines, signal detection, decision engines, recommendation engines, AI/LLM, trend prediction, workflow automation, or performance import.

## Roadmap Confirmation

| Roadmap field | Stage-9 resolution |
|---|---|
| Purpose | Generate reports and learning summaries from performance facts. |
| Services | FTV-SVC-07; FTV-SVC-06 by reference; FTV-SVC-03 by reference. |
| Domains | Analytics Domain; Performance Domain by reference; Content Domain by reference. |
| Capabilities | CAP-07. |
| Components | FTV-COMP-016; FTV-COMP-017; FTV-COMP-018. |
| Repositories | Metabase ADAPT; Evidence ADAPT; PostHog REFERENCE ONLY; Superset/Grafana/Lightdash reference only. |
| Dependencies | Stage-8. |
| Deliverables | Dashboard/report pattern; narrative performance report; learning summary link back to content. |
| Acceptance Criteria | Imported metrics can produce an analytics report and learning summary without mutating content records. |
| Exit Criteria | MVP learning loop is demonstrable. |
| Risks | Metabase AGPL/commercial boundary; analytics may overreach into production decisions. |
| Out of Scope | Automated recommendation engine; advanced BI semantic layer. |

## Folder Structure

```text
src/ftv/analytics_reporting/
tests/ftv/analytics_reporting/
build/stages/stage-9/
```

## Project Layout

```text
C:\repository-acquisition-framework
|-- src\ftv\analytics_reporting
|-- tests\ftv\analytics_reporting
|-- build\stages\stage-9
`-- build\stages\STAGE-9_ANALYTICS_LEARNING.md
```

## Package Layout

```text
ftv.analytics_reporting
```

## Source Tree

```text
src/ftv/analytics_reporting/__init__.py
src/ftv/analytics_reporting/config.py
src/ftv/analytics_reporting/constants.py
src/ftv/analytics_reporting/contracts.py
src/ftv/analytics_reporting/dataset.py
src/ftv/analytics_reporting/errors.py
src/ftv/analytics_reporting/governance.py
src/ftv/analytics_reporting/interfaces.py
src/ftv/analytics_reporting/models.py
src/ftv/analytics_reporting/performance_gateway.py
src/ftv/analytics_reporting/reporting.py
src/ftv/analytics_reporting/repository_adapters.py
src/ftv/analytics_reporting/service.py
src/ftv/analytics_reporting/state.py
src/ftv/analytics_reporting/validators.py
tests/ftv/analytics_reporting/test_dataset.py
tests/ftv/analytics_reporting/test_service_integration.py
tests/ftv/analytics_reporting/test_smoke.py
tests/ftv/analytics_reporting/test_validators.py
```

## Interfaces

| Interface | Purpose |
|---|---|
| `AnalyticsReportRepository` | Owns analytics report persistence. |
| `AnalyticsHistoryRepository` | Owns analytics report history. |
| `PerformanceFactsGateway` | Reads Stage-8 facts/metrics without owning them. |

## Domain Models

| Model | Ownership |
|---|---|
| `AnalyticsReport` | FTV-SVC-07 authoritative record. |
| `AnalyticsDataset` | Report-owned dataset snapshot. |
| `AnalyticsDatasetRow` | Report dataset row. |
| `LearningSummary` | Report-owned learning output linked to content references. |
| `AnalyticsHistoryEntry` | FTV-SVC-07 analytics audit/history record. |

## DTOs and Contracts

| DTO | Use |
|---|---|
| `GenerateAnalyticsReportCommand` | Generate analytics dataset, narrative report, and learning summary. |

## Analytics Models

`AnalyticsDataset` stores selected metric keys, group_by dimensions, aggregation method, source fact count, and rows. Supported dimensions are content package, publishing package, platform, and time.

## Report Models

`AnalyticsReport` stores title, report type, dataset snapshot, narrative text, learning summary, generator, state, and timestamp.

## Learning Models

`LearningSummary` stores content package references, metric references, evidence strings, repeat notes, and avoid notes. It is a report output, not a decision engine.

## Audit Models

`AnalyticsHistoryEntry` records report generation history. Formal governance audit events are recorded through FTV-SVC-09.

## Repository Adapters

Stage-9 uses in-memory repositories only:

- `InMemoryAnalyticsReportRepository`
- `InMemoryAnalyticsHistoryRepository`

No database, BI platform, workflow engine, LLM, AI service, or infrastructure was added.

## Internal Modules

| Internal module | MVP implementation |
|---|---|
| Analytics Dataset Builder | `AnalyticsDatasetBuilder`. |
| Dashboard Builder | Dataset rows are dashboard-ready report data. |
| Report Generator | `AnalyticsReportingService.generate_report()`. |
| Narrative Report Generator | `NarrativeReportGenerator`. |
| Learning Summary Generator | `LearningSummaryGenerator`. |
| Analytics Audit | `AnalyticsHistoryRepository` plus governance audit gateway. |

## Configurations

`build_stage9_analytics_reporting_service()` wires Stage-9 to Stage-8 performance data and Stage-1 governance. Metric selection, group_by dimensions, aggregation, and report type are command-driven.

## Tests

| Test file | Coverage |
|---|---|
| `test_validators.py` | Report request and metric validation. |
| `test_dataset.py` | Dataset aggregation. |
| `test_service_integration.py` | Full upstream chain, report generation, learning summary, content non-mutation. |
| `test_smoke.py` | Stage-9 service assembly. |

## Validation

Validation performed:

```text
Stage-9 test suite: 5 tests OK
Stage-1 through Stage-9 explicit chain suite: 96 tests OK
```

## Review

- Architecture: no frozen architecture, service, domain, ownership, repository decision, or roadmap change.
- Scope: limited to Stage-9 CAP-07.
- Service ownership: FTV-SVC-07 owns Analytics report and learning output. FTV-SVC-06 owns facts/metrics. FTV-SVC-03 owns content.
- Repository decisions: Metabase/Evidence patterns are adapted internally; PostHog/Superset/Grafana/Lightdash remain reference only.
- MVP posture: read-oriented, manual/semi-manual, repository-neutral, in-memory, no new framework or infrastructure.

## Known Limitations

- No real dashboard UI.
- No BI platform deployment.
- No automated recommendation engine.
- No AI/LLM.
- No trend prediction.
- No workflow automation.
- No persistence beyond in-memory repositories.

## Next Stage Dependency

Stage-10 can reference generated reports if needed, but Stage-9 does not create workflow runs or trigger automation.

## Self Review Report

- CAP-07 is covered for MVP analytics and learning.
- Stage-1 through Stage-8 remain unchanged.
- Analytics does not mutate content or performance facts.
- Learning summary is report-owned and human-readable, not automated decision-making.
- No Stage-10 or later code was added.
- No Architecture Blueprint, System Assembly, Build Roadmap, or frozen discovery artifact changed.
