# Stage-4 Media Processing Slice

## Scope

Stage-4 implements the MVP media processing slice for FTV-SVC-02. It creates and executes media processing jobs against READY assets owned by FTV-SVC-01, records derivative/metadata/enrichment outputs, and delegates ownership validation plus audit recording to FTV-SVC-09.

## In Scope

- Processing job creation, assignment, execution, retry, cancel, state history, and audit.
- Processing states: pending, running, completed, failed, cancelled.
- Derivative registration for thumbnail, preview, optimized media, and normalized media.
- Metadata extraction model for file size, hash, resolution, duration, codec, bitrate, frame rate, orientation, and extra values.
- Optional OCR/STT enrichment extension point with no required engine or provider.
- Deterministic in-memory adapters for MVP tests.

## Out of Scope

- Content packages, content versions, human review, approval, publishing, performance import, and analytics.
- Real FFmpeg execution, real OCR/STT execution, external queues, deployment topology, or storage infrastructure.
- Asset ownership changes. Stage-4 only references READY assets from Stage-3.

## Source Components

- FTV-COMP-005: FFmpeg / media normalization internal module.
- FTV-COMP-006: Thumbnail generation internal module.
- FTV-COMP-007: Metadata extraction internal module.
- FTV-COMP-008: Optional OCR/STT enrichment extension point.
- FTV-COMP-020: Kestra-style optional orchestration trigger pattern, represented only as a boundary for future workflow triggering.

## Validation

Run the Stage-4 tests and prior-stage regressions:

```powershell
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.media_processing.test_state tests.ftv.media_processing.test_validators tests.ftv.media_processing.test_service_integration tests.ftv.media_processing.test_smoke
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.governance.test_ownership tests.ftv.governance.test_rules tests.ftv.governance.test_service_integration tests.ftv.governance.test_smoke tests.ftv.source_intake.test_validators tests.ftv.source_intake.test_state tests.ftv.source_intake.test_service_integration tests.ftv.source_intake.test_smoke tests.ftv.asset_registry.test_state tests.ftv.asset_registry.test_validators tests.ftv.asset_registry.test_service_integration tests.ftv.asset_registry.test_smoke tests.ftv.media_processing.test_state tests.ftv.media_processing.test_validators tests.ftv.media_processing.test_service_integration tests.ftv.media_processing.test_smoke
```
