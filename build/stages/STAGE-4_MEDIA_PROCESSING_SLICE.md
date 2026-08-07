# FTV v2 Implementation Stage-4 - Media Processing Slice

## Implementation Plan

Stage-4 builds the smallest MVP media processing slice around FTV-SVC-02. The service accepts READY assets from FTV-SVC-01, creates processing jobs, executes deterministic internal modules for derivatives and metadata, exposes an optional enrichment extension point, and records governance checks and audit through FTV-SVC-09.

## Folder Structure

```text
src/ftv/media_processing/
tests/ftv/media_processing/
build/stages/stage-4/
```

## Project Layout

```text
C:\repository-acquisition-framework
|-- src\ftv\media_processing
|-- tests\ftv\media_processing
|-- build\stages\stage-4
`-- build\stages\STAGE-4_MEDIA_PROCESSING_SLICE.md
```

## Package Structure

```text
ftv.media_processing
```

## Module Structure

| Module | Responsibility |
|---|---|
| `constants.py` | Frozen service/entity identifiers for Stage-4 traceability. |
| `errors.py` | Stage-4 validation, transition, lookup, and execution errors. |
| `state.py` | Processing job state machine and operation/derivative enums. |
| `models.py` | Processing job, derivative, metadata, enrichment, and history records. |
| `contracts.py` | Command DTOs for job lifecycle actions. |
| `interfaces.py` | Repository and processing adapter protocols. |
| `repository_adapters.py` | In-memory MVP repository adapters. |
| `validators.py` | Command and manual reason validation. |
| `asset_gateway.py` | Read-only Stage-3 asset readiness gateway. |
| `governance.py` | Stage-1 governance and audit gateway. |
| `adapters.py` | Deterministic media, metadata, and optional enrichment adapters. |
| `service.py` | FTV-SVC-02 media processing application service. |
| `config.py` | Stage-4 in-memory service assembly. |

## Source Tree

```text
src/ftv/media_processing/__init__.py
src/ftv/media_processing/adapters.py
src/ftv/media_processing/asset_gateway.py
src/ftv/media_processing/config.py
src/ftv/media_processing/constants.py
src/ftv/media_processing/contracts.py
src/ftv/media_processing/errors.py
src/ftv/media_processing/governance.py
src/ftv/media_processing/interfaces.py
src/ftv/media_processing/models.py
src/ftv/media_processing/repository_adapters.py
src/ftv/media_processing/service.py
src/ftv/media_processing/state.py
src/ftv/media_processing/validators.py
tests/ftv/media_processing/test_service_integration.py
tests/ftv/media_processing/test_smoke.py
tests/ftv/media_processing/test_state.py
tests/ftv/media_processing/test_validators.py
```

## Interface Design

| Interface | Purpose |
|---|---|
| `ProcessingJobRepository` | Owns processing job persistence. |
| `MediaDerivativeRepository` | Owns derivative registration records. |
| `MediaMetadataRepository` | Owns extracted metadata records. |
| `EnrichmentResultRepository` | Owns optional OCR/STT enrichment records. |
| `ProcessingHistoryRepository` | Owns processing history records. |
| `MediaProcessor` | Boundary for FFmpeg/media normalization and thumbnail/preview generation. |
| `MetadataExtractor` | Boundary for file/media metadata extraction. |
| `OptionalEnrichmentProvider` | Boundary for optional OCR/STT providers. |

## Domain Models

| Model | Ownership |
|---|---|
| `ProcessingJob` | FTV-SVC-02 authoritative record. |
| `MediaDerivative` | FTV-SVC-02 authoritative record linked to Asset. |
| `MediaMetadata` | FTV-SVC-02 authoritative record linked to Asset. |
| `EnrichmentResult` | FTV-SVC-02 optional enrichment record linked to Asset. |
| `ProcessingHistoryEntry` | FTV-SVC-02 job history record. |

## DTOs and Contracts

| DTO | Use |
|---|---|
| `CreateProcessingJobCommand` | Create a pending job for a READY asset. |
| `AssignProcessingJobCommand` | Move pending job to running and increment attempt count. |
| `ExecuteProcessingJobCommand` | Execute selected operations and complete/fail the job. |
| `RetryProcessingJobCommand` | Manually move failed job back to pending. |
| `CancelProcessingJobCommand` | Manually cancel pending, running, or failed jobs. |

## Processing State Machine

| Current | Allowed Next |
|---|---|
| `pending` | `running`, `cancelled` |
| `running` | `completed`, `failed`, `cancelled` |
| `failed` | `pending`, `cancelled` |
| `completed` | terminal |
| `cancelled` | terminal |

## Job Models

`ProcessingJob` records the asset reference, original media reference, requested operations, state, attempt count, error message, and timestamps. Jobs are manually created, assigned, retried, or cancelled; execution may be triggered directly by Stage-4 or by a later orchestration boundary.

## Derivative Models

`MediaDerivative` registers derivative outputs with traceability to `job_id` and `asset_id`. MVP derivative kinds are thumbnail, preview, optimized media, and normalized media.

## Metadata Models

`MediaMetadata` stores file size, file hash, resolution, duration, codec, bitrate, frame rate, orientation, and additional extracted values. The deterministic MVP extractor computes a stable hash and uses unknown placeholders where a real media probe is not configured.

## Repository Adapter

Stage-4 uses in-memory repositories only:

- `InMemoryProcessingJobRepository`
- `InMemoryMediaDerivativeRepository`
- `InMemoryMediaMetadataRepository`
- `InMemoryEnrichmentResultRepository`
- `InMemoryProcessingHistoryRepository`

No database, external queue, storage provider, or infrastructure was added.

## Internal Modules

| Module Candidate | MVP Implementation |
|---|---|
| FFmpeg / Media Normalization | `DeterministicMediaProcessor` boundary creates normalized and optimized derivative records. |
| Thumbnail Generation | `DeterministicMediaProcessor` boundary creates thumbnail and preview derivative records. |
| Metadata Extraction | `BasicMetadataExtractor` creates metadata records and file/reference hashes. |
| Optional OCR/STT Enrichment | `OptionalEnrichmentProvider` protocol with null and static adapters; no required engine. |

## Configuration

`build_stage4_media_processing_service()` wires Stage-4 to Stage-1 governance and Stage-3 asset registry. Optional adapter parameters allow tests or future approved stages to replace media processing, metadata extraction, or enrichment boundaries without changing service ownership.

## Tests

| Test File | Coverage |
|---|---|
| `test_state.py` | State transition rules and terminal states. |
| `test_validators.py` | Command and manual reason validation. |
| `test_service_integration.py` | READY asset dependency, execution, derivatives, metadata, history, failure, retry, cancel, optional enrichment. |
| `test_smoke.py` | Stage-4 service assembly. |

## Validation

Validation performed:

```text
Stage-4 test suite: 12 tests OK
Stage-1 regression suite: 10 tests OK
Stage-2 regression suite: 8 tests OK
Stage-3 regression suite: 13 tests OK
Stage-1 through Stage-4 explicit chain suite: 43 tests OK
```

## Review

- Architecture: no frozen architecture, service, domain, ownership, repository decision, or roadmap change.
- Scope: limited to Stage-4 CAP-03 with supporting CAP-02 and CAP-08 boundary only.
- Service ownership: FTV-SVC-02 owns processing jobs and media processing outputs; FTV-SVC-01 remains authoritative for assets; FTV-SVC-09 owns governance/audit records.
- Repository decisions: source components are represented as internal modules and reference patterns only; no third-party code copied.
- MVP posture: deterministic, manual-first, in-memory, no new framework or infrastructure.

## Known Limitations

- No real FFmpeg execution.
- No real thumbnail rendering.
- No real media probe for codec/duration/frame rate.
- No required OCR/STT engine.
- No external workflow engine integration.
- No persistence beyond in-memory repositories.

## Next Stage Dependency

Future stages may depend on Stage-4 completed media derivatives and metadata records. Stage-4 does not create content packages, review assignments, publishing packages, performance facts, or analytics reports.

## Self Review Report

- CAP-03 is covered for MVP media processing.
- CAP-02 is supported through read-only READY asset dependency.
- CAP-08 is represented only as an optional trigger boundary; no workflow service implementation was added.
- No duplicate record ownership introduced.
- No Stage-5/Stage-6 code added.
- No Architecture Blueprint, System Assembly, Build Roadmap, or frozen discovery artifact changed.
