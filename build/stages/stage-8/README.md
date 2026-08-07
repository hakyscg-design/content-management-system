# Stage-8 Performance Import & Metric Normalization

## Scope

Stage-8 implements FTV-SVC-06 Performance Data. It owns performance imports, performance facts, metric definitions, metric mappings, import errors, and import history.

## In Scope

- Manual/CSV performance import.
- Source validation against completed Stage-7 manual publishing packages.
- Schema and required field validation.
- Metric definition and mapping.
- Unit normalization through mapping multiplier.
- Source and time normalization into performance facts.
- Import result, errors, history, audit, and traceability.

## Out of Scope

- Platform posting, Facebook/Instagram/YouTube APIs, scheduler, auto-publish, recommendation engine, AI decision, trend detection, dashboards, and analytics reports.
- Autonomous API connector implementation.
- Workflow orchestration.

## Source Components

- FTV-COMP-015: Directus staging/admin pattern, ADAPT.
- FTV-COMP-016: PostHog event ingestion reference, REFERENCE ONLY.
- FTV-COMP-020: Kestra scheduled import pattern, ADAPT as future optional trigger only.

## Validation

Run Stage-8 tests:

```powershell
C:\Users\81702\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m unittest tests.ftv.performance_data.test_state tests.ftv.performance_data.test_validators tests.ftv.performance_data.test_service_integration tests.ftv.performance_data.test_smoke
```
