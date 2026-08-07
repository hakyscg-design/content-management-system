# FTV v2 Implementation Stage-8 - Performance Import & Metric Normalization

## Implementation Plan

Stage-8 builds the MVP Performance Data layer for FTV-SVC-06. It imports manual/CSV performance rows from completed publishing packages, maps source fields to canonical metrics, normalizes values into performance facts, records import errors, and preserves audit/history traceability.

This stage does not implement analytics, recommendations, trend detection, platform posting, scheduling, autonomous API connectors, or workflow coordination.

## Roadmap Confirmation

| Roadmap field | Stage-8 resolution |
|---|---|
| Purpose | Capture manually published performance data and normalize it into performance facts. |
| Services | FTV-SVC-06; FTV-SVC-04 by reference; FTV-SVC-09 for governance; FTV-SVC-08 optional trigger by reference only. |
| Domains | Performance Domain; Publishing Domain by reference; Workflow Domain by reference only; Governance Domain by check/audit. |
| Capabilities | CAP-06. |
| Components | FTV-COMP-015; FTV-COMP-016; FTV-COMP-020. |
| Repositories | Directus ADAPT; PostHog REFERENCE ONLY; Kestra ADAPT as optional trigger pattern. |
| Dependencies | Stage-1; Stage-7. |
| Deliverables | Performance import lifecycle; CSV import module; API import candidate; metric mapping; metric normalization. |
| Acceptance Criteria | A manual/CSV import can create normalized performance facts tied to publishing/content references. |
| Exit Criteria | Analytics can consume facts and metric definitions. |
| Risks | Platform metrics are inconsistent; Directus verification may affect staging. |
| Out of Scope | Full product analytics platform; autonomous API connector implementation. |

## Dependency Verification

| Dependency | Verification |
|---|---|
| Stage-1 | Governance service imports and regression tests pass. |
| Stage-7 | Completed publishing package with manual publishing reference is required before import. |
| Blocking issue | None found. |

## Folder Structure

```text
src/ftv/performance_data/
tests/ftv/performance_data/
build/stages/stage-8/
```

## Project Layout

```text
C:\repository-acquisition-framework
|-- src\ftv\performance_data
|-- tests\ftv\performance_data
|-- build\stages\stage-8
`-- build\stages\STAGE-8_PERFORMANCE_IMPORT_METRIC_NORMALIZATION.md
```

## Package Layout

```text
ftv.performance_data
```

## Module Layout

| Module | Responsibility |
|---|---|
| `constants.py` | Frozen Stage-8 service/entity identifiers. |
| `errors.py` | Stage-8 validation, lookup, and transition errors. |
| `state.py` | Performance import and metric definition states. |
| `models.py` | Import, fact, definition, mapping, error, and history models. |
| `contracts.py` | Command DTOs for metric definition, mapping, CSV/manual import, and cancellation. |
| `interfaces.py` | Repository and publishing gateway protocols. |
| `repository_adapters.py` | In-memory MVP repository adapters. |
| `csv_parser.py` | CSV import parser. |
| `validators.py` | Metric, mapping, and import validation. |
| `normalizer.py` | Mapping-driven metric normalization. |
| `publishing_gateway.py` | Stage-7 manual publishing validation gateway. |
| `governance.py` | Stage-1 governance and audit gateway. |
| `service.py` | FTV-SVC-06 performance data application service. |
| `config.py` | Stage-8 in-memory service assembly. |

## Source Tree

```text
src/ftv/performance_data/__init__.py
src/ftv/performance_data/config.py
src/ftv/performance_data/constants.py
src/ftv/performance_data/contracts.py
src/ftv/performance_data/csv_parser.py
src/ftv/performance_data/errors.py
src/ftv/performance_data/governance.py
src/ftv/performance_data/interfaces.py
src/ftv/performance_data/models.py
src/ftv/performance_data/normalizer.py
src/ftv/performance_data/publishing_gateway.py
src/ftv/performance_data/repository_adapters.py
src/ftv/performance_data/service.py
src/ftv/performance_data/state.py
src/ftv/performance_data/validators.py
tests/ftv/performance_data/test_service_integration.py
tests/ftv/performance_data/test_smoke.py
tests/ftv/performance_data/test_state.py
tests/ftv/performance_data/test_validators.py
```

## Interfaces

| Interface | Purpose |
|---|---|
| `PerformanceImportRepository` | Owns import lifecycle records. |
| `PerformanceFactRepository` | Owns normalized performance facts. |
| `MetricDefinitionRepository` | Owns metric definitions. |
| `MetricMappingRepository` | Owns mapping from source fields to canonical metrics. |
| `ImportErrorRepository` | Owns import validation/error records. |
| `ImportHistoryRepository` | Owns import history records. |
| `PublishingReferenceGateway` | Validates completed manual publishing package references. |

## Domain Models

| Model | Ownership |
|---|---|
| `PerformanceImport` | FTV-SVC-06 authoritative record. |
| `PerformanceFact` | FTV-SVC-06 authoritative record. |
| `MetricDefinition` | FTV-SVC-06 authoritative record. |
| `MetricMapping` | FTV-SVC-06 mapping record. |
| `ImportErrorRecord` | FTV-SVC-06 import error record. |
| `ImportHistoryEntry` | FTV-SVC-06 import history record. |

## DTOs and Contracts

| DTO | Use |
|---|---|
| `DefineMetricCommand` | Create a canonical metric definition. |
| `MapMetricCommand` | Map source platform field to metric definition. |
| `ImportMetricsCommand` | Import manual/API-candidate row data. |
| `ImportCsvCommand` | Parse and import CSV rows. |
| `CancelImportCommand` | Cancel pending/importing/failed import when applicable. |

## Import Models

`PerformanceImport` stores publishing package reference, content package reference, source platform, import method, state, row/fact/error counts, requester, and timestamps.

## Metric Models

`MetricDefinition` stores canonical metric key/name/unit. `MetricMapping` stores source platform, source field, metric key, source unit, canonical unit, and multiplier.

## Mapping Models

Mappings are created explicitly before import. The import service does not infer metrics, fields, or sources.

## Audit Models

`ImportHistoryEntry` records state changes. Formal governance audit events are recorded through FTV-SVC-09 for governed mutations.

## Repository Adapters

Stage-8 uses in-memory repositories only:

- `InMemoryPerformanceImportRepository`
- `InMemoryPerformanceFactRepository`
- `InMemoryMetricDefinitionRepository`
- `InMemoryMetricMappingRepository`
- `InMemoryImportErrorRepository`
- `InMemoryImportHistoryRepository`

No database, scheduler, workflow engine, external analytics platform, or API connector was added.

## Internal Modules

| Internal module | MVP implementation |
|---|---|
| CSV Import | `CsvImportParser` plus `import_csv()`. |
| API Import Candidate | `ImportMetricsCommand` supports row data as an API-candidate boundary only. |
| Metric Mapping | `map_metric()` and mapping repository. |
| Metric Normalization | `MetricNormalizer`. |

## Configurations

`build_stage8_performance_data_service()` wires Stage-8 to Stage-1 governance and Stage-7 publishing preparation. Metrics, mappings, sources, validation, and rows are command-driven rather than hard-coded.

## Tests

| Test file | Coverage |
|---|---|
| `test_state.py` | Import state transition rules. |
| `test_validators.py` | Metric definition and mapping validation. |
| `test_service_integration.py` | Full upstream chain, CSV import, manual import errors, mapping requirement, publishing reference validation, traceability. |
| `test_smoke.py` | Stage-8 service assembly. |

## Validation

Validation performed:

```text
Stage-8 test suite: 10 tests OK
Stage-1 regression suite: 10 tests OK
Stage-2 regression suite: 8 tests OK
Stage-3 regression suite: 13 tests OK
Stage-4 regression suite: 12 tests OK
Stage-5 regression suite: 13 tests OK
Stage-6 regression suite: 15 tests OK
Stage-7 regression suite: 10 tests OK
Stage-1 through Stage-8 explicit chain suite: 91 tests OK
```

## Review

- Architecture: no frozen architecture, service, domain, ownership, repository decision, or roadmap change.
- Scope: limited to Stage-8 CAP-06.
- Service ownership: FTV-SVC-06 owns Performance import, Performance fact, Metric definition, metric mapping, import errors, and history. FTV-SVC-04 owns Publishing package. FTV-SVC-09 owns governance/audit.
- Repository decisions: Directus pattern is adapted internally; PostHog remains reference only; Kestra remains optional trigger pattern only.
- MVP posture: manual-first, repository-neutral, in-memory, no new framework or infrastructure.

## Known Limitations

- No autonomous platform API connector.
- No scheduler or workflow run.
- No analytics report/dashboard.
- No trend detection, recommendation, or AI decision.
- No persistence beyond in-memory repositories.

## Next Stage Dependency

Stage-9 can consume normalized `PerformanceFact` records and `MetricDefinition` records. Stage-8 does not create analytics reports.

## Self Review Report

- CAP-06 is covered for MVP performance data collection.
- Stage-1 through Stage-7 remain unchanged.
- Publishing/performance ownership is preserved.
- Import facts are tied to completed manual publishing references.
- Metrics and mappings are explicit and not hard-coded.
- No Stage-9 or later code was added.
- No Architecture Blueprint, System Assembly, Build Roadmap, or frozen discovery artifact changed.
